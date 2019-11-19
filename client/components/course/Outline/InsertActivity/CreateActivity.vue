<template>
  <v-row class="align-center mt-1">
    <v-col class="grow">
      <v-text-field
        v-model="name"
        v-validate="{ required: true, min: 2, max: 250 }"
        :error-messages="vErrors.collect('name')"
        :autofocus="true"
        :placeholder="namePlaceholder"
        filled
        dense
        height="44"
        name="name"
        class="activity-input" />
    </v-col>
    <v-col v-if="showLevelPicker" class="col-3 ml-1">
      <v-select
        v-model="levelType"
        v-validate="{ required: true }"
        :error-messages="vErrors.collect('type')"
        :items="levels"
        item-text="label"
        item-value="type"
        name="type"
        filled
        dense
        height="44"
        placeholder="Type"
        class="activity-input">
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
    <v-col class="shrink action-buttons pt-0">
      <v-item-group class="mb-3">
        <v-btn @click.stop="$emit('close')" outlined height="44">Cancel</v-btn>
        <v-btn
          @click.stop="create"
          :disabled="vErrors.any()"
          depressed
          color="primary lighten-1"
          height="44"
          class="ml-2 mr-0">
          Add
        </v-btn>
      </v-item-group>
    </v-col>
  </v-row>
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
  min-width: 210px;
}

::v-deep {
  .v-input.activity-input > .v-input__control > .v-input__slot {
    background-color: #f8f8f8;
  }

  .v-select__slot, .v-text-field__slot {
    margin-bottom: 6px;
  }
}
</style>
