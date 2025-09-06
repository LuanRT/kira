import {
  CompressionType,
  OnesieHeader,
  OnesieHeaderType,
  OnesieInnertubeRequest,
  OnesieInnertubeResponse,
  OnesieProxyStatus,
  OnesieRequest,
  SabrError,
  UMPPartId
} from 'googlevideo/protos';

import { Constants } from 'youtubei.js/web';
import type { OnesieHotConfig } from '@/utils/helpers';
import { encryptRequest, fetchFunction, REDIRECTOR_STORAGE_KEY } from '@/utils/helpers';
import { CompositeBuffer, UmpReader } from 'googlevideo/ump';
import { base64ToU8 } from 'googlevideo/utils';
import type { Part } from 'googlevideo/shared-types';

type OnesieRequestArgs = {
  clientConfig: OnesieHotConfig;
  innertubeRequest: Record<string, any>;
}

type PartHandler = (part: Part) => void;

/**
 * Prepares the request body for a Onesie request.
 * @param args - Client configuration, and InnerTube request.
 */
async function prepareOnesieRequest(args: OnesieRequestArgs) {
  const { innertubeRequest, clientConfig } = args;

  const {
    baseUrl,
    clientKeyData,
    encryptedClientKey,
    onesieUstreamerConfig
  } = clientConfig;

  const headers = [
    {
      name: 'Content-Type',
      value: 'application/json'
    },
    {
      name: 'User-Agent',
      value: innertubeRequest.context.client.userAgent
    },
    {
      name: 'X-Goog-Visitor-Id',
      value: innertubeRequest.context.client.visitorData
    }
  ];

  const onesieInnertubeRequest = OnesieInnertubeRequest.encode({
    url: 'https://youtubei.googleapis.com/youtubei/v1/player?key=AIzaSyDCU8hByM-4DrUqRUYnGn-3llEO78bcxq8&$fields=playerConfig,storyboards,captions,playabilityStatus,streamingData,responseContext.mainAppWebResponseContext.datasyncId,videoDetails.isLive,videoDetails.isLiveContent,videoDetails.title,videoDetails.author,playbackTracking.videostatsPlaybackUrl,playbackTracking.videostatsWatchtimeUrl',
    headers,
    body: JSON.stringify(innertubeRequest),
    proxiedByTrustedBandaid: true,
    skipResponseEncryption: true
  }).finish();

  const {
    encrypted,
    hmac,
    iv
  } = await encryptRequest(clientKeyData, onesieInnertubeRequest);

  const body = OnesieRequest.encode({
    urls: [],
    innertubeRequest: {
      iv: iv,
      hmac: hmac,
      enableCompression: true,
      encryptedClientKey,
      encryptedOnesieInnertubeRequest: encrypted,
      serializeResponseAsJson: true,
      ustreamerFlags: { sendVideoPlaybackConfig: false }
    },
    streamerContext: {
      sabrContexts: [],
      unsentSabrContexts: [],
      clientInfo: {
        clientName: parseInt(Constants.CLIENT_NAME_IDS[innertubeRequest.context.client.clientName as keyof typeof Constants.CLIENT_NAME_IDS]),
        clientVersion: innertubeRequest.context.client.clientVersion
      }
    },
    reloadPlaybackParams: innertubeRequest.playbackContext?.reloadPlaybackParams,
    bufferedRanges: [],
    onesieUstreamerConfig
  }).finish();

  const videoIdBytes = base64ToU8(innertubeRequest.videoId);
  const encodedVideoIdChars = [];

  for (const byte of videoIdBytes) {
    encodedVideoIdChars.push(byte.toString(16).padStart(2, '0'));
  }

  const encodedVideoId = encodedVideoIdChars.join('');

  return { baseUrl, body, encodedVideoId };
}

export async function makePlayerRequest(args: OnesieRequestArgs) {
  const { baseUrl, body, encodedVideoId } = await prepareOnesieRequest(args);

  let redirectorResponseUrl = localStorage.getItem(REDIRECTOR_STORAGE_KEY);

  if (!redirectorResponseUrl) {
    const redirectorResponse = await fetchFunction(`https://redirector.googlevideo.com/initplayback?source=youtube&itag=0&pvi=0&pai=0&owc=yes&cmo:sensitive_content=yes&alr=yes&id=${Math.round(Math.random() * 1E5)}`, { method: 'GET' });
    redirectorResponseUrl = await redirectorResponse.text();
    if (!redirectorResponseUrl.startsWith('https://'))
      throw new Error('Invalid redirector response');
  }

  let url = `${redirectorResponseUrl.split('/initplayback')[0]}${baseUrl}`;

  const queryParams = [];
  queryParams.push(`id=${encodedVideoId}`);
  queryParams.push('cmo:sensitive_content=yes');
  queryParams.push('opr=1'); // Onesie Playback Request.
  queryParams.push('osts=0'); // Onesie Start Time Seconds.
  queryParams.push('por=1');
  queryParams.push('rn=0');

  url += `&${queryParams.join('&')}`;

  const response = await fetchFunction(url, {
    method: 'POST',
    body: body as any
  });

  const arrayBuffer = await response.arrayBuffer();
  const googUmp = new UmpReader(new CompositeBuffer([ new Uint8Array(arrayBuffer) ]));

  const onesie: (OnesieHeader & { data?: Uint8Array })[] = [];

  function handleSabrError(part: Part) {
    const data = part.data.chunks[0];
    const error = SabrError.decode(data);
    console.error('[SABR_ERROR]:', error);
  }

  function handleOnesieHeader(part: Part) {
    const data = part.data.chunks[0];
    onesie.push(OnesieHeader.decode(data));
  }

  function handleOnesieData(part: Part) {
    const data = part.data.chunks[0];
    if (onesie.length > 0) {
      onesie[onesie.length - 1].data = data;
    } else {
      console.warn('Received ONESIE_DATA without a preceding ONESIE_HEADER');
    }
  }

  const umpPartHandlers = new Map<UMPPartId, PartHandler>([
    [ UMPPartId.SABR_ERROR, handleSabrError ],
    [ UMPPartId.ONESIE_HEADER, handleOnesieHeader ],
    [ UMPPartId.ONESIE_DATA, handleOnesieData ]
  ]);

  googUmp.read((part) => {
    const handler = umpPartHandlers.get(part.type);
    if (handler)
      handler(part);
  });

  const onesiePlayerResponse = onesie.find((header) => header.type === OnesieHeaderType.ONESIE_PLAYER_RESPONSE);

  if (!onesiePlayerResponse?.cryptoParams)
    throw new Error('Crypto params not found');

  let responseData = onesiePlayerResponse.data;

  if (responseData && onesiePlayerResponse.cryptoParams.compressionType === CompressionType.GZIP) {
    const ds = new DecompressionStream('gzip');
    const stream = new Blob([ responseData as any ]).stream().pipeThrough(ds);
    responseData = await new Response(stream).arrayBuffer().then((buf) => new Uint8Array(buf));
  }

  const onesieInnertubeResponse = OnesieInnertubeResponse.decode(responseData!);

  if (onesieInnertubeResponse.onesieProxyStatus !== OnesieProxyStatus.OK)
    throw new Error('Onesie proxy status not OK');

  if (onesieInnertubeResponse.httpStatus !== 200)
    throw new Error('Http status not OK');

  return {
    success: true,
    status_code: 200,
    data: JSON.parse(new TextDecoder().decode(onesieInnertubeResponse.body))
  };
}
