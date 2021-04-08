<template>
  <div v-if="repository" class="settings">
    <div class="actions">
      <v-btn
        @click="publish"
        :loading="publishing"
        text small
        class="float-right">
        <v-icon class="mr-2">mdi-cloud-upload-outline</v-icon>
        Publish info
      </v-btn>
    </div>
    <repository-name-field
      @change="updateKey('name', $event)"
      :value="repository.name "
      :repository-id="repositoryId"
      class="my-5" />
    <meta-input
      :key="descriptionMeta.key"
      @update="updateKey"
      :meta="descriptionMeta"
      class="meta-input" />
    <meta-input
      v-for="it in metadata"
      :key="it.key"
      @update="updateKey"
      :meta="it"
      class="meta-input" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import api from '@/api/repository';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import { getRepositoryMetadata } from 'shared/activities';
import Meta from 'tce-core/MetaInput';
import RepositoryNameField from '../common/RepositoryNameField';
import set from 'lodash/set';

export default {
  data: () => ({ publishing: false }),
  computed: {
    ...mapGetters('repository', ['repository']),
    repositoryId: vm => parseInt(vm.$route.params.repositoryId, 10),
    metadata: vm => getRepositoryMetadata(vm.repository),
    descriptionMeta: ({ repository }) => ({
      key: 'description',
      value: repository.description,
      type: 'TEXTAREA',
      label: 'Description',
      validate: { required: true, min: 2, max: 2000 }
    })
  },
  methods: {
    ...mapActions('repositories', ['update']),
    async updateKey(key, value) {
      if (find(this.metadata, { key })) key = `data.${key}`;
      const data = cloneDeep(this.repository);
      await this.update(set(data, key, value));
      this.$snackbar.show('Saved', { class: 'mb-12' });
    },
    async publish() {
      this.publishing = true;
      await api.publishRepositoryMeta(this.repositoryId);
      this.publishing = false;
    }
  },
  components: {
    MetaInput: Meta,
    RepositoryNameField
  }
};
</script>

<style lang="scss" scoped>
.settings {
  padding: 1.875rem;
  text-align: left;

  .meta-input {
    margin: 1.25rem 0;
  }
}

.actions {
  min-height: 2.25rem;

  .btn {
    padding: 0.5rem 0.75rem;
  }
}

.picker ::v-deep .actions {
  margin: 1.25rem 0 0;
  text-align: left;
}
</style>
