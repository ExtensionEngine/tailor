<template>
  <div>
    <v-menu
      v-model="showDiscussion"
      :close-on-content-click="false"
      transition="slide-y-transition"
      min-width="300"
      attach offset-y left>
      <template v-slot:activator="{ on: menu }">
        <v-tooltip open-delay="800" left>
          <template v-slot:activator="{ on: tooltip }">
            <v-badge
              v-show="unseenCommentCount"
              :content="unseenCommentCount"
              color="secondary" />
            <v-btn v-on="{ ...menu, ...tooltip }" color="primary" x-small fab>
              <v-icon class="pr-1">mdi-forum-outline</v-icon>
            </v-btn>
          </template>
          <span>Discussion</span>
        </v-tooltip>
      </template>
      <content-element-discussion
        :activity="activity"
        :content-element="element"
        :is-visible="showDiscussion" />
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
import { mapActions, mapGetters, mapMutations } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import { ContainedContent } from 'tce-core';
import ContentElementDiscussion from '@/components/repository/common/Discussion';
import loader from '@/components/common/loader';
import { mapChannels } from '@/plugins/radio';
import throttle from 'lodash/throttle';

export default {
  name: 'content-element',
  inheritAttrs: false,
  props: {
    activity: { type: Object, required: true },
    element: { type: Object, required: true },
    disabled: { type: Boolean, default: false },
    isDragged: { type: Boolean, default: false }
  },
  data: () => ({
    isSaving: false,
    showDiscussion: false,
    unseenCommentCount: 0
  }),
  computed: {
    ...mapChannels({ editorChannel: 'editor' }),
    ...mapGetters('repository/comments', ['getUnseenComments']),
    unseenComments: vm => vm.getUnseenComments({ contentElement: vm.element })
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
    async remove() {
      await this.removeElement(this.element);
      this.$nextTick(() => this.editorChannel.emit('element:focus'));
    }
  },
  watch: {
    unseenComments(comments) {
      if (this.showDiscussion && comments.length) return;
      setTimeout(() => (this.unseenCommentCount = comments.length), 200);
    }
  },
  components: { ContainedContent, ContentElementDiscussion }
};
</script>

<style lang="scss" scoped>
.v-menu__content {
  background: #fff;
}

.v-btn {
  position: absolute;
  top: 0.5rem;
  right: 0;
  z-index: 2;
}

::v-deep {
  .discussion-container {
    margin: 0.5rem 0;
    border: none;

    .header {
      text-align: left;
    }
  }

  .v-badge {
    position: absolute;
    top: 1.125rem;
    right: 0.5rem;
    z-index: 3;
  }
}
</style>
