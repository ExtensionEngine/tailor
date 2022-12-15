import htmlToText from 'html-to-text';

function html() {
  return (text, render) => htmlToText.fromString(render(text));
}

export { html };
