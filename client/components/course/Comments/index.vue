<template>
  <div class="comments">
    <v-btn
      @click="sendComments"
      color="info"
      outline>
      Send
    </v-btn>
    <discussion
      v-for="discussion in sortedComments"
      :key="`header ${discussion[0]._cid || discussion[0].id}`"
      :discussion="discussion"
      :initialCheckTime="initialCheckTime"
    />
    <infinite-loading @infinite="fetchComments">
      <span slot="spinner">
        <div class="col-lg-12 loader-wrapper">
          <circular-progress></circular-progress>
        </div>
      </span>
      <div slot="no-results" class="no-results">
        {{ paginatedComments.length ? '' : 'No comments found.' }}
      </div>
      <span slot="no-more"></span>
    </infinite-loading>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
import api from 'client/api/auth';
import CircularProgress from 'components/common/CircularProgress';
import Discussion from './Discussion';
import InfiniteLoading from 'vue-infinite-loading';
import isEmpty from 'lodash/isEmpty';

export default {
  name: 'comments',
  data: () => ({
    initialCheckTime: '',
    allComments: false
  }),
  computed: {
    ...mapGetters(['user']),
    ...mapGetters(['hasMoreResults'], 'comments'),
    ...mapGetters(['paginatedComments']),
    sortedComments() {
      return this.paginatedComments.reduce((acc, comment, i) => {
        const previous = this.paginatedComments[i - 1];
        if (!previous || comment.activityId !== previous.activityId) {
          acc.push([]);
        }
        acc[acc.length - 1].push(comment);
        return acc;
      }, []);
    }
  },
  methods: {
    ...mapActions([
      'fetchPaginated',
      'resetPagination',
      'subscribe',
      'unsubscribe'
    ], 'comments'),
    fetchComments($state) {
      return this.fetchPaginated().then(() => {
        if (!isEmpty(this.paginatedComments)) $state.loaded();
        if (!this.hasMoreResults) {
          $state.complete();
          this.allComments = true;
        }
      });
    },
    sendComments() {
      const email = this.user.email;
      const { courseId } = this.$route.params;
      api.emailComments({ courseId, email, since: 7 });
    }
  },
  mounted() {
    this.resetPagination();
    this.subscribe();
    const userId = this.user.id;
    api.commentCheckTime({ userId })
      .then(data => (this.initialCheckTime = data.checkedAt));
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  components: { CircularProgress, Discussion, InfiniteLoading }
};
</script>

<style lang="scss" scoped>
.loader-wrapper {
  margin: 50px 0;
}

.comments {
  max-width: 850px;
  margin: 30px auto;
}
</style>
