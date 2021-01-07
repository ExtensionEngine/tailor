<template>
  <li
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    :class="{ hover }"
    class="list-group-item assessment-item elevation-1">
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
      <template v-slot:default="{ isEditing }">
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
          <slot :isEditing="isEditing" name="header"></slot>
        </div>
      </template>
    </tce-question-container>
    <div v-else @click="$emit('selected')" class="minimized">
      <v-chip
        color="blue-grey darken-3"
        label dark small
        class="readonly">
        {{ elementConfig.subtype }}
      </v-chip>
      <span class="question">{{ question | truncate(50) }}</span>
      <v-btn
        @click.stop="$emit('delete')"
        :class="{ disabled: isDisabled }"
        color="primary"
        icon
        class="delete">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
  </li>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import map from 'lodash/map';

const TEXT_CONTAINERS = ['JODIT_HTML', 'HTML'];
const blankRegex = /(@blank)/g;
const htmlRegex = /(<\/?[^>]+(>|$))|&nbsp;/g;

const getTextAssets = item => filter(item, it => TEXT_CONTAINERS.includes(it.type));

export default {
  name: 'assessment-item',
  inject: ['$teRegistry'],
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
  }
};
</script>

<style lang="scss" scoped>
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
    color: #888;
    font-size: 28px;
    opacity: 0;
    cursor: move;
  }

  &.hover .drag-handle {
    opacity: 1;
    transition: opacity 0.6s ease-in-out;
  }

  .minimized {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.375rem 1.375rem;
    cursor: pointer;

    .question {
      display: inline-block;
      max-width: 80%;
      min-height: 1.875rem;
      color: #444;
      font-size: 1rem;
      font-weight: 400;
      line-height: 2.125rem;
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
</style>
