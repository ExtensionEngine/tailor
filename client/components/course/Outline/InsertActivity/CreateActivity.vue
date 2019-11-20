<template>
  <v-row class="align-center mt-6 px-1">
    <v-col>
      <v-text-field
        v-model="name"
        v-validate="{ required: true, min: 2, max: 250 }"
        :error-messages="vErrors.collect('name')"
        :autofocus="true"
        height="24"
        append-icon="mdi-pencil-outline"
        label="Name"
        name="name"
        filled
        dense />
    </v-col>
    <v-col v-if="showTypeSelect" class="col-3 ml-1">
      <v-select
        v-model="levelType"
        v-validate="{ required: true }"
        :error-messages="vErrors.collect('type')"
        :items="levels"
        item-text="label"
        item-value="type"
        height="24"
        label="Type"
        name="type"
        filled
        dense>
        <template slot="item" slot-scope="{ item }">
          <div v-if="item.group">
            <v-icon color="grey" size="16">mdi-subdirectory-arrow-right</v-icon>
            <span class="pt-2">{{ item.group }}</span>
          </div>
          <div
            v-else
            :class="{ 'pl-5': item.level > parent.level }"
            class="black--text">
            {{ item.label }}
          </div>
        </template>
      </v-select>
    </v-col>
    <v-col class="shrink action-buttons">
      <v-btn @click.stop="$emit('close')" color="grey darken-1" outlined>
        Cancel
      </v-btn>
      <v-btn
        @click.stop="create"
        :disabled="vErrors.any()"
        color="primary lighten-2"
        depressed
        class="ml-2 px-5">
        Add
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import first from 'lodash/first';
import { mapGetters } from 'vuex';
import partition from 'lodash/partition';
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
    showTypeSelect: vm => vm.supportedLevels.length > 1,
    levels() {
      const { supportedLevels: types, parent } = this;
      const [sameLevel, subLevel] = partition(types, { level: parent.level });
      if (!subLevel.length) return sameLevel;
      return [...sameLevel, { group: 'Sublevels', disabled: true }, ...subLevel];
    }
  },
  methods: {
    async create() {
      const isValid = await this.$validator.validateAll();
      if (!isValid) return;
      this.$emit('create', { type: this.levelType, data: { name: this.name } });
    }
  },
  created() {
    const { supportedLevels, showTypeSelect } = this;
    if (!showTypeSelect) this.levelType = first(supportedLevels).type;
  }
};
</script>

<style lang="scss" scoped>
.create-container {
  min-width: 100%;
}

.action-buttons {
  display: flex;
  justify-content: center;
  min-width: 13.5rem;
  padding: 0 0 1.5rem;
}
</style>
