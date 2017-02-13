<template>
  <div>
    <div v-if="revisions.length === 0" class="well">
      No changes recorded.
    </div>
    <div v-else class="revisions">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="revision in revisions">
            <td>{{ getTimestamp(revision) }}</td>
            <td>{{ getDescription(revision) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import filter from 'lodash/filter';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import {
  describeActivityRevision,
  describeAssetRevision,
  describeCourseRevision
} from './helpers';

const describe = {
  'ACTIVITY': describeActivityRevision,
  'ASSET': describeAssetRevision,
  'COURSE': describeCourseRevision
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
    getTimestamp(rev) {
      const date = rev.createdAt.toLocaleDateString();
      const hours = rev.createdAt.getHours();
      const minutes = rev.createdAt.getMinutes();
      return `${date} ${hours}:` + (minutes < 10 ? `0${minutes}` : minutes);
    },
    getDescription(rev) {
      const user = rev.user.email;
      const description = describe[rev.resourceType](rev);
      return `User ${user} ${description}`;
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
.well {
  margin: 40px;
  font-size: 16px;
}

.revisions {
  margin: 40px 20px;
  padding: 30px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.74);
}

.table {
  text-align: left;
}
</style>
