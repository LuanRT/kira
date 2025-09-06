import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import 'shaka-player/dist/controls.css';

const app = createApp(App);

// Hack for inlining html properly in text nodes.
app.directive('inline-html', (el) => {
  if (!el) {
    return;
  }

  const content = el.tagName === 'TEMPLATE' ? el.content : el;
  if (content.children.length === 1) {
    [ ...el.attributes ].forEach((attr) => content.firstChild.setAttribute(attr.name, attr.value));
  }

  if (el.tagName === 'TEMPLATE') {
    el.replaceWith(el.content);
  } else {
    el.replaceWith(...el.children);
  }
});

app.use(router);
app.mount('#app');