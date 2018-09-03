import cloneDeep from 'lodash/cloneDeep';
import curry from 'lodash/curry';
import curryRight from 'lodash/curryRight';
import first from 'lodash/first';
import inRange from 'lodash/inRange';
import last from 'lodash/last';
import reject from 'lodash/reject';

export default class Selections {
  constructor(selection = []) {
    this.ranges = cloneDeep(selection);
  }

  merge(selection) {
    const begin = first(selection);
    const final = last(selection);
    const check = curry(isOverlaped);
    const beginOverlap = this.ranges.find(check(begin));
    const endOverlap = this.ranges.find(check(final - 1));
    const range = [first(beginOverlap) || begin, last(endOverlap) || final];
    this.remove(range);
    this.ranges.push(range);
    return range;
  }

  remove(range) {
    const check = curryRight(isOverlaped)(range);
    this.ranges = reject(this.ranges, range => (
      check(first(range)) || check(last(range) - 1)
    ));
  }

  getByIndex(index) {
    const check = curry(isOverlaped)(index);
    return this.ranges.find(check);
  }
}

function isOverlaped(index, selection) {
  const start = first(selection);
  const end = last(selection);
  return inRange(index, start, end);
}
