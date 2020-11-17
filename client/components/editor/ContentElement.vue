<template>
  <div>
    <v-menu
      v-model="showDiscussion"
      :close-on-content-click="false"
      :min-width="350"
      attach offset-y left>
      <template v-slot:activator="{ on: menu }">
        <v-tooltip open-delay="800" left>
          <template v-slot:activator="{ on: tooltip }">
            <v-badge
              v-show="unseenComments.length"
              :content="unseenComments.length"
              color="secondary"
              offset-y="14"
              offset-x="14" />
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
import { mapActions, mapGetters, mapMutations } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import { ContainedContent } from 'tce-core';
import Discussion from '@/components/repository/common/Discussion';
import get from 'lodash/get';
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
    ...mapGetters('repository/comments', ['getUnseenComments', 'getComments']),
    comments: vm => vm.getComments({ activityId: vm.activity.id }),
    lastCommentAt: vm => new Date(get(vm.comments[0], 'createdAt', 0)).getTime(),
    unseenComments: vm => vm.getUnseenComments(vm.activity)
      .filter(it => it.contentElementId === vm.element.id)
  },
  methods: {
    ...mapActions('repository/contentElements', {
      saveElement: 'save',
      updateElement: 'update',
      removeElement: 'remove'
    }),
    ...mapMutations('repository/contentElements', { addElement: 'add' }),
    ...mapMutations('repository/comments', ['markSeenComments']),
    setLastSeenComment(timeout) {
      const payload = {
        activityUid: this.activity.uid,
        lastCommentAt: this.lastCommentAt
      };
      setTimeout(() => this.markSeenComments(payload), timeout);
    },
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
  watch: {
    showDiscussion(val) {
      if (!val) return;
      if (!this.lastCommentAt) return;
      this.setLastSeenComment(1000);
    },
    comments(val, oldVal) {
      if (!this.showDiscussion) return;
      if (val === oldVal) return;
      this.setLastSeenComment(2000);
    }
  },
  components: { ContainedContent, Discussion }
};
</script>

<style lang="scss" scoped>
.v-menu__content {
  background: #fff;
}

::v-deep .v-badge, .v-btn {
  position: absolute;
  top: 0.5rem;
  right: 0;
  z-index: 2;
}

::v-deep {
  .discussion-container {
    margin: 0;
    border: none;

    .header {
      text-align: left;
    }
  }

  .v-badge {
    z-index: 3;
  }
}
</style>
