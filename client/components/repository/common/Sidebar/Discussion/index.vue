<template>
  <div class="activity-discussion">
    <embedded-discussion :activity="activity" show-heading />
  </div>
</template>

<script>
import EmbeddedDiscussion from './Embed';

export default {
  name: 'activity-discussion',
  props: {
    activity: { type: Object, required: true }
  },
  components: { EmbeddedDiscussion }
};
</script>

<style lang="scss" scoped>
.activity-discussion {
  margin: 1rem 0 1.75rem;
  padding: 0.375rem 1rem;
  border: 1px solid #bbb;
}
</style>
