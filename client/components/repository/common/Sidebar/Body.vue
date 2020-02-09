<template>
  <div class="body">
    <v-chip
      :color="config.color"
      label dark small
      class="type-label">
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
    <discussion />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Discussion from './Discussion';
import Meta from 'components/common/Meta';
import Relationship from './Relationship';

export default {
  name: 'activity-sidebar-body',
  props: {
    activity: { type: Object, required: true }
  },
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapGetters('repository', ['getConfig', 'getMetadata', 'isRepositoryAdmin']),
    config: vm => vm.getConfig(vm.activity),
    metadata: vm => vm.getMetadata(vm.activity)
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
  padding: 0.375rem 1rem;
}

.type-label {
  margin: 0.25rem 0.25rem 1.25rem;
  font-weight: 500;
}

.meta-elements {
  padding-top: 0.625rem;
}
</style>
