<template>
  <div class="te-wrapper">
    <div :class="{ inactive: !showActiveUsers }" class="active-users-wrapper">
      <active-users
        v-if="activeUsers"
        :users="activeUsers"
        :size="26"
        vertical
        rightTooltip/>
    </div>
    <contained-content
      v-bind="$attrs"
      :element="element"
      :isDragged="dragged"
      :isDisabled="disabled"
      :style="{ boxShadow: highlight }"
      @add="add"
      @save="save"
      @delete="remove"/>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import ActiveUsers from 'components/common/ActiveUsers';
import cloneDeep from 'lodash/cloneDeep';
import { ContainedContent } from 'tce-core';
import EventBus from 'EventBus';
import first from 'lodash/first';
import omit from 'lodash/omit';
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
      isFocused: false
    };
  },
  computed: {
    ...mapGetters('activeUsers', ['getActiveUsers']),
    ...mapState('activeUsers', ['sseId']),
    activeUsers() {
      return this.getActiveUsers('content', this.element.contentId);
    },
    showActiveUsers() {
      return this.activeUsers.length;
    },
    highlight() {
      if (!this.activeUsers.length) return;
      const user = first(this.activeUsers);
      let color;
      if (user.profileImage) color = user.palette.border;
      else color = user.palette.background;
      return `0 0 0 2px ${color}`;
    },
    context() {
      const { courseId, activityId, contentId } = this.element;
      const { sseId } = this;
      const routeName = 'tce';
      return {
        courseId,
        activityId,
        contentId,
        sseId,
        routeName,
        created: new Date()
      };
    }
  },
  methods: {
    ...mapActions('activeUsers', {
      addActiveUserContext: 'add',
      removeActiveUserContext: 'remove'
    }),
    ...mapActions('tes', { saveElement: 'save', removeElement: 'remove' }),
    ...mapMutations('tes', { addElement: 'add' }),
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
  watch: {
    isFocused() {
      if (this.isFocused) {
        this.addActiveUserContext(this.context);
        return;
      }
      this.removeActiveUserContext(this.context);
    }
  },
  created() {
    EventBus.on('element:focus', element => {
      this.isFocused = !!element && (element.id === this.element.id);
    });
  },
  beforeDestroy() {
    this.removeActiveUserContext(omit(this.context, 'created'));
  },
  components: { ActiveUsers, ContainedContent }
};
</script>

<style lang="scss">
.active-users-wrapper {
  position: absolute;
  right: -1.25rem;
  margin-top: 1rem;
  transition: all 0.5s ease;

  &.inactive {
    opacity: 0;
    transition: all 0.5s ease;
  }

  .active-users { margin-right: 0; }
}
</style>
