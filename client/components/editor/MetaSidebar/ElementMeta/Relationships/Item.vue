<template>
  <v-list-item class="pl-0">
    <v-list-item-content>
      <v-list-item-title v-text="label" />
      <v-list-item-subtitle v-text="overview" />
    </v-list-item-content>
    <v-list-item-action>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
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
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            @click="save([])"
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
      @save="$emit('save', $event)"
      :selected="value"
      :heading="defaultPlaceholder"
      :multiple="multiple"
      :allowed-types="allowedTypes" />
  </v-list-item>
</template>

<script>
import { mapGetters } from 'vuex';
import reduce from 'lodash/reduce';
import SelectElement from '@/components/common/SelectElement';

function getTotalsByActivity(activities, relationships) {
  return reduce(activities, (acc, { id, data: { name } }) => {
    const { length } = relationships.filter(({ outlineId }) => outlineId === id);
    return length ? [...acc, `${name} (${length})`] : acc;
  }, []);
}

export default {
  name: 'relationship-type',
  props: {
    key: { type: String, required: true },
    value: { type: Array, default: () => [] },
    label: { type: String, required: true },
    placeholder: { type: String, default: '' },
    multiple: { type: Boolean, default: true },
    allowedTypes: { type: Array, default: () => [] }
  },
  data: () => ({ showElementBrowser: false }),
  computed: {
    ...mapGetters('repository', ['activities', 'structure']),
    hasRelationships: vm => !!vm.value.length,
    defaultPlaceholder: vm => `Select element${vm.multiple ? 's' : ''}`,
    overview: ({ activities, value, hasRelationships }) => {
      return hasRelationships
        ? getTotalsByActivity(activities, value).join(', ')
        : '';
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
