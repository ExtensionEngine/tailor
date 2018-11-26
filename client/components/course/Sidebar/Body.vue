<template>
  <div class="body">
    <div class="publish-container">
      <div class="publish-date">
        <circular-progress v-if="publishing"></circular-progress>
        <span v-else>{{ publishStatus }}</span>
      </div>
      <button
        :disabled="publishing"
        @click="publishActivity"
        class="btn btn-primary btn-material">
        Publish
      </button>
    </div>
    <span class="type-label">{{ config.label }}</span>
    <div class="meta-element">
      <meta-input
        v-for="it in metadata"
        :key="`${activity._cid}.${it.key}`"
        :meta="it"
        @update="updateActivity">
      </meta-input>
    </div>
    <div class="relationships-element">
      <relationship
        v-for="relationship in config.relationships"
        v-bind="relationship"
        :key="`${activity._cid}.${relationship.type}`">
      </relationship>
    </div>
    <discussion
      editor-position="bottom"
      class="discussion">
    </discussion>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
import CircularProgress from 'components/common/CircularProgress';
import Discussion from './Discussion';
import fecha from 'fecha';
import Meta from 'components/common/Meta';
import Relationship from './Relationship';

export default {
  data() {
    return {
      publishing: false
    };
  },
  computed: {
    ...mapGetters(['activity', 'focusedElementConfig', 'focusedElementMetadata'], 'course'),
    config() {
      return this.focusedElementConfig();
    },
    publishStatus() {
      let { publishedAt } = this.activity;
      return publishedAt
        ? `Published on ${fecha.format(new Date(publishedAt), 'M/D/YY HH:mm')}`
        : 'Not published';
    },
    metadata() {
      return this.focusedElementMetadata();
    }
  },
  methods: {
    ...mapActions(['update', 'publish'], 'activities'),
    updateActivity(key, value) {
      const data = { ...this.activity.data, [key]: value };
      this.update({ _cid: this.activity._cid, data });
    },
    publishActivity() {
      this.publishing = true;
      this.publish(this.activity).then(() => (this.publishing = false));
    }
  },
  components: {
    CircularProgress,
    Discussion,
    Relationship,
    MetaInput: Meta
  }
};
</script>

<style lang="scss" scoped>
.body {
  position: relative;
  padding: 6px 15px;
}

.publish-container {
  min-height: 70px;
  padding: 0 7px;

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
    margin: 0 20px;
  }
}

.discussion {
  margin-top: 32px;
  margin-bottom: 8px;
}

.type-label {
  display: inline-block;
  margin: 5px 0 25px 7px;
}
</style>
