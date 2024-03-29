<template>
  <div
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    :class="[assessment.changeSincePublish, {
      hover,
      expanded,
      diff: $editorState.isPublishDiff
    }]"
    class="assessment-item elevation-2">
    <span v-if="draggable" class="drag-handle">
      <v-icon>mdi-drag-vertical</v-icon>
    </span>
    <tce-question-container
      v-if="expanded"
      @save="save"
      @delete="$emit('delete')"
      :element="assessment"
      :is-disabled="isDisabled"
      class="question-container">
      <template #default="{ isEditing }">
        <div class="px-6 d-flex justify-end">
          <v-btn
            @click="$emit('selected')"
            text small
            class="px-2">
            <v-icon dense class="mr-2">mdi-arrow-collapse</v-icon>
            Collapse
          </v-btn>
        </div>
        <div class="d-flex pb-4 px-6">
          <slot :is-editing="isEditing" name="header"></slot>
        </div>
      </template>
    </tce-question-container>
    <div
      v-else
      @click="$emit('selected')"
      class="minimized d-flex justify-space-between align-center">
      <v-chip
        color="primary darken-3"
        label dark small
        class="readonly">
        {{ elementConfig.subtype }}
      </v-chip>
      <span class="question">{{ question | truncate(50) }}</span>
      <publish-diff-chip
        v-if="$editorState.isPublishDiff && assessment.changeSincePublish"
        :change-type="assessment.changeSincePublish" />
      <v-btn
        v-else
        @click.stop="$emit('delete')"
        :class="{ disabled: isDisabled }"
        color="primary darken-2"
        icon
        class="delete">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import map from 'lodash/map';
import PublishDiffChip from './PublishDiffChip.vue';
import TceQuestionContainer from './QuestionContainer/index.vue';

const TEXT_CONTAINERS = ['JODIT_HTML', 'HTML'];
const blankRegex = /(@blank)/g;
const htmlRegex = /(<\/?[^>]+(>|$))|&nbsp;/g;

const getTextAssets = item => filter(item, it => TEXT_CONTAINERS.includes(it.type));

export default {
  name: 'tailor-assessment-item',
  inject: ['$teRegistry', '$editorState'],
  props: {
    assessment: { type: Object, required: true },
    expanded: { type: Boolean, default: false },
    draggable: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false }
  },
  data() {
    return { hover: false };
  },
  computed: {
    elementConfig() {
      return this.$teRegistry.get(this.assessment.data.type);
    },
    question() {
      const textAssets = getTextAssets(this.assessment.data.question);
      const question = map(textAssets, 'data.content').join(' ');
      return question.replace(htmlRegex, '').replace(blankRegex, () => '____');
    }
  },
  methods: {
    save(data) {
      const assessment = cloneDeep(this.assessment);
      Object.assign(assessment.data, data);
      this.$emit('save', assessment);
    }
  },
  components: { PublishDiffChip, TceQuestionContainer }
};
</script>

<style lang="scss" scoped>
@import '../mixins';

.assessment-item {
  margin-bottom: 0.625rem;
  padding: 0;

  .v-chip {
    min-width: 1.875rem;
  }

  .drag-handle {
    position: absolute;
    top: 0;
    left: -3px;
    opacity: 0;
    cursor: move;
    font-size: 28px;
    color: #888;
  }

  &.hover .drag-handle {
    opacity: 1;
    transition: opacity 0.6s ease-in-out;
  }

  .minimized {
    padding: 0.375rem 1.375rem;
    cursor: pointer;

    .question {
      display: inline-block;
      max-width: 80%;
      min-height: 1.875rem;
      font-size: 1rem;
      line-height: 2.125rem;
      font-weight: 400;
      color: #444;
    }

    .v-chip {
      margin-top: 0.125rem;
    }
  }

  .delete {
    opacity: 0;
  }

  &.hover:not(.sortable-chosen) .delete:not(.disabled) {
    opacity: 1;
  }
}

.question-container {
  margin: 0 !important;
}

.diff {
  border: none;

  &.expanded {
    border-radius: 4px;
  }

  &.new {
    @include highlight(var(--v-success-lighten2));
  }

  &.changed, &.removed {
    @include highlight(var(--v-secondary-lighten4));
  }
}
</style>
