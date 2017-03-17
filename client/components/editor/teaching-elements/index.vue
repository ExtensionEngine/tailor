<template>
  <div :class="columnWidth" class="te-container">
    <div @click="focus" class="teaching-element">
      <component
        :is="resolveElement(element.type)"
        :element="element"
        :isFocused="isFocused"
        @save="save">
      </component>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import TeAssessment from './Assessment';
import TeBreak from './PageBreak';
import TeEmbed from './Embed';
import TeHtml from './Html';
import TeImage from './Image';
import TeVideo from './Video';

const TE_TYPES = {
  BREAK: 'te-break',
  EMBED: 'te-embed',
  HTML: 'te-html',
  IMAGE: 'te-image',
  ASSESSMENT: 'te-assessment',
  VIDEO: 'te-video'
};

export default {
  name: 'teaching-element',
  props: {
    element: Object,
    disabled: Boolean
  },
  computed: {
    ...mapGetters(['focusedElement'], 'editor'),
    isFocused() {
      if (!this.focusedElement) return false;
      return this.focusedElement.embedded
        ? this.focusedElement.id === this.element.id
        : this.focusedElement._cid === this.element._cid;
    },
    columnWidth() {
      const data = this.element.data;
      return data && data.width ? `col-xs-${data.width}` : 'col-xs-12';
    }
  },
  methods: {
    ...mapActions({ updateElement: 'update' }, 'tes'),
    ...mapMutations(['focusElement'], 'editor'),
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
      if (this.element.embedded) {
        this.$emit('save', this.element);
      } else {
        this.updateElement(this.element);
      }
    }
  },
  components: {
    TeAssessment,
    TeBreak,
    TeEmbed,
    TeHtml,
    TeImage,
    TeVideo
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
