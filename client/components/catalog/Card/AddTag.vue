<template>
  <tailor-dialog
    v-model="isVisible"
    header-icon="mdi-pound-box-outline">
    <template v-slot:activator="{ on }">
      <v-btn v-show="!showAddTag" v-on="on" @click.stop="" icon>
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
        v-model="newTag"
        :items="availableTags"
        item-text="name"
        item-value="id"
        label="Select a tag or create a new one" />
    </template>
    <template v-slot:actions>
      <v-btn @click="hide" text>Cancel</v-btn>
      <v-btn
        @click="submit"
        :disabled="vErrors.any()"
        color="primary"
        text>
        Save
      </v-btn>
    </template>
  </tailor-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import filter from 'lodash/filter';
import TailorDialog from '@/components/common/TailorDialog';
import { withValidation } from 'utils/validation';

const TAG_LIMIT = 3;

export default {
  name: 'add-tag',
  mixins: [withValidation()],
  props: {
    repository: { type: Object, required: true }
  },
  data: () => ({
    isVisible: false,
    selectedTagIds: [],
    newTag: null,
    confirmationModal: { show: false }
  }),
  computed: {
    ...mapState('repositories', {
      tags: state => state.tags
    }),
    repositoryTags() {
      return this.repository.tags;
    },
    showAddTag() {
      return this.repositoryTags.length === TAG_LIMIT;
    },
    availableTags() {
      const existingTagIds = this.repositoryTags.map(it => it.id);
      return filter(this.tags, it => !existingTagIds.includes(it.id));
    }
  },
  methods: {
    ...mapActions('repositories', ['fetchTags', 'saveTags', 'removeTag']),
    hide() {
      this.newTag = null;
      this.isVisible = false;
    },
    submit() {
      const data = { ...this.newTag, repositoryId: this.repository.id, type: 'REPOSITORY' };
      return this.saveTags(data)
        .then(result => {
          this.newTag = null;
          this.isVisible = false;
        });
    }
  },
  watch: {
    isVisible(val) {
      if (!val) return;
      setTimeout(() => { this.$validator.reset(); }, 60);
    }
  },
  mounted() {
    this.fetchTags();
  },
  components: { TailorDialog }
};
</script>

<style lang="scss" scoped>
::v-deep .v-list.v-sheet {
  text-align: left;
}
</style>
