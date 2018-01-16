<template>
  <div class="body">
    <div class="publish-container">
      <div class="publish-date">
        <circular-progress v-if="publishing"></circular-progress>
        <span v-else>{{ publishStatus }}</span>
      </div>
      <button
        :disabled="publishing"
        @click="publish"
        class="btn btn-primary btn-material">
        Publish
      </button>
    </div>
    <div class="meta-element">
      <meta-input
        v-for="it in metadata"
        :meta="it"
        :key="`${activity.id}${it.type}`"
        @update="updateActivity">
      </meta-input>
    </div>
    <prerequisites v-if="config.hasPrerequisites"></prerequisites>
    <discussion
      editor-position="bottom"
      class="discussion">
    </discussion>
  </div>
</template>

<script>
import axios from 'client/api/request';
import CircularProgress from 'components/common/CircularProgress';
import cloneDeep from 'lodash/cloneDeep';
import Discussion from './Discussion';
import fecha from 'fecha';
import get from 'lodash/get';
import { getLevel } from 'shared/activities';
import map from 'lodash/map';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import Meta from 'components/common/Meta';
import Prerequisites from './Prerequisites';

export default {
  data() {
    return {
      publishing: false
    };
  },
  computed: {
    ...mapGetters(['activity'], 'course'),
    config() {
      return getLevel(this.activity.type) || {};
    },
    publishStatus() {
      let { publishedAt } = this.activity;
      return publishedAt
        ? `Published on ${fecha.format(new Date(publishedAt), 'M/D/YY HH:mm')}`
        : 'Not published';
    },
    metadata() {
      if (!get(this.config, 'meta')) return [];
      return map(this.config.meta, it => {
        let value = get(this.activity, `data.${it.key}`);
        return { ...it, value };
      });
    }
  },
  methods: {
    ...mapActions(['update'], 'activities'),
    ...mapMutations({ localUpdate: 'save' }, 'activities'),
    updateActivity(key, value) {
      const data = cloneDeep(this.activity.data) || {};
      data[key] = value;
      this.update({ _cid: this.activity._cid, data });
    },
    publish() {
      this.publishing = true;
      const { id, courseId } = this.activity;
      const url = `/courses/${courseId}/activities/${id}/publish`;
      return axios.get(url).then(({ data: { data } }) => {
        this.localUpdate({ ...this.activity, publishedAt: data.publishedAt });
        this.publishing = false;
      });
    }
  },
  components: {
    CircularProgress,
    Discussion,
    Prerequisites,
    MetaInput: Meta
  }
};
</script>

<style lang="scss" scoped>
.body {
  position: relative;
  padding: 6px;
}

.publish-container {
  min-height: 70px;
  padding: 0 10px;

  .publish-date {
    width: 170px;
    line-height: 44px;
  }

  .btn {
    position: absolute;
    top: 10px;
    right: 24px;
    padding: 6px;
  }

  .circular-progress {
    width: 24px;
    margin: 0 25px;
  }
}

.discussion {
  margin-top: 32px;
  margin-bottom: 8px;
}
</style>
