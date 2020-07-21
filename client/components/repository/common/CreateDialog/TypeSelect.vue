<template>
  <v-select
    v-validate="{ required: true }"
    @change="$emit('input', $event)"
    :value="value"
    :items="options"
    :error-messages="vErrors.collect('type')"
    :disabled="disabled"
    item-value="type"
    item-text="label"
    name="type"
    label="Type"
    outlined
    class="required">
    <template slot="item" slot-scope="{ item }">
      <div class="black--text">
        <v-icon size="16" color="grey" class="pr-1">
          mdi-{{ hasSubtypes(item) ? 'folder' : 'file-document-box-outline' }}
        </v-icon>
        {{ item.label }}
      </div>
    </template>
  </v-select>
</template>

<script>
import size from 'lodash/size';
import { withValidation } from 'utils/validation';

export default {
  name: 'activity-type-select',
  mixins: [withValidation({ inherit: true })],
  props: {
    value: { type: String, default: null },
    options: { type: Array, required: true },
    disabled: { type: Boolean, default: false }
  },
  methods: {
    hasSubtypes: item => !!size(item.subLevels)
  }
};
</script>
