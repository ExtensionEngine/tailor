<template>
  <li class="feedback-item">
    <p class="answer">
      <span class="prefix">Answer {{ index + 1 }}:</span>
      <template v-if="answer.length">{{ answer }}</template>
      <i v-else>Answer not added.</i>
    </p>
    <quill-editor
      v-if="isEditing"
      :content="feedback"
      :options="quillOptions"
      @change="$emit('update', $event)"
      class="feedback edit">
    </quill-editor>
    <template v-else>
      <p
        v-if="feedback.length"
        v-html="feedback"
        class="feedback">
      </p>
      <p v-else class="feedback empty">
        <i>Feedback not added.</i>
      </p>
    </template>
  </li>
</template>

<script>
import { quillEditor as QuillEditor } from 'vue-quill-editor';

const quillOptions = () => ({
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
});

export default {
  name: 'feedback-item',
  props: {
    answer: { type: String, default: '' },
    feedback: { type: String, default: '' },
    isEditing: { type: Boolean, required: true },
    index: { type: Number, required: true },
    quillOptions: { type: Object, default: quillOptions }
  },
  components: { QuillEditor }
};
</script>

<style lang="scss" scoped>
.feedback-item {
  padding: 10px 0;
  font-size: 15px;

  .prefix {
    padding-right: 10px;
    color: #444;
    font-weight: bold;
  }
}
</style>
