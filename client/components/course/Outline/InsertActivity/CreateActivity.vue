<template>
  <v-container class="fluid create-container">
    <v-row class="align-center">
      <v-col class="grow">
        <v-text-field
          v-model="name"
          v-validate="{ required: true, min: 2, max: 250 }"
          :error-messages="vErrors.collect('name')"
          :autofocus="true"
          :placeholder="namePlaceholder"
          name="name" />
      </v-col>
      <v-col v-if="showLevelPicker" class="col-2">
        <v-select
          v-model="levelType"
          v-validate="{ required: true }"
          :error-messages="vErrors.collect('type')"
          :items="levels"
          item-text="label"
          item-value="type"
          name="type"
          placeholder="Type">
          <template slot="item" slot-scope="{ item }">
            <div v-if="item.group">
              <v-icon color="grey lighten-1">mdi-subdirectory-arrow-right</v-icon>
              {{ item.group }}
            </div>
            <div
              v-else
              :class="{ 'pl-3': item.level > parent.level }"
              class="black--text">
              {{ item.label }}
            </div>
          </template>
        </v-select>
      </v-col>
      <v-col class="shrink action-buttons">
        <v-item-group>
          <v-btn @click.stop="$emit('close')" outline>Cancel</v-btn>
          <v-btn
            @click.stop="create"
            :disabled="vErrors.any()"
            depressed
            color="primary lighten-1"
            class="mr-0">
            Add
          </v-btn>
        </v-item-group>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import first from 'lodash/first';
import { mapGetters } from 'vuex';
import { withValidation } from 'utils/validation';

export default {
  mixins: [withValidation()],
  props: {
    parent: { type: Object, required: true },
    supportedLevels: { type: Array, required: true }
  },
  data() {
    return { name: '', levelType: null };
  },
  computed: {
    ...mapGetters('course', ['structure']),
    showLevelPicker() {
      return this.supportedLevels.length > 1;
    },
    levels() {
      const grouped = cloneDeep(this.supportedLevels);
      const nestedIndex = findIndex(grouped, it => it.level > this.parent.level);
      if (nestedIndex !== -1) {
        grouped.splice(nestedIndex, 0, { group: 'Sublevels', disabled: true });
      }
      return grouped;
    },
    namePlaceholder() {
      const { showLevelPicker, supportedLevels } = this;
      return showLevelPicker ? 'Name' : `${supportedLevels[0].label} name`;
    }
  },
  methods: {
    create() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        this.$emit('create', { type: this.levelType, data: { name: this.name } });
      });
    }
  },
  created() {
    const { supportedLevels, showLevelPicker } = this;
    if (!showLevelPicker) this.levelType = first(supportedLevels).type;
  }
};
</script>

<style lang="scss" scoped>
.create-container {
  min-width: 100%;
}

.action-buttons {
  min-width: 190px;
}
</style>
