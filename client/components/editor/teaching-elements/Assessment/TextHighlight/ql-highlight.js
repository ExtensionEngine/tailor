import { Quill } from 'vue-quill-editor';

const Bold = Quill.import('formats/bold');

class Highlight extends Bold {}
Highlight.blotName = 'highlight';
Highlight.tagName = ['SPAN'];
Highlight.className = 'ql-highlight';

export default Highlight;
