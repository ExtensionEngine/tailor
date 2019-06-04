<template>
  <div class="body">
    <publishing v-if="isAdmin || isCourseAdmin"/>
    <v-chip :color="config.color" label dark small class="type-label">
      {{ config.label.toUpperCase() }}
    </v-chip>
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
import Discussion from './Discussion';
import Meta from 'components/common/Meta';
import Publishing from './Publishing';
import Relationship from './Relationship';

export default {
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapGetters(['activity', 'getConfig', 'getMetadata', 'isCourseAdmin'], 'course'),
    config() {
      return this.getConfig(this.activity);
    },
    metadata() {
      return this.getMetadata(this.activity);
    }
  },
  methods: {
    ...mapActions(['update'], 'activities'),
    updateActivity(key, value) {
      const data = { ...this.activity.data, [key]: value };
      this.update({ _cid: this.activity._cid, data });
    }
  },
  components: {
    Discussion,
    Publishing,
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

.discussion {
  margin-top: 32px;
  margin-bottom: 8px;
}

.type-label {
  margin: 5px 5px 20px;
  font-weight: 500;
}

.meta-element {
  > * {
    padding-top: 20px;
  }
}
</style>
