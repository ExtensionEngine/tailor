<template>
  <li>
    <span class="answer-index">Answer {{ index + 1 }}:</span>
    <template v-if="answer.length">{{ answer }}</template>
    <i v-else>Answer not added.</i>
    <quill-editor
      v-if="isEditing"
      :content="feedback"
      :options="quillOptions"
      @change="$emit('update', $event)">
    </quill-editor>
    <div v-else-if="feedback.length" v-html="feedback"></div>
    <div v-else>
      <i>Feedback not added.</i>
    </div>
  </li>
</template>

<script>
import { quillEditor as QuillEditor } from 'vue-quill-editor';

const QUILL_OPTIONS = {
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ color: [] }, { background: [] }],
      ['link']
    ]
  }
};

export default {
  name: 'feedback-item',
  props: {
    answer: { type: String, default: '' },
    feedback: { type: String, default: '' },
    isEditing: { type: Boolean, required: true },
    index: { type: Number, required: true }
  },
  computed: {
    quillOptions() {
      return QUILL_OPTIONS;
    }
  },
  components: {
    QuillEditor
  }
};
</script>

<style lang="scss" scoped>
li {
  padding: 10px 0;
  font-size: 15px;

  .answer-index {
    padding-right: 10px;
    color: #444;
    font-weight: bold;
  }
}
</style>
