<template>
  <div>
    <contained-content
      @add="add"
      @save="save"
      @save:meta="meta => updateElement({ uid: element.uid, meta })"
      @delete="remove"
      v-bind="$attrs"
      :element="element"
      :is-dragged="isDragged"
      :is-disabled="disabled"
      display-discussion />
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
import get from 'lodash/get';
import loader from '@/components/common/loader';
import { mapChannels } from '@/plugins/radio';
import throttle from 'lodash/throttle';

const COMMENT_EVENTS = [
  { event: 'comment:save', action: 'upsertComment' },
  { event: 'comment:remove', action: 'deleteComment' },
  { event: 'comment:set-last-seen', action: 'setLastSeenComment' }
];

const extractParams = ({ activity, element }) => ({
  activityId: activity.id,
  contentElementId: element.id
});

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
    ...mapGetters('editor', ['activity']),
    ...mapGetters('repository/comments', ['getUnseenElementComments', 'getComments']),
    params: vm => extractParams(vm),
    comments: vm => vm.getComments(vm.params),
    lastCommentAt: vm => new Date(get(vm.comments[0], 'createdAt', 0)).getTime(),
    elementBus: vm => vm.$radio.channel(`element:${vm.element.id}`),
    unseenComments() {
      const { id: activityId, uid: activityUid } = this.activity;
      const element = { ...this.element, activityUid, activityId };
      return this.getUnseenElementComments(element);
    }
  },
  methods: {
    ...mapActions('repository/contentElements', {
      saveElement: 'save',
      updateElement: 'update',
      removeElement: 'remove'
    }),
    ...mapActions('repository/comments', {
      fetchComments: 'fetch',
      saveComment: 'save',
      updateComment: 'update',
      removeComment: 'remove'
    }),
    ...mapMutations('repository/comments', ['markSeenComments']),
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
    },
    async upsertComment(comment) {
      const action = comment.id ? 'updateComment' : 'saveComment';
      await this[action]({ ...comment, ...this.params });
      return this.emitCommentsData();
    },
    async deleteComment(comment) {
      await this.removeComment(comment);
      return this.emitCommentsData();
    },
    emitCommentsData() {
      const { comments, unseenComments, lastCommentAt } = this;
      const data = { comments, unseenComments, lastCommentAt };
      this.elementBus.emit('comments:init', data);
    },
    setLastSeenComment(timeout) {
      const { element, lastCommentAt } = this;
      const payload = { elementUid: element.uid, lastCommentAt };
      setTimeout(() => {
        this.markSeenComments(payload);
        this.emitCommentsData();
      }, timeout);
    }
  },
  watch: {
    unseenComments: 'emitCommentsData'
  },
  async created() {
    await this.fetchComments(this.params);
    this.emitCommentsData();
    COMMENT_EVENTS.forEach(({ event, action }) => {
      this.elementBus.on(event, data => this[action](data));
    });
  },
  provide() {
    return { $elementBus: this.elementBus };
  },
  components: { ContainedContent }
};
</script>
