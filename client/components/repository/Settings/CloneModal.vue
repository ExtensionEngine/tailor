<template>
  <tailor-dialog :value="show" header-icon="mdi-content-copy" persistent>
    <template v-slot:header>Clone {{ schema.toLowerCase() }}</template>
    <template v-slot:body>
      <v-text-field
        v-model="name"
        v-validate="{ required: true, min: 2, max: 250 }"
        :disabled="inProgress"
        :error-messages="vErrors.collect('name')"
        label="Name"
        placeholder="Enter name..."
        data-vv-name="name"
        outlined
        class="mb-4" />
      <v-textarea
        v-model="description"
        v-validate="{ required: true, min: 2, max: 2000 }"
        :disabled="inProgress"
        :error-messages="vErrors.collect('description')"
        label="Description"
        placeholder="Enter description..."
        data-vv-name="description"
        outlined
        class="mb-4" />
    </template>
    <template v-slot:actions>
      <v-btn @click="close" :disabled="inProgress" text>Cancel</v-btn>
      <v-btn
        @click="cloneRepository"
        :loading="inProgress"
        color="primary"
        text>
        Clone
      </v-btn>
    </template>
  </tailor-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import pick from 'lodash/pick';
import TailorDialog from '@/components/common/TailorDialog';
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
    async cloneRepository() {
      const isValid = await this.$validator.validateAll();
      if (!isValid) return;
      this.inProgress = true;
      const { repositoryId } = this.$route.params;
      const data = { id: repositoryId, ...pick(this, ['name', 'description']) };
      await this.clone(data);
      this.close();
    }
  },
  components: { TailorDialog }
};
</script>
