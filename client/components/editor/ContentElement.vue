<template>
  <div>
    <v-menu
      v-model="showDiscussion"
      :close-on-content-click="false"
      :min-width="300"
      offset-y left>
      <template v-slot:activator="{ on: menu }">
        <v-tooltip open-delay="800" left>
          <template v-slot:activator="{ on: tooltip }">
            <v-btn v-on="{ ...menu, ...tooltip }" color="primary" small fab>
              <v-icon class="pr-1">mdi-forum-outline</v-icon>
            </v-btn>
          </template>
          <span>Discussion</span>
        </v-tooltip>
      </template>
      <discussion :content-element="element" />
    </v-menu>
    <contained-content
      @add="add"
      @save="save"
      @save:meta="meta => updateElement({ uid: element.uid, meta })"
      @delete="remove"
      v-bind="$attrs"
      :element="element"
      :is-dragged="isDragged"
      :is-disabled="disabled" />
    <v-progress-linear
      v-if="isSaving"
      color="grey darken-2"
      height="1"
      indeterminate />
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import { ContainedContent } from 'tce-core';
import Discussion from '@/components/repository/common/Discussion';
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
  data: () => ({
    isSaving: false,
    showDiscussion: false
  }),
  computed: mapChannels({ editorChannel: 'editor' }),
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
  components: { ContainedContent, Discussion }
};
</script>

<style lang="scss" scoped>
::v-deep .discussion-container {
  margin: 0;
  border: none;
}

.v-menu__content {
  background: #fff;
}

.v-btn {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
}
</style>
