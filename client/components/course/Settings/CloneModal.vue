<template>
  <v-dialog :value="show" width="600px" persistent>
    <v-card class="pa-3">
      <v-card-title class="headline">
        <v-avatar color="secondary" size="38" class="mr-2">
          <v-icon color="white">mdi-content-copy</v-icon>
        </v-avatar>
        Clone repository
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-validate="{ required: true, min: 2, max: 250 }"
          v-model="name"
          :disabled="showLoader"
          :error-messages="vErrors.collect('name')"
          class="mb-4 form-group"
          label="Name"
          data-vv-name="name"/>
        <v-textarea
          v-validate="{ required: true, min: 2, max: 2000 }"
          v-model="description"
          :disabled="showLoader"
          :error-messages="vErrors.collect('description')"
          class="mb-4 form-group"
          label="Description"
          data-vv-name="description"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn :disabled="showLoader" @click="close">Cancel</v-btn>
        <v-btn
          :loading="showLoader"
          @click="cloneRepository"
          color="primary"
          outline>
          Clone
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import pick from 'lodash/pick';
import Promise from 'bluebird';

export default {
  props: {
    show: { type: Boolean, required: true }
  },
  data() {
    return {
      showLoader: false,
      name: '',
      description: ''
    };
  },
  methods: {
    ...mapActions('courses', ['clone']),
    close() {
      this.$emit('close');
      this.name = '';
      this.description = '';
      this.showLoader = false;
    },
    cloneRepository() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        this.showLoader = true;
        const { courseId } = this.$route.params;
        const data = { id: courseId, ...pick(this, ['name', 'description']) };
        return Promise.join(this.clone(data), Promise.delay(500))
          .then(() => this.close());
      });
    }
  },
  watch: {
    show(val) {
      if (!val) return;
      this.vErrors.clear();
    }
  },
  inject: ['$validator']
};
</script>
