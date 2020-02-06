<template>
  <tailor-dialog
    v-model="isVisible"
    header-icon="mdi-pound-box-outline">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" @click.stop="on" icon>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-col cols="12" sm="8" md="9">
        <v-sheet elevation="10" class="grey lighten-4 elevation-0">
          <v-chip-group
            v-if="tags.length"
            max="1"
            active-class="primary--text">
            <v-chip
              v-for="({ id, name }) in tags"
              :key="id"
              @click.stop="deleteTag(id)">
              {{ name }}
            </v-chip>
          </v-chip-group>
        </v-sheet>
      </v-col>
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
        :items="tags"
        item-text="name"
        item-value="id"
        label="Select a tag or create a new one"
        multiple />
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
import EventBus from 'EventBus';
import isObject from 'lodash/isObject';
import TailorDialog from '@/components/common/TailorDialog';
import { withValidation } from 'utils/validation';

const appChannel = EventBus.channel('app');

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
  computed: mapState('repositories', {
    tags: state => state.tags
  }),
  methods: {
    ...mapActions('repositories', ['fetchTags', 'saveTags', 'removeTag']),
    hide() {
      this.newTag = null;
      this.isVisible = false;
    },
    submit() {
      const tagName = isObject(this.newTag[0]) ? this.newTag[0].name : this.newTag[0];
      const data = { repositoryId: this.repository.id, name: tagName, type: 'REPOSITORY' };
      return this.saveTags(data)
        .then(result => {
          this.newTag = null;
          this.isVisible = false;
        });
    },
    deleteTag(id) {
      const data = { repositoryId: this.repository.id, tagId: id };
      appChannel.emit('showConfirmationModal', {
        title: 'Delete tag',
        message: 'Are you sure you want to delete tag?',
        action: () => this.removeTag(data)
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
