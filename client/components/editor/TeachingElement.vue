<template>
  <div>
    <div :class="{ inactive: !contentActiveUsers.length }" class="active-users-wrapper">
      <active-users :users="contentActiveUsers" :size="26" theme="light"/>
    </div>
    <contained-content
      v-bind="$attrs"
      :element="element"
      :isDragged="dragged"
      :isDisabled="disabled"
      @add="add"
      @save="save"
      @delete="remove"/>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import ActiveUsers from 'components/common/ActiveUsers';
import api from '../../api/course';
import cloneDeep from 'lodash/cloneDeep';
import { ContainedContent } from 'tce-core';
import EventBus from 'EventBus';
import throttle from 'lodash/throttle';

export default {
  name: 'teaching-element',
  inheritAttrs: false,
  props: {
    element: { type: Object, required: true },
    disabled: { type: Boolean, default: false },
    dragged: { type: Boolean, default: false }
  },
  computed: {
    ...mapGetters(['activeUsers'], 'course'),
    contentActiveUsers() {
      const { contentId } = this.element;
      return this.activeUsers.content[contentId] || [];
    }
  },
  methods: {
    ...mapActions({ saveElement: 'save', removeElement: 'remove' }, 'tes'),
    ...mapMutations({ addElement: 'add' }, 'tes'),
    add(element) {
      this.addElement({ ...this.element, ...cloneDeep(element) });
    },
    save(data) {
      const element = cloneDeep(this.element);
      Object.assign(element.data, data);
      if (element.embedded) return this.$emit('save', element);
      return this.saveElement(element)
        .then(() => this.showNotification());
    },
    showNotification: throttle(function () {
      this.$snackbar.show('Element saved');
    }, 4000),
    remove() {
      this.removeElement(this.element).then(() => {
        this.$nextTick(() => EventBus.emit('element:focus'));
      });
    }
  },
  created() {
    EventBus.on('element:focus', element => {
      const isFocused = !!element && (element.id === this.element.id);
      if (!isFocused) return;
      const { courseId, activityId, contentId } = this.element;
      api.addActiveUser({ courseId, activityId, contentId });
    });
  },
  components: { ActiveUsers, ContainedContent }
};
</script>

<style lang="scss">
.active-users-wrapper {
  display: flex;
  justify-content: flex-end;
  height: 30px;
  margin-bottom: -2px;
  transition: all 0.3s ease;
  overflow: hidden;

  &.inactive {
    height: 0;
    transition: all 0.3s ease;
  }
}
</style>
