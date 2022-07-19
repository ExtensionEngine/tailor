<template>
  <div :class="{ resolved: isResolved }" class="content">
    <div v-if="isResolved" class="resolvement-options">
      <span class="font-italic mr-1">Marked as resolved.</span>
      <v-tooltip open-delay="800" right>
        <template #activator="{ on }">
          <v-btn
            v-on="on"
            @click="$listeners.unresolve"
            color="secondary"
            text x-small>
            Undo
          </v-btn>
        </template>
        <span>Unresolve comment</span>
      </v-tooltip>
    </div>
    <pre><span>{{ content }}</span><br></pre>
  </div>
</template>

<script>
export default {
  name: 'comment-preview',
  props: {
    content: { type: String, default: '' },
    isResolved: { type: Boolean, default: false }
  }
};
</script>

<style lang="scss" scoped>
.content {
  margin-top: 0.375rem;
}

.content pre {
  height: 100%;
  margin: 0;
  // NOTE: Preventing glitches (height changes, vertical scrollbar)
  padding: 0 0.25rem 0.5rem 0;
  font: inherit;
  white-space: pre-wrap;
  word-break: break-all;
  word-wrap: break-word;
  overflow-wrap: break-word;
  background: inherit;
  border: none;
  overflow: hidden;
}

.content.resolved {
  opacity: 0.7;

  .resolvement-options {
    display: flex;
    align-items: center;
    margin-bottom: 0.25rem;
    font-size: 0.75rem;
  }
}
</style>
