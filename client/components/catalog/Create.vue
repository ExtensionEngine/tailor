<template>
  <tailor-dialog
    v-if="isAdmin"
    v-model="isVisible"
    header-icon="mdi-folder-plus-outline">
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        color="secondary"
        fab dark absolute
        class="add-repo">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <template v-slot:header>New</template>
    <template v-slot:body>
      <validation-observer ref="form">
        <validation-provider name="alert">
          <v-alert
            :value="errorAlert.show"
            color="error"
            icon="mdi-alert-outline"
            outlined>
            {{ errorAlert.message }}
          </v-alert>
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          rules="required"
          name="schema">
          <v-select
            v-model="repository.schema"
            :items="schemas"
            :error-messages="errors"
            item-value="id"
            item-text="name"
            data-vv-name="schema"
            outlined
            class="mb-3" />
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          rules="required|min:2|max:250"
          name="repositoryName">
          <v-text-field
            v-model.trim="repository.name"
            :error-messages="errors"
            label="Name"
            placeholder="Enter name..."
            data-vv-name="name"
            outlined />
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          rules="required|min:2|max:2000"
          name="description">
          <v-textarea
            v-model.trim="repository.description"
            :error-messages="errors"
            label="Description"
            placeholder="Enter description..."
            data-vv-name="description"
            outlined />
        </validation-provider>
      </validation-observer>
    </template>
    <template v-slot:actions>
      <v-btn @click="hide" :disabled="showLoader" text>Cancel</v-btn>
      <v-btn
        @click="submit"
        :loading="showLoader"
        color="blue-grey darken-4"
        text>
        Create
      </v-btn>
    </template>
  </tailor-dialog>
</template>

<script>
import api from '@/api/repository';
import { mapGetters } from 'vuex';
import { SCHEMAS } from 'shared/activities';
import TailorDialog from '@/components/common/TailorDialog';

const resetData = () => ({
  schema: SCHEMAS[0].id,
  name: null,
  description: null
});

export default {
  name: 'create-repository',
  data: () => ({
    repository: resetData(),
    isVisible: false,
    showLoader: false,
    errorAlert: {
      show: false,
      message: 'An error has occurred!'
    }
  }),
  computed: {
    ...mapGetters(['isAdmin']),
    schemas: () => SCHEMAS
  },
  methods: {
    async submit() {
      const valid = await this.$refs.form.validate();
      if (!valid) return;
      this.showLoader = true;
      return api.save(this.repository)
        .then(() => this.$emit('created') && this.hide())
        .catch(() => (this.errorAlert.show = true));
    },
    hide() {
      this.showLoader = false;
      this.isVisible = false;
    }
  },
  watch: {
    isVisible(val) {
      if (!val) return setTimeout(() => this.$refs.form.reset(), 60);
      this.repository = resetData();
    }
  },
  components: { TailorDialog }
};
</script>

<style lang="scss" scoped>
::v-deep .v-list.v-sheet {
  text-align: left;
}
</style>
