// Example Deno based proxy server for those who can't or don't want to use the
// companion browser extension.

import { serve } from 'https://deno.land/std@0.148.0/http/server.ts';

const port = 8080;

const ALLOWED_HEADERS = [
  'Origin',
  'X-Requested-With',
  'Content-Type',
  'Accept',
  'Authorization',
  'x-goog-visitor-id',
  'x-goog-api-key',
  'x-origin',
  'x-youtube-client-version',
  'x-youtube-client-name',
  'x-goog-api-format-version',
  'x-goog-authuser',
  'x-user-agent',
  'Accept-Language',
  'X-Goog-FieldMask',
  'Range',
  'Referer',
  'Cookie'
].join(', ');

function copyHeader(headerName: string, to: Headers, from: Headers) {
  const hdrVal = from.get(headerName);
  if (hdrVal) {
    to.set(headerName, hdrVal);
  }
}

const handler = async (request: Request): Promise<Response> => {
  const origin = request.headers.get('origin') || '';

  request.headers.forEach((value, key) => {
    console.log(key, value);
  });

  // If options send do CORS preflight
  if (request.method === 'OPTIONS') {
    const response = new Response('', {
      status: 200,
      headers: new Headers({
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': ALLOWED_HEADERS,
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'true'
      })
    });
    return response;
  }

  const url = new URL(request.url, 'http://localhost/');
  if (!url.searchParams.has('__host')) {
    return new Response(
      'Request is formatted incorrectly. Please include __host in the query string.',
      { status: 400 }
    );
  }

  // Set the URL host to the __host parameter
  url.host = url.searchParams.get('__host')!;
  url.protocol = 'https';
  url.port = '443';
  url.searchParams.delete('__host');

  // Copy headers from the request to the new request
  const request_headers = new Headers(
    JSON.parse(url.searchParams.get('__headers') || '{}')
  );
  copyHeader('range', request_headers, request.headers);

  if (!request_headers.has('user-agent'))
    copyHeader('user-agent', request_headers, request.headers);

  url.searchParams.delete('__headers');


  if (url.host.includes('youtube')) {
    request_headers.set('origin', 'https://www.youtube.com');
    request_headers.set('referer', 'https://www.youtube.com/');
  }
  
  if (request.headers.has('Authorization')) {
    request_headers.set('Authorization', request.headers.get('Authorization')!);
  }

  const fetchRes = await fetch(url, {
    method: request.method,
    headers: request_headers,
    body: request.body,
    credentials: 'same-origin'
  });

  // Construct the return headers
  const headers = new Headers();

  // Copy content headers
  copyHeader('content-length', headers, fetchRes.headers);
  copyHeader('content-type', headers, fetchRes.headers);
  copyHeader('content-disposition', headers, fetchRes.headers);
  copyHeader('accept-ranges', headers, fetchRes.headers);
  copyHeader('content-range', headers, fetchRes.headers);

  // Add cors headers
  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Access-Control-Allow-Headers', ALLOWED_HEADERS);
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Credentials', 'true');

  // Return the proxied response
  return new Response(fetchRes.body, {
    status: fetchRes.status,
    headers: headers
  });
};

await serve(handler, { port });
