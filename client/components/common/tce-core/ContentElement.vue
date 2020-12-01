<template>
  <div
    @click="onSelect"
    :class="{
      selected: activeUsers.length,
      focused: isFocused,
      frame
    }"
    class="content-element">
    <active-users :users="activeUsers" size="20" class="active-users" />
    <component
      :is="componentName"
      @add="$emit('add', $event)"
      @save="$emit('save', $event)"
      @delete="$emit('delete')"
      @focus="onSelect"
      :id="`element_${id}`"
      v-bind="$attrs"
      :element="element"
      :is-focused="isFocused"
      :is-dragged="isDragged"
      :is-disabled="isDisabled"
      :dense="dense" />
  </div>
</template>

<script>
import { getComponentName, getElementId } from './utils';
import ActiveUsers from 'tce-core/ActiveUsers';
import { mapChannels } from '@/plugins/radio';

export default {
  name: 'content-element',
  inject: ['$getCurrentUser'],
  inheritAttrs: false,
  props: {
    element: { type: Object, required: true },
    parent: { type: Object, default: null },
    isDragged: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
    frame: { type: Boolean, default: true },
    dense: { type: Boolean, default: false }
  },
  data: () => ({
    isFocused: false,
    activeUsers: []
  }),
  computed: {
    ...mapChannels({ editorBus: 'editor' }),
    currentUser: vm => vm.$getCurrentUser(),
    id() {
      return getElementId(this.element);
    },
    componentName() {
      return getComponentName(this.element.type);
    },
    elementBus() {
      return this.$radio.channel(`element:${this.id}`);
    }
  },
  methods: {
    onSelect(e) {
      if (this.isDisabled || e.component) return;
      this.focus();
      e.component = { name: 'content-element', data: this.element };
    },
    focus() {
      this.editorBus.emit('element:focus', this.element, this.parent);
    }
  },
  created() {
    // Element listeners
    this.elementBus.on('save:meta', meta => this.$emit('save:meta', meta));
    this.elementBus.on('delete', () => this.$emit('delete'));
    // Editor listeners
    this.editorBus.on('element:select', ({ elementId, isSelected = true, user }) => {
      if (this.id !== elementId) return;
      // If current user; focus element
      if (!user || (user.id === this.currentUser.id)) {
        this.isFocused = isSelected;
        return this.focus();
      }
      // If other user, toggle within active users list
      if (isSelected && !this.activeUsers.find(it => it.id === user.id)) {
        this.activeUsers.push(user);
      } else if (!isSelected && this.activeUsers.find(it => it.id === user.id)) {
        this.activeUsers = this.activeUsers.filter(it => it.id !== user.id);
      }
    });
    this.editorBus.on('element:focus', element => {
      this.isFocused = !!element && (getElementId(element) === this.id);
    });
  },
  provide() {
    return {
      $elementBus: this.elementBus
    };
  },
  components: { ActiveUsers }
};
</script>

<style lang="scss" scoped>
.content-element {
  $accent-1: #1de9b6;
  $accent-2: #ff4081;

  position: relative;

  &::after {
    $width: 0.125rem;

    content: '';
    display: none;
    position: absolute;
    top: 0;
    right: -$width;
    width: $width;
    height: 100%;
  }

  &.focused {
    border: 1px dashed $accent-1;

    &::after {
      display: block;
      background: $accent-1;
    }
  }

  &.selected {
    border: 1px dashed $accent-2;

    &::after {
      display: block;
      background: $accent-2;
    }
  }
}

.frame {
  padding: 10px 20px;
  border: 1px solid #e1e1e1;
}

.active-users {
  position: absolute;
  top: 0;
  left: -1.625rem;
}
</style>
