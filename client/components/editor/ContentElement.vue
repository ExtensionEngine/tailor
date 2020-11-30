<template>
  <div :class="{ 'published-preview': isPublishedPreview }">
    <v-chip
      v-if="isPublishedPreview && publishState"
      :text-color="element.isPublished ? 'secondary' : 'success'"
      color="blue-grey lighten-5"
      small round
      class="published-preview-label font-weight-medium text-capitalize">
      {{ publishState }}
    </v-chip>
    <contained-content
      @add="add"
      @save="save"
      @save:meta="meta => updateElement({ uid: element.uid, meta })"
      @delete="remove"
      v-bind="$attrs"
      :element="element"
      :is-dragged="isDragged"
      :is-disabled="isPublishedPreview || disabled"
      :class="publishState" />
    <v-progress-linear
      v-if="isSaving"
      color="grey darken-2"
      height="1"
      indeterminate />
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import { ContainedContent } from 'tce-core';
import loader from '@/components/common/loader';
import { mapChannels } from '@/plugins/radio';
import throttle from 'lodash/throttle';

export default {
  name: 'content-element',
  inheritAttrs: false,
  props: {
    element: { type: Object, required: true },
    disabled: { type: Boolean, default: false },
    isDragged: { type: Boolean, default: false }
  },
  data: () => ({ isSaving: false }),
  computed: {
    ...mapChannels({ editorChannel: 'editor' }),
    ...mapState('editor', ['isPublishedPreview']),
    publishState() {
      if (!this.element.isPublished) return 'added';
      if (this.element.isModified) return 'changed';
      if (this.element.isRemoved) return 'removed';
      return null;
    }
  },
  methods: {
    ...mapActions('repository/contentElements', {
      saveElement: 'save',
      updateElement: 'update',
      removeElement: 'remove'
    }),
    ...mapMutations('repository/contentElements', { addElement: 'add' }),
    add(element) {
      this.addElement({ ...this.element, ...cloneDeep(element) });
    },
    save: loader(async function (data) {
      const element = cloneDeep(this.element);
      Object.assign(element.data, data);
      if (element.embedded) return this.$emit('save', element);
      await this.saveElement(element);
      this.showNotification();
    }, 'isSaving', 1000),
    showNotification: throttle(function () {
      this.$snackbar.show('Element saved');
    }, 4000),
    remove() {
      this.removeElement(this.element).then(() => {
        this.$nextTick(() => this.editorChannel.emit('element:focus'));
      });
    }
  },
  components: { ContainedContent }
};
</script>

<style lang="scss" scoped>
@mixin highlight($color) {
  ::v-deep > .content-element {
    box-shadow: 0 0 0 2px $color;
  }
}

.published-preview {
  &-label {
    position: absolute;
    top: 2rem;
    right: 1.5rem;
  }

  ::v-deep .content-element {
    padding: 40px 20px 10px;
  }

  .added {
    @include highlight(var(--v-success-lighten2));
  }

  .changed, .removed {
    @include highlight(var(--v-secondary-lighten4));
  }
}
</style>
