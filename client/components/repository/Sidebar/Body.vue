<template>
  <div class="body">
    <v-chip :color="config.color" label dark small class="type-label">
      {{ config.label.toUpperCase() }}
    </v-chip>
    <div class="meta-elements">
      <meta-input
        v-for="it in metadata"
        :key="`${activity._cid}.${it.key}`"
        @update="updateActivity"
        :meta="it" />
    </div>
    <div>
      <relationship
        v-for="relationship in config.relationships"
        :key="`${activity._cid}.${relationship.type}`"
        v-bind="relationship" />
    </div>
    <discussion editor-position="bottom" class="discussion" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Discussion from './Discussion';
import Meta from 'components/common/Meta';
import Relationship from './Relationship';

export default {
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapGetters('repository',
      ['activity', 'getConfig', 'getMetadata', 'isRepositoryAdmin']),
    config() {
      return this.getConfig(this.activity);
    },
    metadata() {
      return this.getMetadata(this.activity);
    }
  },
  methods: {
    ...mapActions('activities', ['update']),
    updateActivity(key, value) {
      const data = { ...this.activity.data, [key]: value };
      this.update({ _cid: this.activity._cid, data });
    }
  },
  components: {
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

.type-label {
  margin: 5px 5px 20px;
  font-weight: 500;
}

.meta-elements {
  padding-top: 10px;
}
</style>
