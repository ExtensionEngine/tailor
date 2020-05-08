<template>
  <div class="body">
    <v-chip
      :color="config.color"
      label dark small
      class="body-label">
      {{ config.label.toUpperCase() }}
    </v-chip>
    <v-tooltip open-delay="500" bottom>
      <template v-slot:activator="{ on }">
        <span v-on="on">
          <v-chip
            color="blue-grey lighten-5"
            label small
            class="body-label subtitle-2">
            {{ activity.shortId }}
          </v-chip>
        </span>
      </template>
      {{ config.label }} ID
    </v-tooltip>
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
        :activity="activity"
        v-bind="relationship" />
    </div>
    <discussion :activity="activity" />
  </div>
</template>

<script>
import { getActivityMetadata, getLevel } from 'shared/activities';
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
    ...mapGetters('repository', ['isRepositoryAdmin']),
    config: vm => getLevel(vm.activity.type),
    metadata: vm => getActivityMetadata(vm.activity)
  },
  methods: {
    ...mapActions('repository/activities', ['update']),
    async updateActivity(key, value) {
      const data = { ...this.activity.data, [key]: value };
      await this.update({ _cid: this.activity._cid, data });
      this.$snackbar.show(`${this.config.label} saved`);
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

.body-label {
  margin: 0.25rem 0.25rem 1.25rem;
  font-weight: 500;
}

.meta-elements {
  padding-top: 0.625rem;
}
</style>
