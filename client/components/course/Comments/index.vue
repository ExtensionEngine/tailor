<template>
  <ul :class="{ 'comments-end': allComments }" class="comments">
    <v-btn
      @click="sendComments"
      color="info"
      outline>
      Send
    </v-btn>
    <comment
      v-for="(comment, index) in paginatedComments"
      :key="comment._cid || comment.id"
      :comment="comment"
      @update="onUpdate"
      @remove="onRemove"
      class="clearfix comment">
      <div
        v-if="sameActivity(comment.activityId, index)"
        slot="activity-id"
        class="comment-activity">
        Activity {{ comment.activityId }}
      </div>
      <span
        v-if="!initialCheckTime || initialCheckTime < comment.createdAt"
        slot="new-comment"
        class="new-comment">
        NEW
      </span>
    </comment>
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
  </ul>
</template>

<script>
import { mapGetters, mapActions } from 'vuex-module';
import CircularProgress from 'components/common/CircularProgress';
import Comment from '../Sidebar/Discussion/Comment';
import InfiniteLoading from 'vue-infinite-loading';
import isEmpty from 'lodash/isEmpty';
import api from 'client/api/auth';

export default {
  name: 'comments',
  data() {
    return {
      initialCheckTime: '',
      allComments: false
    };
  },
  computed: {
    ...mapGetters(['user']),
    ...mapGetters(['hasMoreResults'], 'comments'),
    ...mapGetters(['paginatedComments'])
  },
  methods: {
    ...mapActions(['fetchPaginated', 'resetPagination', 'update', 'remove'], 'comments'),
    fetchComments($state) {
      return this.fetchPaginated().then(() => {
        if (!isEmpty(this.paginatedComments)) $state.loaded();
        if (!this.hasMoreResults) {
          $state.complete();
          this.allComments = true;
        }
      });
    },
    onUpdate(comment, content) {
      const updatedAt = Date.now();
      this.update(Object.assign({}, comment, { content, updatedAt }));
    },
    onRemove(comment) {
      this.remove(comment);
    },
    sameActivity(activityId, i) {
      return i ? this.paginatedComments[i - 1].activityId !== activityId : !i;
    },
    sendComments() {
      const email = this.user.email;
      const comments = this.paginatedComments.slice(0, 10);
      api.emailComments({ email, comments });
    }
  },
  mounted() {
    this.resetPagination();
    const userId = this.user.id;
    const checkTime = new Date();
    api.commentCheckTime({ checkTime, userId })
      .then(data => (this.initialCheckTime = data.checkedAt));
  },
  components: { CircularProgress, Comment, InfiniteLoading }
};
</script>

<style lang="scss" scoped>
.loader-wrapper {
  margin: 50px 0;
}

.comments {
  margin: 60px 60px 0;
  padding: 20px 50px;
  text-align: left;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  list-style: none;
}

.comments-end {
  margin-bottom: 60px;
}

.new-comment {
  background-color:#737373;
  border-radius: 3px;
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 3px 5px;
  margin-right: 5px;
}

.comment-activity {
  border-bottom: gray solid 1px;
  margin: 20px 0px;
  padding: 10px 0px;
  font-size: 16px;
}

</style>
