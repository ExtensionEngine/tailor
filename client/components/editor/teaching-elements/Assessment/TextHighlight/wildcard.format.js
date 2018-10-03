import { Quill } from 'vue-quill-editor';

const Bold = Quill.import('formats/bold');

class Wildcard extends Bold {}
Wildcard.blotName = 'wildcard';
Wildcard.tagName = ['SPAN'];
Wildcard.className = 'ql-wildcard';

export default Wildcard;
