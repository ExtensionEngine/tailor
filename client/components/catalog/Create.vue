<template>
  <v-dialog
    v-hotkey="{ esc: hide }"
    v-if="isAdmin"
    v-model="isVisible"
    width="600px">
    <v-btn slot="activator" color="pink" dark absolute fab>
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-form @submit.prevent="submit">
      <v-card class="pa-3">
        <v-card-title class="headline">Create repository</v-card-title>
        <v-card-text>
          <v-alert
            :value="vErrors.has('default')"
            color="error"
            icon="mdi-alert-outline"
            outline>
            {{ vErrors.first('default') }}
          </v-alert>
          <v-select
            v-validate="'required'"
            v-model="repository.schema"
            :items="schemas"
            :error-messages="vErrors.collect('schema')"
            item-value="id"
            item-text="name"
            label="Type"
            data-vv-name="schema"
            class="mb-3"/>
          <v-text-field
            v-validate="{ required: true, min: 2, max: 250 }"
            v-model.trim="repository.name"
            :error-messages="vErrors.collect('name')"
            label="Name"
            data-vv-name="name"/>
          <v-textarea
            v-validate="{ required: true, min: 2, max: 2000 }"
            v-model.trim="repository.description"
            :error-messages="vErrors.collect('description')"
            label="Description"
            data-vv-name="description"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn :disabled="showLoader" @click="hide">Cancel</v-btn>
          <v-btn :loading="showLoader" color="primary" outline type="submit">
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
import Promise from 'bluebird';
import { SCHEMAS } from 'shared/activities';
import { withValidation } from 'utils/validation';

const getDefaultData = () => ({
  schema: null,
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
    schemas() {
      return SCHEMAS;
    }
  },
  methods: {
    ...mapActions(['save'], 'courses'),
    submit() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        this.showLoader = true;
        return Promise.join(this.save(this.repository), Promise.delay(1000))
          .then(() => this.hide())
          .catch(() => this.vErrors.add('default', 'An error has occurred!'));
      });
    },
    hide() {
      this.isVisible = false;
    }
  },
  watch: {
    isVisible(val) {
      if (!val) return;
      this.repository = getDefaultData();
      this.showLoader = false;
      this.vErrors.clear();
    }
  }
};
</script>
