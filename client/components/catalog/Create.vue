<template>
  <v-dialog
    v-if="isAdmin"
    v-model="isVisible"
    v-hotkey="{ esc: hide }"
    width="700px">
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        color="pink"
        fab
        dark
        absolute
        class="add-repo">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-form @submit.prevent="submit">
      <v-card class="pa-3">
        <v-card-title class="headline">
          <v-avatar color="secondary" size="38" class="mr-2">
            <v-icon color="white">mdi-folder-plus-outline</v-icon>
          </v-avatar>
          New
        </v-card-title>
        <v-card-text>
          <v-alert
            :value="vErrors.has('default')"
            color="error"
            icon="mdi-alert-outline"
            outlined>
            {{ vErrors.first('default') }}
          </v-alert>
          <v-select
            v-model="repository.schema"
            v-validate="'required'"
            :items="schemas"
            :error-messages="vErrors.collect('schema')"
            item-value="id"
            item-text="name"
            data-vv-name="schema"
            class="mb-3" />
          <v-text-field
            v-model.trim="repository.name"
            v-validate="{ required: true, min: 2, max: 250 }"
            :error-messages="vErrors.collect('name')"
            label="Name"
            data-vv-name="name" />
          <v-textarea
            v-model.trim="repository.description"
            v-validate="{ required: true, min: 2, max: 2000 }"
            :error-messages="vErrors.collect('description')"
            label="Description"
            data-vv-name="description" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="hide" :disabled="showLoader">Cancel</v-btn>
          <v-btn :loading="showLoader" outlined type="submit">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import api from '@/api/course';
import { mapGetters } from 'vuex';
import { SCHEMAS } from 'shared/activities';
import { withValidation } from 'utils/validation';

const getDefaultData = () => ({
  schema: SCHEMAS[0].id,
  name: null,
  description: null
});

export default {
  name: 'create-repository',
  mixins: [withValidation()],
  data() {
    return {
      repository: getDefaultData(),
      isVisible: false,
      showLoader: false
    };
  },
  computed: {
    ...mapGetters(['isAdmin']),
    schemas: () => SCHEMAS
  },
  methods: {
    async submit() {
      const isValid = await this.$validator.validateAll();
      if (!isValid) return;
      this.showLoader = true;
      return api.save(this.repository)
        .then(() => this.$emit('created') && this.hide())
        .catch(() => this.vErrors.add('default', 'An error has occurred!'));
    },
    hide() {
      this.repository = getDefaultData();
      this.showLoader = false;
      this.isVisible = false;
    }
  },
  watch: {
    isVisible(val) {
      if (!val) return;
      setTimeout(() => this.$validator.reset(), 60);
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .v-list.v-sheet {
  text-align: left;
}
</style>
