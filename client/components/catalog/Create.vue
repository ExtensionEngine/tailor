<template>
  <tailor-dialog
    v-if="isAdmin"
    v-model="isVisible"
    header-icon="mdi-folder-plus-outline">
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        color="pink"
        fab dark absolute
        class="add-repo">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <template v-slot:header>New</template>
    <template v-slot:body>
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
        outlined
        class="mb-3" />
      <v-text-field
        v-model.trim="repository.name"
        v-validate="{ required: true, min: 2, max: 250 }"
        :error-messages="vErrors.collect('name')"
        label="Name"
        placeholder="Enter name..."
        data-vv-name="name"
        outlined />
      <v-textarea
        v-model.trim="repository.description"
        v-validate="{ required: true, min: 2, max: 2000 }"
        :error-messages="vErrors.collect('description')"
        label="Description"
        placeholder="Enter description..."
        data-vv-name="description"
        outlined />
    </template>
    <template v-slot:actions>
      <v-btn @click="hide" :disabled="showLoader" text>Cancel</v-btn>
      <v-btn
        @click="submit"
        :disabled="vErrors.any()"
        :loading="showLoader"
        color="primary"
        text>
        Create
      </v-btn>
    </template>
  </tailor-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Promise from 'bluebird';
import { SCHEMAS } from 'shared/activities';
import TailorDialog from '@/components/common/TailorDialog';
import { withValidation } from 'utils/validation';

const resetData = () => ({
  schema: SCHEMAS[0].id,
  name: null,
  description: null
});

export default {
  name: 'create-repository',
  mixins: [withValidation()],
  data: () => ({
    repository: resetData(),
    isVisible: false,
    showLoader: false
  }),
  computed: {
    ...mapGetters(['isAdmin']),
    schemas: () => SCHEMAS
  },
  methods: {
    ...mapActions('courses', ['save']),
    async submit() {
      const isValid = await this.$validator.validateAll();
      if (!isValid) return;
      this.showLoader = true;
      return Promise.join(this.save(this.repository), Promise.delay(1000))
        .then(() => this.hide())
        .catch(() => this.vErrors.add('default', 'An error has occurred!'));
    },
    hide() {
      this.repository = resetData();
      this.showLoader = false;
      this.isVisible = false;
    }
  },
  watch: {
    isVisible(val) {
      if (!val) return;
      setTimeout(() => this.$validator.reset(), 60);
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
