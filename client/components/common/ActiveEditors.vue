<template>
  <div>
    <div v-if="editorCount" style="text-align: right;">
      <div class="editor-avatar-container">
        <span class="editor-label">
          Active editors:
        </span>
        <transition-group name="editor-avatars">
          <span
            v-for="(editor, index) in processedEditors"
            :key="index"
            :style="`background: ${getRandomColor()};`"
            :title="`${editor.email}${editor.email === user.email ? ' (you)' : ''}`"
            class="editor-initial">
            {{ editorInitial(editor.email) }}
          </span>
          <span
            v-if="additionalEditors"
            :key="editors.length"
            :title="`+${additionalEditors} more`"
            class="editor-initial additional-editors">
            . . .
          </span>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex-module';

const color = require('color');
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
    processedEditors() {
      return this.editors.length <= MAX_EDITORS
        ? this.editors
        : this.editors.slice(0, MAX_EDITORS);
    },
    additionalEditors() {
      return this.editors.length > MAX_EDITORS
        ? this.editors.length - MAX_EDITORS
        : 0;
    }
  },
  methods: {
    ...mapActions(['fetch', 'subscribe', 'unsubscribe'], 'editors'),
    ...mapMutations({ setupEditorsApi: 'setBaseUrl' }, 'editors'),
    fetchEditors() {
      if (this.editorsFetched) return;
      this.fetch({ activityId: this.activityId });
    },
    editorInitial(editorEmail) {
      return editorEmail.charAt(0).toUpperCase();
    },
    getRandomColor() {
      let hue = (Math.random() * 0.618034) % 1;
      return color({ h: hue * 360, s: 50, v: 95 }).hexString();
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
  }
};
</script>

<style lang="scss" scoped>
.editor {
  &-initial {
    display: inline-block;
    width: 2.5em;
    height: 2.5em;
    margin-right: -0.7em;
    color: #fff;
    font-size: 1.2em;
    font-weight: bold;
    line-height: 2.5em;
    text-align: center;
    border-radius: 50%;
    vertical-align: middle;
    border: 1px solid #fff;
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
    background: #fff;
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
  background: #ccc;
}
</style>
