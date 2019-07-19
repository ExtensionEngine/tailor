<template>
  <v-container grid-list-xl fluid>
    <v-layout row align-center>
      <v-flex grow>
        <v-text-field
          v-validate="{ required: true, min: 2, max: 250 }"
          :error-messages="vErrors.collect('name')"
          :autofocus="true"
          v-model="name"
          name="name"
          placeholder="Name"/>
      </v-flex>
      <v-flex shrink>
        <v-select
          v-validate="{ required: true }"
          v-if="showLevelPicker"
          :error-messages="vErrors.collect('type')"
          v-model="levelType"
          :items="supportedLevels"
          item-text="label"
          item-value="type"
          name="type"
          placeholder="Type"/>
      </v-flex>
      <v-flex shrink>
        <v-item-group>
          <v-btn @click.stop="$emit('close')">Cancel</v-btn>
          <v-btn
            :disabled="vErrors.any()"
            @click.stop="create"
            color="primary"
            outline>
            Add
          </v-btn>
        </v-item-group>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
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
