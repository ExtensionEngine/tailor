import _set from 'lodash/set';
import produce from 'immer';

export function set(source, key, value) {
  return produce(source, draft => {
    _set(draft, key, value);
  });
}
