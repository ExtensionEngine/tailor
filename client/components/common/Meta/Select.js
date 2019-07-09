import BaseSelect from './BaseSelect';
import find from 'lodash/find';
import get from 'lodash/get';

export default {
  name: 'meta-select',
  extends: BaseSelect,
  computed: {
    isMultiSelect: () => false,
    value() {
      return find(this.options, { value: this.meta.value });
    }
  },
  methods: {
    parseInput: data => get(data, 'value', null)
  }
};
