import map from 'lodash/map';

export default class Highlight {
  constructor(start, text) {
    this._start = start;
    this._text = text;
  }

  get start() {
    return this._start;
  }

  set start(value) {
    this._start = value;
  }

  get text() {
    return this._text;
  }

  set text(value) {
    this._text = value;
  }

  get end() {
    return this.start + this.text.length - 1;
  }

  static fromPlainObjects(objects) {
    return map(objects, o => new Highlight(o.start, o.text));
  }

  static toPlainObjects(highlights) {
    return map(highlights, h => ({ start: h.start, text: h.text }));
  }

  contains(other) {
    return this.start <= other.start && this.end >= other.end;
  }

  isContainedBy(other) {
    return (this.start >= other.start && this.end < other.end) ||
      (this.start > other.start && this.end <= other.end);
  }

  bordersFromLeft(other) {
    if (this.contains(other)) return false;
    return (other.end >= this.start - 1 && other.end < this.end);
  }

  bordersFromRight(other) {
    if (this.contains(other)) return false;
    return other.start <= this.end + 1 && other.start > this.start;
  }
}
