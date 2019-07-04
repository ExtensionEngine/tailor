<template>
  <jodit-vue
    ref="jodit"
    :id="id"
    :config="config"
    :value="value"
    @input="value => $emit('input', value)"/>
</template>

<script>
import 'jodit/build/jodit.min.css';
import { getIcon, renderToolbar } from './util';
import cuid from 'cuid';
import JoditVue from 'jodit-vue';

export default {
  props: {
    value: { type: String, required: true }
  },
  computed: {
    id() {
      return cuid();
    },
    config() {
      return {
        events: { getIcon },
        minHeight: 200,
        toolbar: false,
        autofocus: true
      };
    }
  },
  mounted() {
    renderToolbar(this.$refs.jodit.editor);
  },
  components: {
    JoditVue
  }
};
</script>
