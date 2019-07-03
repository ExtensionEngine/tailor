<template>
  <div class="te-wrapper">
    <div :class="{ inactive: !showActiveUsers }" class="active-users-wrapper">
      <active-users
        v-if="contentActiveUsers.length"
        :users="contentActiveUsers"
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
import orderBy from 'lodash/orderBy';
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
    ...mapGetters('activeUsers', ['activeUsers']),
    ...mapState('activeUsers', ['sseId']),
    contentActiveUsers() {
      const { contentId } = this.element;
      return orderBy(this.activeUsers.content[contentId], ['created']) || [];
    },
    showActiveUsers() {
      return this.contentActiveUsers.length;
    },
    highlight() {
      if (!this.contentActiveUsers.length) return;
      const user = first(this.contentActiveUsers);
      let color;
      if (user.profileImage) color = user.palette.border;
      else color = user.palette.background;
      return `0 0 0 2px ${color}`;
    },
    context() {
      const { courseId, activityId, contentId } = this.element;
      const { sseId } = this;
      const routeName = 'teaching-element';
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
      addActiveUser: 'add',
      removeActiveUser: 'remove'
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
    },
    setFocus() {
      EventBus.on('element:focus', element => {
        this.isFocused = !!element && (element.id === this.element.id);
      });
    }
  },
  watch: {
    isFocused() {
      if (this.isFocused) {
        this.addActiveUser(this.context);
        return;
      }
      this.removeActiveUser(this.context);
    }
  },
  created() {
    this.setFocus();
  },
  beforeDestroy() {
    this.removeActiveUser(omit(this.context, 'created'));
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
