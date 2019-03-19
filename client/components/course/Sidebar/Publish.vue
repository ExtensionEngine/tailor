<template>
  <div class="publish-container">
    <div class="publish-date">
      <circular-progress v-if="isPublishing"></circular-progress>
      <span v-else>{{ publishedAtMessage }}</span>
    </div>
    <div class="btn-group">
      <a
        :disabled="isPublishing"
        @click="confirmPublishing()"
        class="btn btn-primary">
        Publish
      </a>
      <a
        :disabled="isPublishing"
        class="btn btn-primary dropdown-toggle"
        data-toggle="dropdown">
        <span class="caret"></span>
      </a>
      <ul class="dropdown-menu">
        <li>
          <a @click="confirmPublishing(activityWithDescendants)" href="#">
            Publish descendants
          </a>
        </li>
        <li>
          <a @click="confirmPublishing(outlineActivities)" href="#">
            Publish all
          </a>
        </li>
      </ul>
    </div>
    <div>
      <span>{{ publishStatus }}</span>
    </div>
  </div>
</template>

<script>
import CircularProgress from 'components/common/CircularProgress';
import publishMixin from 'components/common/mixins/publish';
import fecha from 'fecha';
import { getDescendants } from 'utils/activity';
import { mapGetters, mapActions } from 'vuex-module';

export default {
  mixins: [publishMixin],
  computed: {
    ...mapGetters([
      'activity',
      'outlineActivities'
    ], 'course'),
    publishedAtMessage() {
      let { publishedAt } = this.activity;
      return publishedAt
        ? `Published on ${fecha.format(new Date(publishedAt), 'M/D/YY HH:mm')}`
        : 'Not published';
    },
    activityWithDescendants({ activity, outlineActivities } = this) {
      return [...getDescendants(outlineActivities, activity), activity];
    }
  },
  methods: {
    ...mapActions({ publishActivity: 'publish' }, 'activities')
  },
  components: {
    CircularProgress
  }
};
</script>

<style lang="scss" scoped>
  .btn-group {
  position: absolute;
  top: 10px;
  right: 40px;
  padding: 6px;
  }

  .publish-container {
  min-height: 70px;
  padding: 0 7px;

  .publish-date {
    width: 170px;
    line-height: 44px;
  }

  .btn-group {
    position: absolute;
    top: 10px;
    right: 40px;
    padding: 6px;
  }

  .circular-progress {
    width: 24px;
    margin: 0 20px;
  }
}
</style>
