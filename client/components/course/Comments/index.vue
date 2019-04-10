<template>
  <ul class="comments">
    <comment
      v-for="comment in courseComments"
      :key="comment._cid || comment.id"
      :comment="comment"
      @update="onUpdate"
      @remove="onRemove"
      class="clearfix comment">
      <span class="comment-activity">Activity {{ comment.activityId }}</span>
    </comment>
    <infinite-loading @infinite="fetchComments">
      <span slot="spinner">
        <div class="col-lg-12 loader-wrapper">
          <circular-progress></circular-progress>
        </div>
      </span>
      <div slot="no-results" class="no-results">
        {{ courseComments.length ? '' : 'No comments found.' }}
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

export default {
  name: 'comments',
  computed: {
    ...mapGetters(['hasMoreResults'], 'comments'),
    ...mapGetters(['courseComments'])
  },
  methods: {
    ...mapActions(['fetch', 'resetPagination', 'update', 'remove'], 'comments'),
    fetchComments($state) {
      return this.fetch().then(() => {
        if (!isEmpty(this.courseComments)) $state.loaded();
        if (!this.hasMoreResults) $state.complete();
      });
    },
    onUpdate(comment, content) {
      const updatedAt = Date.now();
      this.update(Object.assign({}, comment, { content, updatedAt }));
    },
    onRemove(comment) {
      this.remove(comment);
    }
  },
  mounted() {
    this.resetPagination();
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
  padding: 30px;
  text-align: left;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  list-style: none;
}
</style>
