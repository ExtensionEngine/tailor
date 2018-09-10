<template>
  <div class="editor-avatar-container">
    <span class="editor-label">
      Active editors:
    </span>
    <span v-if="!editors.visible.length" class="editor-label">None</span>
    <span v-else>
      <transition-group name="editor-avatars" class="editor-avatars">
        <avatar
          v-for="(editor, index) in editors.visible"
          v-tooltip="getTooltipContent(editor)"
          :key="index"
          :size="40"
          :style="`z-index: ${-index};`"
          :username="editor.email"
          :initials="getEditorInitial(editor)"
          class="editor-initial"
          color="#ffffffd9">
        </avatar>
        <span
          v-if="editors.additional.display"
          v-tooltip="getTooltipContent()"
          :key="allEditors.length"
          :style="`z-index: ${-allEditors.length};`"
          class="editor-initial additional-editors">
          <span v-if="editors.additional.length < 99">
            +{{ editors.additional.length }}
          </span>
          <span v-else>99+</span>
        </span>
      </transition-group>
    </span>
  </div>
</template>

<script>
import api from '../../api/editors';
import Avatar from 'vue-avatar';
import filter from 'lodash/filter';
import pick from 'lodash/pick';

const VISIBLE_EDITORS = 4;

export default {
  name: 'active-editors',
  data() {
    return {
      allEditors: []
    };
  },
  props: {
    courseId: Number,
    activityId: Number,
    editor: { type: Object, default: null }
  },
  computed: {
    currentEditor() {
      return this.editor ? pick(this.editor, ['id', 'email']) : null;
    },
    editors() {
      let filteredEditors = !this.currentEditor ? this.allEditors
        : filter(this.allEditors, editor => editor.id !== this.currentEditor.id);
      let maxEditors = !this.currentEditor ? VISIBLE_EDITORS : VISIBLE_EDITORS - 1;

      let visibleEditors = filteredEditors.slice(0, maxEditors);
      if (this.currentEditor) visibleEditors.unshift(this.currentEditor);

      let additionalEditors = filteredEditors.slice(maxEditors);

      return {
        visible: visibleEditors,
        additional: {
          display: additionalEditors.length > 0,
          length: additionalEditors.length,
          tooltip: additionalEditors.map(it => it.email).join('\n')
        }
      };
    }
  },
  methods: {
    getEditorInitial(editor) {
      return editor.email.charAt(0).toUpperCase();
    },
    getTooltipContent(editor = null) {
      let content = '';

      if (editor) {
        let isCurrentEditor = editor.id === this.currentEditor && this.currentEditor.id;
        content = `${editor.email}${isCurrentEditor ? ' (you)' : ''}`;
      } else {
        content = this.editors.additional.tooltip;
      }

      return { content, class: 'editor-tooltip' };
    },
    subscribe(activityId) {
      api.subscribe({
        courseId: this.courseId,
        activityId,
        editor: this.currentEditor
      }, editors => (this.allEditors = editors));
    },
    unsubscribe(activityId) {
      api.unsubscribe({
        courseId: this.courseId,
        activityId,
        editor: this.currentEditor
      });
    }
  },
  watch: {
    activityId: {
      handler: (newVal, oldVal) => {
        this.unsubscribe(oldVal);
        this.subscribe(newVal);
      }
    }
  },
  mounted() {
    this.subscribe(this.activityId);
  },
  beforeDestroy() {
    this.unsubscribe(this.activityId);
  },
  components: { Avatar }
};
</script>

<style lang="scss" scoped>
$avatarContainerBackground: #fff;
$avatarDimension: 2.5em;

.editor {
  &-initial {
    display: inline-block !important;
    position: relative;
    width: $avatarDimension;
    height: $avatarDimension;
    margin-right: -0.7em;
    color: $avatarContainerBackground;
    font-size: 1.2em;
    font-weight: bold;
    line-height: $avatarDimension;
    text-align: center;
    border-radius: 50%;
    vertical-align: middle;
    border: 1px solid $avatarContainerBackground;
  }

  &-label {
    margin: 0 5px;
    color: #707070;
    font-weight: bold;
    line-height: 40px;
  }

  &-avatar-container {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    display: inline-block;
    width: fit-content;
    padding: 5px;
    padding-right: 1.2em;
    background: $avatarContainerBackground;
    border-radius: 30px;
  }
}

.editor-avatars {
  z-index: 0;
  position: relative;

  &-enter-active, &-leave-active {
    transition: opacity 1.5s;
  }

  &-enter, &-leave-to {
    opacity: 0;
  }
}

.additional-editors {
  padding-left: 0.4em;
  color: #333;
  background: #ccc;
}
</style>

<style lang="scss">
$tooltipBackground: #e8e8e8;

.vue-tooltip.editor-tooltip {
  background: $tooltipBackground;

  .tooltip-content {
    color: #171717;
    font-weight: bold;
    background: $tooltipBackground;
  }
}
</style>
