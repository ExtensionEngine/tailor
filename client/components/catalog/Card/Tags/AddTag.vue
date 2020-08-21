<template>
  <tailor-dialog
    @click:outside="$emit('close')"
    :value="true"
    header-icon="mdi-tag-outline">
    <template #header>Add Tag</template>
    <template #body>
      <validation-observer
        ref="form"
        @submit.prevent="$refs.form.handleSubmit(submit)"
        tag="form">
        <validation-provider
          v-slot="{ errors }"
          rules="required|min:2|max:20"
          name="name">
          <v-combobox
            v-model="tagInput"
            @keydown.enter="submit"
            :items="availableTags"
            :error-messages="errors"
            label="Select a tag or add a new one"
            outlined />
        </validation-provider>
        <div class="d-flex justify-end">
          <v-btn @click="hide" text>Cancel</v-btn>
          <v-btn type="submit" color="primary darken-2" text>
            Save
          </v-btn>
        </div>
      </validation-observer>
    </template>
  </tailor-dialog>
</template>

<script>
import api from '@/api/tag';
import differenceBy from 'lodash/differenceBy';
import map from 'lodash/map';
import { mapActions } from 'vuex';
import TailorDialog from '@/components/common/TailorDialog';

export default {
  name: 'add-tag',
  props: {
    repository: { type: Object, required: true }
  },
  data: () => ({ tagInput: '', tags: [] }),
  computed: {
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
        const data = { name: this.tagInput, repositoryId: this.repository.id };
        await this.addTag(data);
        this.hide();
      });
    }
  },
  created() {
    api.fetch().then(tags => (this.tags = tags));
  },
  components: { TailorDialog }
};
</script>

<style lang="scss" scoped>
::v-deep .v-list.v-sheet {
  text-align: left;
}
</style>
