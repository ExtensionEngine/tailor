import min from 'lodash/min';
import max from 'lodash/max';
import Range from './Range';
import reject from 'lodash/reject';

export default class Selections {
  constructor(selections = []) {
    this.ranges = selections.map(it => new Range(...it));
  }

  merge(range) {
    const overlapses = this.ranges.filter(it => it.intersectsWith(range));
    range.start = min([...overlapses.map(it => it.start), range.start]);
    range.end = max([...overlapses.map(it => it.end), range.end]);
    this.remove(range);
    this.ranges.push(range);
    return range;
  }

  export() {
    return this.ranges.map(it => [...it]);
  }

  remove(range) {
    this.ranges = reject(this.ranges, it => range.intersectsWith(it));
  }

  getByIndex(index) {
    const range = new Range(index, index + 1);
    return this.ranges.find(it => it.intersectsWith(range));
  }
}
