<template>
  <div class="body">
    <div class="publish-container">
      <div class="publish-date">
        <circular-progress v-if="publishing"></circular-progress>
        <span v-else>{{ publishStatus }}</span>
      </div>
      <div class="btn-group">
        <a
          :disabled="publishing"
          @click="publishActivity"
          class="btn btn-primary">
          Publish
        </a>
        <a
          :disabled="publishing"
          class="btn btn-primary dropdown-toggle"
          data-toggle="dropdown">
          <span class="caret"></span>
        </a>
        <ul class="dropdown-menu">
          <li>
            <a
              @click="publishAll"
              href="#">
              Publish all
            </a>
          </li>
          <li>
            <a
              @click="publishWithDescendants"
              href="#">
              Publish descendants
            </a>
          </li>
        </ul>
      </div>
      <p>{{ currentPublish }}</p>
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
import { getAllChildren } from 'utils/activity';
import CircularProgress from 'components/common/CircularProgress';
import Discussion from './Discussion';
import fecha from 'fecha';
import filter from 'lodash/filter';
import map from 'lodash/map';
import Meta from 'components/common/Meta';
import Relationship from './Relationship';
import Promise from 'bluebird';

export default {
  data() {
    return {
      publishing: false,
      currentPublish: ''
    };
  },
  computed: {
    ...mapGetters(['activity', 'getConfig', 'getMetadata', 'activities', 'structure'], 'course'),
    config() {
      return this.getConfig(this.activity);
    },
    metadata() {
      return this.getMetadata(this.activity);
    },
    publishStatus() {
      let { publishedAt } = this.activity;
      return publishedAt
        ? `Published on ${fecha.format(new Date(publishedAt), 'M/D/YY HH:mm')}`
        : 'Not published';
    },
    allActivities() {
      return filter(this.activities, it => this.types.includes(it.type));
    },
    allDescendants() {
      return getAllChildren(this.activities, this.activity, this.types);
    },
    types() {
      return map(this.structure, 'type');
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
    },
    publishMultiple(activities) {
      this.publishing = true;
      Promise.each(activities, activity => {
        this.currentPublish = `Publishing ${activity.data.name}`;
        return (this.publish(activity));
      }).then(() => {
        this.publishing = false;
        this.currentPublish = '';
      });
    },
    publishWithDescendants() {
      this.publishMultiple(this.allDescendants);
    },
    publishAll() {
      this.publishMultiple(this.allActivities);
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

.discussion {
  margin-top: 32px;
  margin-bottom: 8px;
}

.type-label {
  display: inline-block;
  margin: 5px 0 25px 7px;
}
</style>
