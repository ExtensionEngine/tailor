<template>
  <validation-provider
    v-slot="{ errors }"
    name="type"
    rules="required">
    <v-select
      @change="$emit('input', $event)"
      :value="value"
      :items="options"
      :error-messages="errors"
      :disabled="disabled"
      :menu-props="{ bottom: true, offsetY: true, maxHeight: 220 }"
      item-value="type"
      item-text="label"
      name="type"
      label="Type"
      outlined attach
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
  </validation-provider>
</template>

<script>
import size from 'lodash/size';

export default {
  name: 'activity-type-select',
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
