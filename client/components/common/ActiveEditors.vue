<template>
  <div class="editor-avatar-container">
    <span class="editor-label">
      Active editors:
    </span>
    <span v-if="!editorCount" class="editor-label">None</span>
    <span v-else>
      <transition-group name="editor-avatars">
        <avatar
          v-for="(editor, index) in editorsToDisplay"
          v-tooltip="{
            content: `${editor.email}${isCurrentUser(editor) ? ' (you)' : ''}`,
            class: 'editor-tooltip'
          }"
          :key="index"
          :style="`z-index: ${editorsToDisplay.length - index}`"
          :size="40"
          :username="editor.email"
          :initials="editor.email.charAt(0).toUpperCase()"
          class="editor-initial"
          color="#ffffffd9">
      </avatar>
        <span
          v-if="additionalEditors.length"
          v-tooltip="{
            content: additionalEditorsTooltipContent,
            class: 'editor-tooltip'
          }"
          :key="editors.length"
          class="editor-initial additional-editors">
          {{ additionalEditorsText }}
        </span>
      </transition-group>
    </span>
  </div>
</template>

<script>
import Avatar from 'vue-avatar';
import cloneDeep from 'lodash/cloneDeep';
import differenceWith from 'lodash/differenceWith';
import findIndex from 'lodash/findIndex';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import reduce from 'lodash/reduce';

const MAX_EDITORS = 4;

export default {
  name: 'active-editors',
  props: {
    courseId: Number,
    activityId: Number,
    editorId: undefined
  },
  computed: {
    ...mapGetters(['editorCount', 'editorsFetched'], 'editors'),
    ...mapGetters(['editors']),
    editorsToDisplay() {
      let editors = cloneDeep(this.editors);

      if (this.editorId) {
        let editorIndex = findIndex(editors, { id: this.editorId });
        if (editorIndex > 0) {
          [ editors[0], editors[editorIndex] ] = [ editors[editorIndex], editors[0] ];
        }
      }

      return editors.slice(0, MAX_EDITORS);
    },
    additionalEditors() {
      let editors = cloneDeep(this.editors);

      return differenceWith(
        editors,
        this.editorsToDisplay,
        (first, second) => (first.id === second.id)
      );
    },
    additionalEditorsText() {
      if (this.additionalEditors.length > 99) return '99+';
      return `+${this.additionalEditors.length}`;
    },
    additionalEditorsTooltipContent() {
      // TODO: improve this
      return reduce(this.additionalEditors, (result, editor) => {
        return result + editor.email + '\n';
      }, '');
    }
  },
  methods: {
    ...mapActions(['fetch', 'subscribe', 'unsubscribe'], 'editors'),
    ...mapMutations({ setupEditorsApi: 'setBaseUrl' }, 'editors'),
    fetchEditors() {
      if (this.editorsFetched) return;
      this.fetch({ activityId: this.activityId });
    },
    isCurrentUser(editor) {
      return editor.id === this.editorId;
    }
  },
  watch: {
    activityId() {
      this.unsubscribe({
        activityId: this.activityId,
        editorId: this.editorId
      });

      this.subscribe({
        activityId: this.activityId,
        editorId: this.editorId
      });

      this.fetchEditors();
    }
  },
  created() {
    this.setupEditorsApi(
      `/courses/${this.courseId}/editors`
    );
  },
  mounted() {
    this.subscribe({
      activityId: this.activityId,
      editorId: this.editorId
    });
    this.fetchEditors();
  },
  beforeDestroy() {
    this.unsubscribe({
      activityId: this.activityId,
      editorId: this.editorId
    });
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
