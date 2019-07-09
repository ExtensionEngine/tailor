import BaseSelect from './BaseSelect';

export default {
  name: 'meta-multiselect',
  extends: BaseSelect,
  computed: {
    isMultiSelect: () => true,
    value() {
      return this.options.filter(it => (this.meta.value || []).includes(it.value));
    }
  },
  methods: {
    parseInput(data = []) {
      return data.map(it => it.value);
    }
  }
};
