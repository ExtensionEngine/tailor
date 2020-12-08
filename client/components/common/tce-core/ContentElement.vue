<template>
  <div class="content-element-container">
    <div
      @click="onSelect"
      :class="{
        selected: activeUsers.length,
        focused: isFocused,
        frame
      }"
      class="content-element">
      <active-users :users="activeUsers" :size="20" class="active-users" />
      <component
        :is="componentName"
        @add="$emit('add', $event)"
        @save="onSave"
        @delete="$emit('delete')"
        @focus="onSelect"
        :id="`element_${id}`"
        v-bind="$attrs"
        :element="element"
        :is-focused="isFocused"
        :is-dragged="isDragged"
        :is-disabled="isDisabled"
        :dense="dense" />
      <v-progress-linear
        v-if="isSaving"
        height="2"
        color="teal accent-2"
        indeterminate
        class="save-indicator" />
    </div>
    <div class="actions-sidebar">
      <v-btn
        v-if="!element.parent && isHovered || isFocused"
        @click="requestDeleteConfirmation"
        color="red accent-3"
        dark icon x-small>
        <v-icon>mdi-delete-outline</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { getComponentName, getElementId } from './utils';
import { mapChannels, mapRequests } from '@/plugins/radio';
import ActiveUsers from 'tce-core/ActiveUsers';
import { mapActions } from 'vuex';

export default {
  name: 'content-element',
  inject: ['$getCurrentUser'],
  inheritAttrs: false,
  props: {
    element: { type: Object, required: true },
    parent: { type: Object, default: null },
    isDragged: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
    isHovered: { type: Boolean, default: false },
    frame: { type: Boolean, default: true },
    dense: { type: Boolean, default: false }
  },
  data: () => ({
    isFocused: false,
    isSaving: false,
    activeUsers: []
  }),
  computed: {
    ...mapChannels({ editorBus: 'editor' }),
    id: vm => getElementId(vm.element),
    componentName: vm => getComponentName(vm.element.type),
    isEmbed: vm => !!vm.parent || !vm.element.uid,
    elementBus: vm => vm.$radio.channel(`element:${vm.id}`),
    currentUser: vm => vm.$getCurrentUser()
  },
  methods: {
    ...mapRequests('app', ['showConfirmationModal']),
    ...mapActions('repository/contentElements', { removeElement: 'remove' }),
    onSelect(e) {
      if (this.isDisabled || e.component) return;
      this.focus();
      e.component = { name: 'content-element', data: this.element };
    },
    onSave(data) {
      if (!this.isEmbed) this.isSaving = true;
      this.$emit('save', data);
    },
    focus() {
      this.editorBus.emit('element:focus', this.element, this.parent);
    },
    focusoutElement() {
      this.editorBus.emit('element:focus');
    },
    remove(element) {
      this.focusoutElement();
      if (element.embedded) return this.$emit('delete');
      this.removeElement(element);
    },
    requestDeleteConfirmation() {
      this.showConfirmationModal({
        title: 'Delete element?',
        message: 'Are you sure you want to delete element?',
        action: () => this.remove(this.element.parent || this.element)
      });
    }
  },
  created() {
    const deferSaveFlag = () => setTimeout(() => (this.isSaving = false), 1000);
    // Element listeners
    this.elementBus.on('delete', () => this.$emit('delete'));
    this.elementBus.on('save:meta', meta => this.$emit('save:meta', meta));
    this.elementBus.on('saved', deferSaveFlag);
    // Editor listeners
    this.editorBus.on('element:select', ({ elementId, isSelected = true, user }) => {
      if (this.id !== elementId) return;
      // If current user; focus element
      if (!user || (user.id === this.currentUser.id)) {
        this.isFocused = isSelected;
        if (isSelected) this.focus();
        return;
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
.content-element-container {
  display: flex;
  justify-content: space-between;
}

.content-element {
  $accent-1: #1de9b6;
  $accent-2: #ff4081;

  position: relative;
  flex-basis: 100%;

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

.save-indicator {
  position: absolute;
  bottom: -0.125rem;
  left: 0;
}

.actions-sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1.25rem;
  min-height: 100%;
}
</style>
