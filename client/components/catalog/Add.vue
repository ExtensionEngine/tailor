<template>
  <tailor-dialog
    v-if="isAdmin"
    v-model="isVisible"
    header-icon="mdi-folder-plus-outline"
    paddingless persistent>
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        color="secondary"
        fab dark absolute
        class="add-repo">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <template v-slot:header>Add</template>
    <template v-slot:body>
      <v-tabs
        v-model="selectedTab"
        background-color="primary darken-1"
        slider-color="secondary lighten-2"
        slider-size="3"
        dark grow>
        <v-tab key="schema">New</v-tab>
        <v-tab key="archive">Import</v-tab>
      </v-tabs>
      <validation-observer
        ref="form"
        @submit.prevent="$refs.form.handleSubmit(submit)"
        tag="form"
        novalidate
        class="pt-10 pa-4">
        <v-alert
          @click:close="serverError = null"
          :value="!!serverError"
          color="error"
          icon="mdi-alert"
          dark dismissible
          class="mb-12">
          {{ serverError }}
        </v-alert>
        <v-tabs-items v-model="selectedTab">
          <v-tab-item key="schema">
            <validation-provider
              v-slot="{ errors }"
              :rules="{ required: isCreate }"
              name="schema">
              <v-select
                v-model="repository.schema"
                :items="schemas"
                :error-messages="errors"
                item-value="id"
                item-text="name"
                label="Schema"
                outlined />
            </validation-provider>
          </v-tab-item>
          <v-tab-item key="archive">
            <validation-provider
              v-slot="{ errors }"
              :rules="{ required: !isCreate }"
              name="archive"
              mode="lazy">
              <v-file-input
                v-model="archive"
                :error-messages="errors"
                :clearable="false"
                label="Archive"
                prepend-icon=""
                prepend-inner-icon="mdi-paperclip"
                placeholder="Select repository archive"
                outlined />
            </validation-provider>
          </v-tab-item>
        </v-tabs-items>
        <validation-provider
          v-slot="{ errors }"
          name="name"
          rules="required|min:2|max:250">
          <v-text-field
            v-model.trim="repository.name"
            :error-messages="errors"
            name="repositoryName"
            label="Name"
            placeholder="Enter name..."
            outlined />
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="description"
          rules="required|min:2|max:2000">
          <v-textarea
            v-model.trim="repository.description"
            :error-messages="errors"
            label="Description"
            placeholder="Enter description..."
            outlined />
        </validation-provider>
        <div class="d-flex justify-end">
          <v-btn @click="hide" :disabled="showLoader" text>Cancel</v-btn>
          <v-btn
            :loading="showLoader"
            type="submit"
            color="blue-grey darken-4"
            text
            class="px-1">
            Create
          </v-btn>
        </div>
      </validation-observer>
    </template>
  </tailor-dialog>
</template>

<script>
import api from '@/api/repository';
import { mapGetters } from 'vuex';
import { SCHEMAS } from 'shared/activities';
import TailorDialog from '@/components/common/TailorDialog';

const NEW_TAB = 0;

const resetData = () => ({
  schema: SCHEMAS[0].id,
  name: null,
  description: null
});

export default {
  name: 'create-repository',
  data: () => ({
    repository: resetData(),
    archive: null,
    selectedTab: NEW_TAB,
    isVisible: false,
    showLoader: false,
    serverError: ''
  }),
  computed: {
    ...mapGetters(['isAdmin']),
    isCreate: vm => vm.selectedTab === NEW_TAB,
    schemas: () => SCHEMAS
  },
  methods: {
    async submit() {
      this.showLoader = true;
      const action = this.isCreate ? 'create' : 'import';
      return this[action]()
        .then(() => this.$emit('done') && this.hide())
        .catch(() => (this.serverError = 'An error has occurred!'))
        .finally(() => (this.showLoader = false));
    },
    create() {
      return api.save(this.repository);
    },
    import() {
      const { archive, repository } = this;
      const form = new FormData();
      form.append('archive', archive);
      form.append('name', repository.name);
      form.append('description', repository.description);
      const headers = { 'content-type': 'multipart/form-data' };
      return api.importRepository(form, { headers });
    },
    hide() {
      this.showLoader = false;
      this.isVisible = false;
      this.archive = null;
      this.serverError = '';
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