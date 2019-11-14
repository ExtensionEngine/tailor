<template>
  <li
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    :class="{ hover }"
    class="list-group-item assessment-item elevation-1">
    <span v-if="draggable" class="drag-handle">
      <span class="mdi mdi-drag-vertical"></span>
    </span>
    <tce-question-container
      v-if="expanded"
      @selected="$emit('selected')"
      @delete="$emit('delete')"
      @save="save"
      :element="assessment">
      <template v-slot:default="{ isEditing }">
        <div class="pb-5">
          <v-layout>
            <v-flex grow class="text-xs-left">
              <v-chip
                color="blue-grey darken-1"
                label
                dark
                small
                class="text-uppercase">
                {{ elementConfig.name }}
              </v-chip>
            </v-flex>
            <v-flex shrink>
              <v-btn
                @click="$emit('selected')"
                flat
                small
                class="ma-0 pa-0">
                Collapse
              </v-btn>
            </v-flex>
          </v-layout>
          <slot :isEditing="isEditing" name="header"></slot>
        </div>
      </template>
    </tce-question-container>
    <div v-else @click="$emit('selected')" class="minimized">
      <v-chip color="blue-grey darken-1" label dark small>
        {{ elementConfig.subtype }}
      </v-chip>
      <span class="question">{{ question | truncate(50) }}</span>
      <v-btn
        @click.stop="$emit('delete')"
        color="primary"
        flat
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

const blankRegex = /(@blank)/g;
const htmlRegex = /<\/?[^>]+(>|$)/g;

export default {
  name: 'assessment-item',
  inject: ['$teRegistry'],
  props: {
    assessment: { type: Object, required: true },
    expanded: { type: Boolean, default: false },
    draggable: { type: Boolean, default: false }
  },
  data() {
    return { hover: false };
  },
  computed: {
    elementConfig() {
      return this.$teRegistry.get(this.assessment.data.type);
    },
    question() {
      const textAssets = filter(this.assessment.data.question, { type: 'HTML' });
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
  margin-bottom: 10px;
  padding: 0;

  .v-chip {
    min-width: 30px;
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
    padding: 5px 22px;
    cursor: pointer;

    .question {
      display: inline-block;
      max-width: 80%;
      min-height: 30px;
      color: #444;
      font-size: 16px;
      font-weight: 400;
      line-height: 34px;
    }

    .v-chip {
      margin-top: 5px;
    }
  }

  .delete {
    opacity: 0;
  }

  &.hover:not(.sortable-chosen) .delete {
    opacity: 1;
  }
}
</style>
