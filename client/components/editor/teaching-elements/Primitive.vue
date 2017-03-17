<template>
  <div class="te-container col-xs-12">
    <div @click="focus" class="teaching-element">
      <component
        :is="resolveElement(element.type)"
        :element="initialElement"
        :isFocused="isFocused"
        @save="save">
      </component>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import TeHtml from './Html';
import TeImage from './Image';

const TE_TYPES = { HTML: 'te-html', IMAGE: 'te-image' };

export default {
  name: 'te-primitive',
  props: {
    initialElement: Object,
    disabled: Boolean
  },
  data() {
    return {
      element: cloneDeep(this.initialElement)
    };
  },
  computed: {
    ...mapGetters(['focusedElement'], 'editor'),
    isFocused() {
      if (!this.focusedElement.type) return false;
      return this.focusedElement.embedded
        ? this.focusedElement.id === this.element.id
        : this.focusedElement._cid === this.element._cid;
    }
  },
  methods: {
    ...mapMutations(['focusElement'], 'editor'),
    ...mapActions({ updateElement: 'update' }, 'tes'),
    resolveElement(type) {
      return TE_TYPES[type];
    },
    focus(e) {
      if (this.disabled) return;
      this.focusElement(this.element);
      // Attach component meta
      e.component = { name: 'teaching-element', data: this.element };
    },
    save(data) {
      Object.assign(this.element.data, data);
      this.$emit('save', this.element);
    }
  },
  components: {
    TeHtml,
    TeImage
  }
};
</script>

<style lang="scss" scoped>
.te-container {
  padding: 7px 0;
}

.teaching-element {
  padding: 10px;
  border: 1px dashed #ccc;
}
</style>
