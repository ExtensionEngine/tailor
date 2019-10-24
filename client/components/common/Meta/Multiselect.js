import BaseSelect from './BaseSelect';

const includes = (arr, ...args) => arr.includes(...args);

export default {
  name: 'meta-multiselect',
  extends: BaseSelect,
  computed: {
    isMultiSelect: () => true,
    value: ({ meta, options }) => {
      return options.filter(it => includes(meta.value || [], it.value));
    }
  },
  methods: {
    parseInput: (data = []) => data.map(it => it.value)
  }
};
