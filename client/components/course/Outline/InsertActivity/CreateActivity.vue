<template>
  <v-container grid-list-xl fluid px-0>
    <v-layout row align-center>
      <v-flex grow>
        <v-text-field
          v-validate="{ required: true, min: 2, max: 250 }"
          :error-messages="vErrors.collect('name')"
          :autofocus="true"
          :placeholder="namePlaceholder"
          v-model="name"
          name="name"/>
      </v-flex>
      <v-flex v-if="showLevelPicker" class="type-select">
        <v-select
          v-validate="{ required: true }"
          :error-messages="vErrors.collect('type')"
          v-model="levelType"
          :items="levels"
          item-text="label"
          item-value="type"
          name="type"
          placeholder="Type">
          <template slot="item" slot-scope="levels">
            <div v-if="levels.item.group">
              <v-icon color="grey lighten-1">mdi-subdirectory-arrow-right</v-icon>
              {{ levels.item.group }}
            </div>
            <div
              v-else
              :class="{ 'pl-3': levels.item.level > parent.level }"
              class="black--text">
              {{ levels.item.label }}
            </div>
          </template>
        </v-select>
      </v-flex>
      <v-flex shrink>
        <v-item-group>
          <v-btn @click.stop="$emit('close')" outline>Cancel</v-btn>
          <v-btn
            :disabled="vErrors.any()"
            @click.stop="create"
            depressed
            color="primary lighten-1"
            class="mr-0">
            Add
          </v-btn>
        </v-item-group>
      </v-flex>
    </v-layout>
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
.type-select {
  max-width: 250px;
}
</style>
