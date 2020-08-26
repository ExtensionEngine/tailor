<template>
  <validation-observer v-slot="{ handleSubmit}" ref="form" slim>
    <tailor-dialog :value="show" header-icon="mdi-content-copy" persistent>
      <template v-slot:header>Clone {{ schema.toLowerCase() }}</template>
      <template v-slot:body>
        <validation-provider
          v-slot="{ errors }"
          mode="eager"
          rules="required|min:2|max:250"
          name="name">
          <v-text-field
            v-model="name"
            :error-messages="errors"
            :disabled="inProgress"
            label="Name"
            placeholder="Enter name..."
            outlined
            class="mb-4" />
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          mode="eager"
          rules="required|min:2|max:2000"
          name="description">
          <v-textarea
            v-model="description"
            :error-messages="errors"
            :disabled="inProgress"
            label="Description"
            placeholder="Enter description..."
            outlined
            class="mb-4" />
        </validation-provider>
      </template>
      <template v-slot:actions>
        <v-btn @click="close" :disabled="inProgress" text>Cancel</v-btn>
        <v-btn
          @click.prevent="handleSubmit(cloneRepository)"
          :loading="inProgress"
          color="primary"
          text>
          Clone
        </v-btn>
      </template>
    </tailor-dialog>
  </validation-observer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import pick from 'lodash/pick';
import TailorDialog from '@/components/common/TailorDialog';

const getDefaultState = () => ({
  inProgress: false,
  name: '',
  description: ''
});

export default {
  props: {
    show: { type: Boolean, default: true }
  },
  data: () => getDefaultState(),
  computed: mapGetters('repository', ['schema']),
  methods: {
    ...mapActions('repositories', ['clone']),
    close() {
      this.$emit('close');
      Object.assign(this, getDefaultState());
      this.$refs.form.reset();
    },
    async cloneRepository() {
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
