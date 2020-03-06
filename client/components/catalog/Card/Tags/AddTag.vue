<template>
  <tailor-dialog
    @click:outside="$emit('close')"
    :value="true"
    header-icon="mdi-tag-outline">
    <template #header>Add Tag</template>
    <template #body>
      <v-alert
        :value="vErrors.has('default')"
        color="error"
        icon="mdi-alert-outline"
        outlined>
        {{ vErrors.first('default') }}
      </v-alert>
      <v-combobox
        v-model="tagInput"
        v-validate="'required|min:2|max:20'"
        :items="availableTags"
        :error-messages="vErrors.collect('name')"
        name="name"
        label="Select a tag or add a new one"
        outlined />
    </template>
    <template #actions>
      <v-btn @click="hide" text>Cancel</v-btn>
      <v-btn @click="submit" :disabled="vErrors.any()" color="primary" text>
        Save
      </v-btn>
    </template>
  </tailor-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import differenceBy from 'lodash/differenceBy';
import map from 'lodash/map';
import TailorDialog from '@/components/common/TailorDialog';
import { withValidation } from 'utils/validation';

export default {
  name: 'add-tag',
  mixins: [withValidation()],
  props: {
    repository: { type: Object, required: true }
  },
  data: () => ({ tagInput: '' }),
  computed: {
    ...mapState('repositories', ['tags']),
    assignedTags: vm => vm.repository.tags,
    availableTags: vm => map(differenceBy(vm.tags, vm.assignedTags, 'id'), 'name')
  },
  methods: {
    ...mapActions('repositories', ['addTag']),
    hide() {
      this.$emit('close');
    },
    async submit() {
      // Temp timeout due to https://github.com/vuetifyjs/vuetify/issues/4679
      setTimeout(async () => {
        const isValid = await this.$validator.validateAll();
        if (!isValid) return;
        const data = { name: this.tagInput, repositoryId: this.repository.id };
        await this.addTag(data);
        this.hide();
      });
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
