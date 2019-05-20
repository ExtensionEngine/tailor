<template>
  <v-card class="comments-list">
    <div class="comment-activity">
      <span class="activity-title">
        {{ config[discussion[0].activityId].title }}
      </span>
      <div class="labels">
        <v-chip label small outline color="primary">
          A{{ discussion[0].activityId }}
        </v-chip>
        <v-chip
          :color="config[discussion[0].activityId].color"
          label
          small
          text-color="white">
          {{ config[discussion[0].activityId].label }}
        </v-chip>
      </div>
    </div>
    <v-list>
      <transition-group name="fade">
        <comment
          v-for="(comment, index) in discussionComments"
          :key="comment._cid || comment.id"
          v-bind="comment"
          @update="onUpdate(comment, $event)"
          @remove="onRemove(comment)"
          class="comment">
          <span
            v-if="!initialCheckTime || initialCheckTime < comment.createdAt"
            slot="new-comment"
            class="new-comment">
            NEW
          </span>
          <v-chip
            v-if="!index && discussion.length > 1"
            slot="show-more"
            @click="toggle"
            small
            outline
            class="more-comments">
            {{ discussion.length - 1 }} more
            <v-icon v-if="!showMore">mdi-chevron-down</v-icon>
            <v-icon v-else>mdi-chevron-up</v-icon>
          </v-chip>
        </comment>
      </transition-group>
    </v-list>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex-module';
import Comment from './Comment';
// import Comment from '../Sidebar/Discussion/Comment';
import isEmpty from 'lodash/isEmpty';

export default {
  name: 'dicsussion',
  props: {
    discussion: { type: Array, required: true },
    initialCheckTime: { type: String, required: true }
  },
  data: () => ({
    showMore: false
  }),
  computed: {
    ...mapGetters(['activities', 'getConfig'], 'course'),
    config() {
      return this.activities.reduce((acc, activity) => {
        if (!isEmpty(activity.data)) {
          const { label, color } = this.getConfig(activity);
          acc[activity.id] = { title: activity.data.name, label, color };
        }
        return acc;
      }, {});
    },
    discussionComments() {
      if (this.showMore) return this.discussion;
      return this.discussion.slice(0, 1);
    }
  },
  methods: {
    ...mapActions(['update', 'remove'], 'comments'),
    onUpdate(comment, content) {
      const updatedAt = new Date();
      this.update(Object.assign({}, comment, { content, updatedAt }));
    },
    onRemove(comment) {
      this.remove(comment);
    },
    toggle() {
      this.showMore = !this.showMore;
    }
  },
  components: { Comment }
};

</script>

<style lang="scss" scoped>
.comments-list {
  width: 100%;
  margin-bottom: 15px;
  padding: 25px 35px;
  text-align: left;
  list-style: none;

  .v-list {
    padding: 0;
  }
}

.comment-activity {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 15px;
  font-size: 16px;
  justify-content: space-between;
  border-bottom: 1px solid lightgray;
}

.activity-title {
  padding-left: 2px;
}

.labels {
  font-size: 0;

  .v-chip {
    margin: 0;
  }

  .v-chip + .v-chip {
    margin-left: 5px;
  }
}

.comment {
  width: 100%;
  padding-top: 10px;

  /deep/ .v-chip__content {
    cursor: pointer;
  }
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

.more-comments {
  margin: 15px 0 5px 0;
}
</style>
