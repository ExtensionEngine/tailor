import BaseSelect from './BaseSelect';

export default {
  name: 'meta-select',
  extends: BaseSelect,
  computed: {
    isMultiSelect: () => false,
    value: ({ meta, options }) => options.find(it => it.value === meta.value)
  },
  methods: {
    parseInput: data => data.value || null
  }
};
