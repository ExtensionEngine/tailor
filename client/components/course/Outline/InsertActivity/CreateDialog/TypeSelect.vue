<template>
  <v-select
    v-validate="{ required: true }"
    @change="$emit('input', $event)"
    :value="value"
    :items="groupedOptions"
    :error-messages="vErrors.collect('type')"
    :disabled="disabled"
    item-text="label"
    item-value="type"
    name="type"
    label="Type"
    outlined
    class="required">
    <template slot="item" slot-scope="{ item }">
      <div v-if="item.group" class="pr-5">
        <v-icon color="grey" size="16" class="pr-1">mdi-folder-open-outline</v-icon>
        <span class="pt-2">{{ item.group }}</span>
      </div>
      <div
        v-else
        :class="{ 'pl-6': item.level > rootLevel }"
        class="black--text">
        <v-icon size="16" color="grey" class="pr-1">
          mdi-{{ hasSubtypes(item) ? 'folder' : 'file-document-box-outline' }}
        </v-icon>
        {{ item.label }}
      </div>
    </template>
  </v-select>
</template>

<script>
import partition from 'lodash/partition';
import size from 'lodash/size';
import sortedUniq from 'lodash/sortedUniq';
import { withValidation } from 'utils/validation';

export default {
  name: 'activity-type-select',
  mixins: [withValidation({ inherit: true })],
  props: {
    value: { type: String, default: null },
    options: { type: Array, required: true },
    disabled: { type: Boolean, default: false }
  },
  computed: {
    levels: vm => sortedUniq(vm.options.map(it => it.level)),
    rootLevel: vm => vm.levels[0],
    groupedOptions() {
      const { options, rootLevel } = this;
      const [sameLevel, subLevel] = partition(options, { level: rootLevel });
      if (!subLevel.length) return sameLevel;
      return [...sameLevel, { group: 'Sublevels', disabled: true }, ...subLevel];
    }
  },
  methods: {
    hasSubtypes: item => !!size(item.subLevels)
  }
};
</script>
