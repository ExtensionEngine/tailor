<template>
  <div class="te-wrapper">
    <div :class="{ inactive: !showActiveUsers }" class="active-users-wrapper">
      <active-users :users="contentActiveUsers" :size="26" vertical theme="light"/>
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
  data() {
    return {
      isFocused: false,
      timer: null
    };
  },
  computed: {
    ...mapGetters(['activeUsers'], 'course'),
    contentActiveUsers() {
      const { contentId } = this.element;
      return this.activeUsers.content[contentId] || [];
    },
    showActiveUsers() {
      return this.contentActiveUsers.length;
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
    },
    setFocus() {
      EventBus.on('element:focus', element => {
        this.isFocused = !!element && (element.id === this.element.id);
      });
    }
  },
  watch: {
    isFocused() {
      const { courseId, activityId, contentId } = this.element;
      const params = { courseId, activityId, contentId };
      if (this.isFocused) {
        api.addActiveUser(params);
        this.timer = setInterval(() => api.addActiveUser(params), 4000);
        return;
      }
      clearInterval(this.timer);
      api.removeActiveUser(params);
    }
  },
  created() {
    this.setFocus();
  },
  beforeDestroy() {
    const { courseId, activityId, contentId } = this.element;
    clearInterval(this.timer);
    api.removeActiveUser({ courseId, activityId, contentId });
  },
  components: { ActiveUsers, ContainedContent }
};
</script>

<style lang="scss">
.active-users-wrapper {
  position: absolute;
  right: -1rem;
  margin-top: 1rem;
  transition: all 0.5s ease;

  &.inactive {
    opacity: 0;
    transition: all 0.5s ease;
  }

  .active-users { margin-right: 0; }
}
</style>
