<template>
  <v-dialog :value="show" width="600" persistent>
    <v-card class="pa-3">
      <v-card-title class="headline">
        <v-avatar color="secondary" size="38" class="mr-2">
          <v-icon color="white">mdi-content-copy</v-icon>
        </v-avatar>
        <span>Clone {{ schema.toLowerCase() }}</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="name"
          v-validate="{ required: true, min: 2, max: 250 }"
          :disabled="inProgress"
          :error-messages="vErrors.collect('name')"
          label="Name"
          data-vv-name="name"
          class="mb-4" />
        <v-textarea
          v-model="description"
          v-validate="{ required: true, min: 2, max: 2000 }"
          :disabled="inProgress"
          :error-messages="vErrors.collect('description')"
          label="Description"
          data-vv-name="description"
          class="mb-4" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="close" :disabled="inProgress">Cancel</v-btn>
        <v-btn
          @click="cloneRepository"
          :loading="inProgress"
          outline>
          Clone
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import pick from 'lodash/pick';
import Promise from 'bluebird';
import { withValidation } from 'utils/validation';

const getDefaultState = () => ({
  inProgress: false,
  name: '',
  description: ''
});

export default {
  mixins: [withValidation()],
  props: {
    show: { type: Boolean, required: true }
  },
  data: () => getDefaultState(),
  computed: mapGetters('repository', ['schema']),
  methods: {
    ...mapActions('repositories', ['clone']),
    close() {
      this.$emit('close');
      Object.assign(this, getDefaultState());
      this.$validator.reset();
    },
    cloneRepository() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        this.inProgress = true;
        const { repositoryId } = this.$route.params;
        const data = { id: repositoryId, ...pick(this, ['name', 'description']) };
        return Promise.join(this.clone(data), Promise.delay(500))
          .then(() => this.close());
      });
    }
  }
};
</script>
