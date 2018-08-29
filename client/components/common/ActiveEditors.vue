<template>
  <div>
    <div class="editor-avatar-container">
      <span class="editor-label">
        Active editors:
      </span>
      <transition-group name="editor-avatars">
        <avatar
          v-for="(editor, index) in editorsToDisplay"
          v-tooltip="{
            content: `${editor.email}${editor.email === user.email ? ' (you)' : ''}`,
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
            html: 'additionalEditorsTooltipContent',
            class: 'editor-tooltip'
          }"
          :key="editors.length"
          class="editor-initial additional-editors">
          {{ `${additionalEditors.length > 99 ? '99+' : '+' + additionalEditors.length}` }}
        </span>
      </transition-group>
      <div id="additionalEditorsTooltipContent">
        <p
          v-for="(editor, index) in additionalEditors"
          :key="index"
          style="margin: 0;">
          {{ editor.email }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from 'vue-avatar';
import cloneDeep from 'lodash/cloneDeep';
import differenceWith from 'lodash/differenceWith';
import findIndex from 'lodash/findIndex';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';

const MAX_EDITORS = 4;

export default {
  name: 'active-editors',
  props: {
    courseId: Number,
    activityId: Number
  },
  computed: {
    ...mapGetters(['editorCount', 'editorsFetched'], 'editors'),
    ...mapGetters(['editors']),
    ...mapGetters(['user']),
    editorsToDisplay() {
      if (!this.editors.length) return [];

      let editors = cloneDeep(this.editors);
      let editorIndex = findIndex(editors, { id: this.user.id });

      if (editorIndex !== 0) {
        [ editors[0], editors[editorIndex] ] = [ editors[editorIndex], editors[0] ];
      }

      return editors.slice(0, MAX_EDITORS);
    },
    additionalEditors() {
      return differenceWith(
        this.editors,
        this.editorsToDisplay,
        (first, second) => (first.id === second.id)
      );
    }
  },
  methods: {
    ...mapActions(['fetch', 'subscribe', 'unsubscribe'], 'editors'),
    ...mapMutations({ setupEditorsApi: 'setBaseUrl' }, 'editors'),
    fetchEditors() {
      if (this.editorsFetched) return;
      this.fetch({ activityId: this.activityId });
    }
  },
  watch: {
    editors: {
      handler(value) {
        this.fetchEditors();
      },
      deep: true
    }
  },
  created() {
    this.setupEditorsApi(
      `/courses/${this.courseId}/activities/${this.activityId}/editors`
    );
  },
  mounted() {
    this.fetchEditors();
    this.subscribe(this.user.id);
  },
  beforeDestroy() {
    this.unsubscribe(this.user.id);
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
