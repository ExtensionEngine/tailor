<template>
    <!-- <div v-for="revision in revisions">
      {{ revision }}
    </div> -->
  <div class="revision-container">
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="revision in revisions">
          <td>
            {{ revision.createdAt.toLocaleDateString() }}
            {{ revision.createdAt.getHours() }}:{{ revision.createdAt.getMinutes() }}
          </td>
          <td>{{ getDescription(revision) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import filter from 'lodash/filter';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';

const ops = {
  'CREATE': 'created a new',
  'UPDATE': 'changed the',
  'REMOVE': 'removed the'
};

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
    ...mapMutations({ setupRevisionApi: 'setBaseUrl' }, 'revisions'),
    getDescription(revision) {
      const value = revision.oldValue || revision.newValue;
      const parts = [
        revision.user.email,
        ops[revision.operation],
        `${revision.resourceType.toLowerCase()}`,
        `'${value.data.question}'` // only for assessments
      ];
      return parts.join(' ');
    }
  },
  created() {
    const courseId = Number(this.$route.params.courseKey);
    this.setupRevisionApi(`/courses/${courseId}/revisions`);
    this.fetchRevisions().then(() => {
      this.revisions = filter(this.getRevisions(), { courseId });
      this.revisions.forEach(rev => {
        rev.createdAt = new Date(rev.createdAt);
      });
      this.revisions.sort((r1, r2) => r2.createdAt - r1.createdAt);
    });
  }
};
</script>

<style lang="scss" scoped>
.revision-container {
  margin: 40px 20px;
  padding: 30px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.74);
}

.table {
  text-align: left;
}
</style>
