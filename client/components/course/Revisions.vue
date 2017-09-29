<template>
  <div>
    <div v-if="revisions.length === 0" class="well">
      No changes recorded.
    </div>
    <div v-else class="revisions">
      <table class="table table-hover">
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
} from 'utils/revision';
import InfiniteScroll from 'vue-infinite-scroll';
import Loader from '../common/Loader';
import Promise from 'bluebird';

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
      return this.revisions;
    }
  },
  methods: {
    ...mapActions(['fetch'], 'revisions'),
    ...mapMutations(['setBaseUrl', 'resetPagination'], 'revisions'),
    fetchRevisions() {
      this.resetPagination();
      return Promise.join(this.fetch(), Promise.delay(400));
    },
    loadMore() {
      if (this.hasMoreResults) {
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
    this.fetchRevisions();
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

  .table {
    border-color: grey;
    font-family: Roboto, sans-serif;

    thead > tr {
      height: 56px;
    }

    tbody > tr {
      height: 48px;
    }

    th, td {
      padding: 0 24px;
      vertical-align: middle;
      border-color: inherit;
    }

    th {
      border-bottom-width: 1px;
      font-size: 12px;
    }

    td {
      border-color: rgba(0, 0, 0, 0.12);
      font-size: 13px;
    }
  }
}

.table {
  text-align: left;
}
</style>
