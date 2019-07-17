<template>
  <v-dialog
    v-hotkey="{ esc: hide }"
    v-if="isAdmin"
    v-model="isVisible"
    width="600px">
    <v-btn
      slot="activator"
      color="pink"
      fab
      dark
      absolute
      class="add-repo">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
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
          <v-btn :loading="showLoader" outline type="submit">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Promise from 'bluebird';
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
    schemas() {
      return SCHEMAS;
    }
  },
  methods: {
    ...mapActions('courses', ['save']),
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
      this.repository = getDefaultData();
      this.$validator.reset();
      this.showLoader = false;
    }
  }
};
</script>
