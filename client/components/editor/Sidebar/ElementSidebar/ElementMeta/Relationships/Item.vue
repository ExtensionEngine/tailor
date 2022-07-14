<template>
  <v-list-item class="px-1">
    <v-list-item-content>
      <v-list-item-title>{{ label }}</v-list-item-title>
      <v-list-item-subtitle>{{ overview }}</v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-btn
            v-on="on"
            @click="showElementBrowser = true"
            :class="{ 'mr-3': hasRelationships }"
            outlined icon>
            <v-icon>mdi-{{ hasRelationships ? 'pen' : 'plus' }}</v-icon>
          </v-btn>
        </template>
        <span>{{ placeholder || defaultPlaceholder }}</span>
      </v-tooltip>
      <v-tooltip v-if="hasRelationships" bottom>
        <template #activator="{ on }">
          <v-btn
            v-on="on"
            @click="removeAll"
            color="error"
            outlined icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <span>Clear All</span>
      </v-tooltip>
    </v-list-item-action>
    <select-element
      v-if="showElementBrowser"
      @selected="select"
      @close="showElementBrowser = false"
      :selected="value"
      :heading="defaultPlaceholder"
      :multiple="multiple"
      :allowed-types="allowedTypes"
      header-icon="mdi-transit-connection-variant"
      only-current-repo />
  </v-list-item>
</template>

<script>
import { mapGetters } from 'vuex';
import { mapRequests } from '@extensionengine/vue-radio';
import pluralize from 'pluralize';
import { SelectElement } from '@tailor-cms/core-components';

function getTotalsByActivity(activities, relationships) {
  return activities.reduce((acc, { id, data: { name } }) => {
    const { length } = relationships.filter(({ outlineId }) => outlineId === id);
    return length ? [...acc, `${name} (${length})`] : acc;
  }, []);
}

export default {
  name: 'relationship-type',
  props: {
    value: { type: Array, default: () => [] },
    label: { type: String, required: true },
    placeholder: { type: String, default: '' },
    multiple: { type: Boolean, default: true },
    allowedTypes: { type: Array, default: () => [] }
  },
  data: () => ({ showElementBrowser: false }),
  computed: {
    ...mapGetters('repository', ['activities']),
    hasRelationships: vm => !!vm.value.length,
    defaultPlaceholder: vm => `Select element${vm.multiple ? 's' : ''}`,
    overview: ({ activities, value, hasRelationships }) => {
      return hasRelationships
        ? getTotalsByActivity(activities, value).join(', ')
        : '';
    }
  },
  methods: {
    ...mapRequests('app', ['showConfirmationModal']),
    removeAll() {
      let label = this.label.toLowerCase();
      label = this.multiple ? pluralize(label) : label;
      this.showConfirmationModal({
        title: `Remove ${label}?`,
        message: `Are you sure you want to remove ${label}?`,
        action: () => this.$emit('save', [])
      });
    },
    select(elements) {
      const items = elements.map(it => {
        if (!it.activity) return it;
        const { id, activity, activityId: containerId } = it;
        return { id, containerId, outlineId: activity.id };
      });
      this.$emit('save', items);
    }
  },
  components: { SelectElement }
};
</script>

<style lang="scss" scoped>
.v-list-item__action {
  display: flex;
  flex-direction: row;
}
</style>
