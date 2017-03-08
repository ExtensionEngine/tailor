<template>
  <div class="question-container">
    <h4>Question</h4>
    <div
      :class="{ editing: isEditing, 'question-error': questionError }"
      class="question">
      <asset
        v-for="asset in assessment.question"
        :asset="asset"
        :disabled="!isEditing">
      </asset>
      <select-asset v-show="isEditing" @selected="addAsset"></select-asset>
    </div>
    <span class="help-block" v-if="isEditing && helperText">
      {{ helperText }}
    </span>
  </div>
</template>

<script>
import Asset from '../assets';
import cuid from 'cuid';
import EventBus from 'EventBus';
import findIndex from 'lodash/findIndex';
import { helperText } from '../../../utils/assessment';
import { mapGetters } from 'vuex-module';
import pullAt from 'lodash/pullAt';
import SelectAsset from './SelectAsset';

const appChannel = EventBus.channel('app');

export default {
  props: {
    assessment: Object,
    isEditing: Boolean,
    errors: Array
  },
  computed: {
    ...mapGetters(['toolbar'], 'atom'),
    isFocused() {
      const ctx = this.toolbar.context;
      return this.isEditing && (ctx && ctx._cid === this.assessment._cid);
    },
    helperText() {
      const helper = helperText[this.assessment.type] || {};
      return helper.question;
    },
    questionError() {
      return this.errors.includes('question');
    }
  },
  methods: {
    addAsset(type) {
      const asset = { _cid: cuid(), type, embed: true };
      const question = this.assessment.question.concat(asset);
      this.$emit('update', { question });
    }
  },
  created() {
    appChannel.on('deleteAsset', asset => {
      if (!asset.embed) return;
      const index = findIndex(this.assessment.question, { _cid: asset._cid });
      if (index === -1) return;
      const question = pullAt(this.assessment.question.slice(0), index);
      this.$emit('update', { question });
    });
  },
  components: {
    Asset,
    SelectAsset
  }
};
</script>

<style lang="scss" scoped>
.question-container {
  clear: both;
  width: 100%;
  text-align: left;
}

.question {
  font-size: 22px;
  text-align: center;
  padding: 10px;

  &.question-error {
    .ql-container, span {
      border-bottom: 0;
      box-shadow: inset 0 -2px 0 #e51c23;
    }
  }
}
</style>
