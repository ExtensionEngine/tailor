<template>
  <tailor-dialog
    v-if="isAdmin"
    v-model="isVisible"
    header-icon="mdi-pound-box-outline">
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        @click.stop="on"
        icon>
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
        v-model="value"
        :items="items"
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
        :loading="showLoader"
        color="primary"
        text>
        Create
      </v-btn>
    </template>
  </tailor-dialog>
</template>

<script>
import loadTagsApi from '@/api/tag';
import { mapGetters } from 'vuex';
import tagApi from '@/api/course';
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
    showLoader: false,
    items: null,
    values: [],
    value: null
  }),
  computed: {
    ...mapGetters(['isAdmin'])
  },
  methods: {
    hide() {
      this.isVisible = false;
    },
    loadTags() {
      return loadTagsApi.getTags()
        .then(tags => {
          this.items = tags;
          this.value = this.repository.tags;
        });
    },
    submit() {
      return tagApi.addTag(this.repository.id, this.value)
        .then(result => (console.log('OVO JE NEKI REZULTAT', result)));
    }
  },
  watch: {
    isVisible(val) {
      if (!val) return;
      setTimeout(() => {
        this.$validator.reset();
        this.loadTags();
      }, 60);
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
