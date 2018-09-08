<template>
  <div class="editor-avatar-container">
    <span class="editor-label">
      Active editors:
    </span>
    <span v-if="!editors.visible.length" class="editor-label">None</span>
    <span v-else>
      <transition-group name="editor-avatars">
        <!-- TODO: remove z-index and use "float: right" instead -->
        <avatar
          v-for="(editor, index) in editors.visible"
          v-tooltip="{
            content: getEditorTooltipText(editor),
            class: 'editor-tooltip'
          }"
          :key="index"
          :style="`z-index: ${editors.visible.length - index}`"
          :size="40"
          :username="editor.email"
          :initials="getEditorInitial(editor)"
          class="editor-initial"
          color="#ffffffd9">
        </avatar>
        <span
          v-if="additionalEditors.display"
          v-tooltip="{
            content: additionalEditors.tooltip,
            class: 'editor-tooltip'
          }"
          :key="allEditors.length"
          class="editor-initial additional-editors">
          <span v-if="additionalEditors.length < 99">
            +{{ additionalEditors.length }}
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

      return {
        visible: visibleEditors,
        additional: filteredEditors.slice(maxEditors)
      };
    },
    additionalEditors() {
      let additionalEditors = this.editors.additional;

      return {
        display: additionalEditors.length > 0,
        length: additionalEditors.length,
        tooltip: additionalEditors.map(it => it.email).join('\n')
      };
    }
  },
  methods: {
    getEditorInitial(editor) {
      return editor.email.charAt(0).toUpperCase();
    },
    getEditorTooltipText(editor) {
      if (!editor) return;
      let isCurrentEditor = editor.id === this.currentEditor && this.currentEditor.id;
      return `${editor.email}${isCurrentEditor ? ' (you)' : ''}`;
    },
    subscribe(activityId) {
      api.subscribe(
        { courseId: this.courseId, activityId, editor: this.currentEditor },
        editors => (this.allEditors = editors)
      );
    },
    unsubscribe(activityId) {
      api.unsubscribe(
        { courseId: this.courseId, activityId, editor: this.currentEditor }
      );
    }
  },
  watch: {
    activityId: {
      handler: function (newVal, oldVal) {
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

.editor {
  &-initial {
    display: inline-block !important;
    position: relative;
    width: 2.5em;
    height: 2.5em;
    margin-right: -0.7em;
    color: $avatarContainerBackground;
    font-size: 1.2em;
    font-weight: bold;
    line-height: 2.5em;
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
  z-index: 0;
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
