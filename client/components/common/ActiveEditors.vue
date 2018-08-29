<template>
  <div>
    <div class="editor-avatar-container">
      <span class="editor-label">
        Active editors:
      </span>
      <transition-group name="editor-avatars">
        <span
          v-for="(editor, index) in editorsToDisplay"
          :key="index"
          :style="`
            ${getEditorColorsStyle()}
            z-index: ${editorsToDisplay.length - index};
          `"
          v-tooltip="{
            content: `${editor.email}${editor.email === user.email ? ' (you)' : ''}`,
            class: 'editor-tooltip'
          }"
          class="editor-initial">
          {{ editorInitial(editor.email) }}
        </span>
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
import cloneDeep from 'lodash/cloneDeep';
import differenceWith from 'lodash/differenceWith';
import findIndex from 'lodash/findIndex';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';

const invert = require('invert-color');

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
    },
    editorInitial(editorEmail) {
      return editorEmail.charAt(0).toUpperCase();
    },
    getEditorColorsStyle() {
      // TODO: replace custom avatars with vue-avatar
      let hue = (Math.random() * 0.618034) % 1;
      let rgb = hsvToRgb(hue, 0.5, 0.95);
      let inverse = invert(rgb, false);

      return `background: rgb(${rgb.r}, ${rgb.g}, ${rgb.b}); color: ${inverse};`;
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

function hsvToRgb(h, s, v) {
  let r, g, b;
  let i = Math.floor(h * 6);
  let f = h * 6 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}
</script>

<style lang="scss" scoped>
$white: #fff;
$paleGray: #ccc;
$darkGray: #333;

.editor {
  &-initial {
    display: inline-block;
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
    border: 1px solid $white;
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
    background: $white;
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
  background: $paleGray;
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
