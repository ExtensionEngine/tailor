export default Quill => class Tooltip extends Quill.import('ui/tooltip') {
  constructor(quill, bounds) {
    super(quill, bounds);
    this._onClick = this._onClick.bind(this);
    this.isOpen = false;
  }

  show() {
    super.show();
    this.isOpen = true;
    setTimeout(() => document.body.addEventListener('click', this._onClick), 0);
    const bounds = this.quill.getBounds(this.quill.selection.savedRange);
    this.position(bounds);
  }

  hide() {
    super.hide();
    this.isOpen = false;
    document.body.removeEventListener('click', this._onClick);
  }

  _onClick(e) {
    if (this.isOpen && !this.root.contains(e.target)) this.hide();
  }
};
