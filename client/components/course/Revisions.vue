<template>
  <div>
    <div v-for="revision in revisions">
      {{ revision }}
    </div>
  </div>
</template>

<script>
import filter from 'lodash/filter';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';

export default {
  name: 'course-revisions',
  data() {
    return {
      revisions: []
    };
  },
  methods: {
    ...mapGetters({ getRevisions: 'revisions' }),
    ...mapActions({ fetchRevisions: 'fetch' }, 'revisions'),
    ...mapMutations({ setupRevisionApi: 'setBaseUrl' }, 'revisions')
  },
  created() {
    const courseId = Number(this.$route.params.courseKey);
    this.setupRevisionApi(`/courses/${courseId}/revisions`);
    this.fetchRevisions().then(() => {
      this.revisions = filter(this.getRevisions(), { courseId });
    });
  }
};
</script>

<style lang="scss">
</style>
