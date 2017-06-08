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
          <tr v-for="revision in getRevisions">
            <td>{{ formatDate(revision) }}</td>
            <td>{{ formatDescription(revision) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="col-lg-12 loader-wrapper">
      <loader v-show="paginate"></loader>
      <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="paginate"
        infinite-scroll-distance="100">
      </div>
    </div>
  </div>
</template>

<script>
import fecha from 'fecha';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import {
  describeActivityRevision,
  describeElementRevision,
  describeCourseRevision
} from '../../utils/revision';
import InfiniteScroll from 'vue-infinite-scroll';
import Loader from '../common/Loader';

const describe = {
  'COURSE': describeCourseRevision,
  'ACTIVITY': describeActivityRevision,
  'TEACHING_ELEMENT': describeElementRevision
};

export default {
  name: 'course-revisions',
  data() {
    return {
      paginate: false
    };
  },
  computed: {
    ...mapGetters(['getParent'], 'activities'),
    ...mapGetters(['revisions'], 'course'),
    ...mapGetters(['hasMoreResults'], 'revisions'),
    getRevisions() {
      console.log('In Vue: getRevisions()');
      return this.revisions;
    }
  },
  methods: {
    ...mapActions(['fetch'], 'revisions'),
    ...mapMutations(['setBaseUrl'], 'revisions'),
    loadMore() {
      if (this.hasMoreResults) {
        console.log('In Vue: loadMore()');
        this.paginate = true;
        this.fetch().then(() => {
          this.paginate = false;
        });
      }
    },
    formatDate(rev) {
      return fecha.format(rev.createdAt, 'M/D/YY HH:mm');
    },
    formatDescription(rev) {
      const user = rev.user.email;
      const topic = rev.entity === 'ASSET'
        ? this.getParent(rev.state.activityId)
        : undefined;
      const description = describe[rev.entity](rev, topic);
      return `User ${user} ${description}`;
    }
  },
  mounted() {
    const courseId = Number(this.$route.params.courseId);
    this.setBaseUrl(`/courses/${courseId}/revisions`);
    this.fetch();
  },
  components: {
    Loader
  },
  directives: {
    InfiniteScroll
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
