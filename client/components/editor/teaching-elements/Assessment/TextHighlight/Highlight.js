import { adjustForWildcards } from './helpers';
import inRange from 'lodash/inRange';

const wildcardIndex = -1;

export default class Highlight {
  constructor(start, text, isWildcard = false) {
    this.start = start;
    this.text = text;
    this.isWildcard = isWildcard;
  }

  get end() {
    return this.start + this.length - 1;
  }

  get length() {
    return this.text.length;
  }

  static isWildcardObject(object) {
    return object.start === wildcardIndex;
  }

  static toWildcardObject(text) {
    return { start: wildcardIndex, text };
  }

  absorb({ left, right }, wildcards) {
    if (left && left.start < this.start) {
      const highlightStartIndex = left.end - this.start + 1;
      this.start = left.start;
      this.text = left.text + this.text.substring(highlightStartIndex);
    }

    if (right && right.end > this.end) {
      const rightStartIndex = this.end - right.start + 1;
      this.text += right.text.substring(rightStartIndex);
    }

    adjustForWildcards(this, wildcards);
  }

  bordersFromLeft(other) {
    if (this.equals(other)) return false;
    if (this.contains(other)) return false;
    return other.start <= this.start &&
      inRange(other.end, this.start - 1, this.end + 1);
  }

  bordersFromRight(other) {
    if (this.equals(other)) return false;
    if (this.contains(other)) return false;
    return other.end >= this.end &&
      inRange(other.start + 1, this.start, this.end + 2);
  }

  contains(other) {
    if (this.equals(other)) return false;
    return this.start < other.start && this.end > other.end;
  }

  equals(other) {
    return this.start === other.start && this.end === other.end;
  }

  splitBy(other, wildcards) {
    const endIndex = other.start - this.start;
    const otherStartIndex = endIndex + other.length;
    const left = new Highlight(this.start, this.text.substring(0, endIndex));
    const right = new Highlight(
      other.end + 1,
      this.text.substring(otherStartIndex)
    );

    return [
      adjustForWildcards(left, wildcards),
      adjustForWildcards(right, wildcards)
    ];
  }

  toPlainObject() {
    const start = this.isWildcard ? wildcardIndex : this.start;
    return { start, text: this.text };
  }

  trim(other, wildcards) {
    if (!this.bordersFromLeft(other) && !this.bordersFromRight(other)) return;

    if (this.bordersFromLeft(other) && this.start <= other.end) {
      const startIndex = other.end - this.start + 1;
      this.text = this.text.substring(startIndex);
      this.start = other.end + 1;
    }

    if (this.bordersFromRight(other) && this.end >= other.start) {
      const endIndex = this.length - (this.end - other.start) - 1;
      this.text = this.text.substring(0, endIndex);
    }

    adjustForWildcards(this, wildcards);
  }
}
