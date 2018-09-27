export default class Highlight {
  constructor(start, text) {
    this.start = start;
    this.text = text;
  }

  get end() {
    return this.start + this.text.length - 1;
  }

  get isWildcard() {
    return this.start === -1;
  }

  static fromPlainObject(object) {
    return new Highlight(object.start, object.text);
  }

  toPlainObject() {
    return { start: this.start, text: this.text };
  }

  containsOrEquals(other) {
    return this.start <= other.start && this.end >= other.end;
  }

  isContainedBy(other) {
    return (this.start >= other.start && this.end < other.end) ||
      (this.start > other.start && this.end <= other.end);
  }

  bordersFromLeft(other) {
    if (this.containsOrEquals(other)) return false;
    return (other.end >= this.start - 1 && other.end < this.end);
  }

  bordersFromRight(other) {
    if (this.containsOrEquals(other)) return false;
    return other.start <= this.end + 1 && other.start > this.start;
  }

  absorb({ left, right }) {
    if (left && left.start < this.start) {
      const highlightStartIndex = left.end - this.start + 1;
      this.start = left.start;
      this.text = left.text + this.text.substring(highlightStartIndex);
    }

    if (right && right.end > this.end) {
      const rightStartIndex = this.end - right.start + 1;
      this.text += right.text.substring(rightStartIndex);
    }
  }

  leftTrim(other) {
    if (!this.bordersFromLeft(other)) return;

    if (this.start <= other.end) {
      const startIndex = other.end - this.start + 1;
      this.text = this.text.substring(startIndex);
      this.start = other.end + 1;
    }
  }

  rightTrim(other) {
    if (!this.bordersFromRight(other)) return;

    if (this.end >= other.start) {
      const endIndex = this.text.length - (this.end - other.start) - 1;
      this.text = this.text.substring(0, endIndex);
    }
  }

  splitBy(other) {
    const endIndex = other.start - this.start;
    const otherStartIndex = endIndex + other.text.length;

    return [
      new Highlight(this.start, this.text.substring(0, endIndex)),
      new Highlight(other.end + 1, this.text.substring(otherStartIndex))
    ];
  }

  isAppropriate(text) {
    return this.text === text.substring(this.start, this.end + 1);
  }
}
