<template>
  <tailor-dialog
    v-model="isVisible"
    header-icon="mdi-tag-outline">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" icon small>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <template v-slot:header>Add Tag</template>
    <template v-slot:body>
      <v-alert
        :value="vErrors.has('default')"
        color="error"
        icon="mdi-alert-outline"
        outlined>
        {{ vErrors.first('default') }}
      </v-alert>
      <v-combobox
        v-validate="'required|min:2|max:20|unique-tag-name'"
        @keyup.enter="submit"
        @change="it => tagInput = it"
        :value="tagInput"
        :error-messages="vErrors.collect('name')"
        :items="availableTags"
        name="name"
        item-text="name"
        item-value="id"
        label="Select a tag or add a new one"
        outlined />
    </template>
    <template v-slot:actions>
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
import isObject from 'lodash/isObject';
import tagApi from '@/api/tag';
import TailorDialog from '@/components/common/TailorDialog';
import { withValidation } from 'utils/validation';

export default {
  name: 'add-tag',
  mixins: [withValidation()],
  props: {
    repository: { type: Object, required: true }
  },
  data: () => ({
    isVisible: false,
    tagInput: null
  }),
  computed: {
    ...mapState('repositories', ['tags']),
    assignedTags: vm => vm.repository.tags,
    availableTags: vm => differenceBy(vm.tags, vm.assignedTags, 'id')
  },
  methods: {
    ...mapActions('repositories', ['addTag', 'removeTag']),
    hide() {
      this.$validator.reset();
      this.tagInput = null;
      this.isVisible = false;
    },
    async submit() {
      const isValid = await this.$validator.validateAll();
      if (!isValid) return;
      const tagName = isObject(this.tagInput) ? this.tagInput.name : this.tagInput;
      const data = { name: tagName, repositoryId: this.repository.id };
      await this.addTag(data);
      this.hide();
    }
  },
  watch: {
    isVisible(val) {
      if (!val) return;
      this.$validator.reset();
    }
  },
  mounted() {
    if (!this.$validator.rules['unique-tag-name']) {
      this.$validator.extend('unique-tag-name', {
        getMessage: field => `Tag ${field} is not unique.`,
        async validate(tag) {
          const name = isObject(tag) ? tag.name : tag;
          const tagExists = await tagApi.fetch({ name });
          return ({ valid: isObject(tag) || !tagExists });
        }
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
