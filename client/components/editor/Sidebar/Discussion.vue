<template>
  <div class="my-4 pa-4">
    <discussion
      @change="$emit('change', $event)"
      :activity="activity"
      :is-visible="isVisible"
      show-notifications />
  </div>
</template>

<script>
import Discussion from '@/components/repository/common/Sidebar/Discussion/Embed';

export default {
  name: 'editor-discussion',
  props: {
    activity: { type: Object, required: true },
    isVisible: { type: Boolean, default: false }
  },
  components: {
    Discussion
  }
};
</script>
