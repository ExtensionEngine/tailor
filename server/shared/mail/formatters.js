import { htmlToText } from 'html-to-text';

function html() {
  return (text, render) => htmlToText(render(text));
}

export { html };
