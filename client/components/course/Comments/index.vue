<template>
  <div :class="{ 'comments-end': allComments }" class="comments">
    <v-btn
      @click="sendComments"
      color="info"
      outline>
      Send
    </v-btn>
    <v-list two-line>
      <template v-for="(comment, index) in paginatedComments">
        <v-subheader
          v-if="!isSameDiscussion(comment, paginatedComments[index - 1])"
          :key="`header ${comment._cid || comment.id}`"
          class="comment-activity">
          <span class="activity-title">
            {{ config[comment.activityId].title }}
          </span>
          <div class="labels">
            <v-chip label small outline color="primary">
              A{{ comment.activityId }}
            </v-chip>
            <v-chip
              :color="config[comment.activityId].color"
              label
              small
              text-color="white">
              {{ config[comment.activityId].label }}
            </v-chip>
          </div>
        </v-subheader>
        <v-list-tile :key="comment._cid || comment.id">
          <comment
            :comment="comment"
            @update="onUpdate"
            @remove="onRemove"
            class="clearfix comment">
            <span
              v-if="!initialCheckTime || initialCheckTime < comment.createdAt"
              slot="new-comment"
              class="new-comment">
              NEW
            </span>
          </comment>
        </v-list-tile>
      </template>
    </v-list>
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
import { mapGetters, mapActions } from 'vuex-module';
import api from 'client/api/auth';
import CircularProgress from 'components/common/CircularProgress';
import Comment from '../Sidebar/Discussion/Comment';
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
    ...mapGetters(['activities', 'getConfig'], 'course'),
    config() {
      return this.activities.reduce((acc, activity) => {
        if (!isEmpty(activity.data)) {
          const { label, color } = this.getConfig(activity);
          acc[activity.id] = { title: activity.data.name, label, color };
        }
        return acc;
      }, {});
    }
  },
  methods: {
    ...mapActions([
      'fetchPaginated',
      'resetPagination',
      'update',
      'remove',
      'subscribe',
      'unsubscribe'
    ], 'comments'),
    isSameDiscussion,
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
    const checkTime = new Date();
    api.commentCheckTime({ checkTime, userId })
      .then(data => (this.initialCheckTime = data.checkedAt));
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  components: { CircularProgress, Comment, InfiniteLoading }
};

function isSameDiscussion(comment1 = {}, comment2 = {}) {
  return comment1.activityId === comment2.activityId;
}
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

.comment {
  width: 100%;
}

.comments-end {
  margin-bottom: 60px;
}

.new-comment {
  margin-right: 5px;
  padding: 3px 5px;
  color: white;
  font-size: 10px;
  font-weight: bold;
  background-color: #737373;
  border-radius: 3px;
}

.comment-activity {
  display: flex;
  border-bottom: gray solid 1px;
  margin: 20px 0;
  padding: 10px 0;
  font-size: 18px;
  justify-content: space-between;
}

.activity-title {
  padding-left: 2px;
}

.labels {
  font-size: 0;

  .v-chip + .v-chip {
    margin-left: 0;
  }
}

</style>
