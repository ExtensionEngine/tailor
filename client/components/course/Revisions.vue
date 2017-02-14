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
            <td>{{ formatDate(revision) }}</td>
            <td>{{ formatDescription(revision) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import fecha from 'fecha';
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
  computed: {
    ...mapGetters(['revisions'], 'editor'),
    ...mapGetters(['getParent'], 'activity')
  },
  methods: {
    ...mapActions(['fetch'], 'revisions'),
    ...mapMutations(['setBaseUrl'], 'revisions'),
    formatDate(rev) {
      return fecha.format(rev.createdAt, 'M/D/YY HH:mm');
    },
    formatDescription(rev) {
      const user = rev.user.email;
      const topic = rev.entity === 'ASSET'
        ? this.getParent(rev.activityId)
        : undefined;
      const description = describe[rev.entity](rev, topic);
      return `User ${user} ${description}`;
    }
  },
  created() {
    const courseId = Number(this.$route.params.courseKey);
    this.setBaseUrl(`/courses/${courseId}/revisions`);
    this.fetch();
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
