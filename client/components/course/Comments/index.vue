<template>
  <div class="comments">
    <comment
      v-for="comment in courseComments"
      :key="comment._cid || comment.id"
      :comment="comment"
      class="clearfix comment"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex-module';
import Comment from '../Sidebar/Discussion/Comment';

export default {
  name: 'comments',
  computed: {
    ...mapGetters(['courseComments'])
  },
  methods: {
    ...mapActions(['fetch'], 'comments')
  },
  created() {
    this.fetch();
  },
  components: { Comment }
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
