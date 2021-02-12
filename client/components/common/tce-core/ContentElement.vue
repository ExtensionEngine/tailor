<template>
  <div
    @click="onSelect"
    :class="[element.changeSincePublish, {
      selected: activeUsers.length,
      focused: isFocused,
      diff: $editorState.isPublishDiff,
      frame
    }]"
    class="content-element">
    <div
      :class="{ visible: $editorState.isPublishDiff && element.changeSincePublish }"
      class="header d-flex">
      <publish-diff-chip
        :change-type="element.changeSincePublish"
        class="ml-auto " />
    </div>
    <active-users :users="activeUsers" :size="20" class="active-users" />
    <component
      :is="componentName"
      @add="$emit('add', $event)"
      @save="onSave"
      @delete="$emit('delete')"
      @focus="onSelect"
      :id="`element_${id}`"
      v-bind="{ ...$attrs, element, isFocused, isDragged, isDisabled, dense }" />
    <div v-if="!isDisabled" class="element-actions">
      <div
        v-if="showDiscussion"
        :class="{ 'is-visible': isHighlighted || hasComments }">
        <discussion
          @open="focus"
          @close="isFocused = false"
          v-bind="element"
          :user="currentUser" />
      </div>
      <div
        v-if="!parent"
        :class="{ 'is-visible': isHighlighted }">
        <v-btn
          @click="$emit('delete')"
          color="pink lighten-1"
          dark icon x-small>
          <v-icon size="20">mdi-delete-outline</v-icon>
        </v-btn>
      </div>
    </div>
    <v-progress-linear
      v-if="isSaving"
      height="2"
      color="teal accent-2"
      indeterminate
      class="save-indicator" />
  </div>
</template>

<script>
import { getComponentName, getElementId } from './utils';
import ActiveUsers from 'tce-core/ActiveUsers';
import Discussion from './ElementDiscussion';
import { mapChannels } from '@/plugins/radio';
import PublishDiffChip from './PublishDiffChip';

export default {
  name: 'content-element',
  inject: {
    $getCurrentUser: {},
    $editorState: { default: {} }
  },
  inheritAttrs: false,
  props: {
    element: { type: Object, required: true },
    parent: { type: Object, default: null },
    isHovered: { type: Boolean, default: false },
    isDragged: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
    frame: { type: Boolean, default: true },
    dense: { type: Boolean, default: false },
    showDiscussion: { type: Boolean, default: false }
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
    isHighlighted: vm => vm.isFocused || vm.isHovered,
    hasComments: vm => !!vm.element.comments?.length,
    elementBus: vm => vm.$radio.channel(`element:${vm.id}`),
    currentUser: vm => vm.$getCurrentUser()
  },
  methods: {
    onSelect(e) {
      if (this.isDisabled || this.$editorState.isPublishDiff || e.component) return;
      this.focus();
      e.component = { name: 'content-element', data: this.element };
    },
    onSave(data) {
      if (!this.isEmbed) this.isSaving = true;
      this.$emit('save', data);
    },
    focus() {
      this.editorBus.emit('element:focus', this.element, this.parent);
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
    return { $elementBus: this.elementBus };
  },
  components: { ActiveUsers, Discussion, PublishDiffChip }
};
</script>

<style lang="scss" scoped>
.content-element {
  $accent-1: #1de9b6;
  $accent-2: #ff4081;

  position: relative;
  border: 1px solid transparent;

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

.element-actions {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: -0.0625rem;
  right: -1.25rem;
  width: 1.5rem;
  height: 100%;
  padding-left: 0.75rem;

  > * {
    min-height: 1.75rem;
    opacity: 0;
    transition: opacity 0.1s linear;
  }

  > .is-visible {
    opacity: 1;
    transition: opacity 0.5s linear;
  }
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

.header {
  width: 100%;
  max-height: 0;

  &.visible {
    max-height: unset;
    padding: 0 0 0.5rem;
  }
}

.diff {
  &.new {
    @include highlight(var(--v-success-lighten2));
  }

  &.changed, &.removed {
    @include highlight(var(--v-secondary-lighten4));
  }

  .element-actions {
    display: none;
  }
}

</style>
