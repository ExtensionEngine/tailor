<template>
  <v-dialog v-model="visible" width="500">
    <form @submit.prevent="create">
      <v-card>
        <v-card-title
          primary-title
          class="py-4 heading primary darken-1 white--text">
          <v-avatar size="38" color="secondary" class="mr-3">
            <v-icon dark>mdi-folder-plus-outline</v-icon>
          </v-avatar>
          Create
        </v-card-title>
        <v-card-text class="pt-8">
          <type-select v-model="activity.type" :options="levels" />
          <template v-if="activity.type">
            <meta-input
              v-for="input in metadata"
              :key="input.key"
              @update="setMetaValue"
              :meta="input" />
          </template>
        </v-card-text>
        <v-card-actions class="px-4 py-3">
          <v-spacer />
          <v-btn @click="visible = false" text>Cancel</v-btn>
          <v-btn color="primary" type="submit" text>Create</v-btn>
        </v-card-actions>
      </v-card>
    </form>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { isSameLevel } from 'utils/activity';
import MetaInput from 'components/common/Meta';
import TypeSelect from './TypeSelect';
import { withValidation } from 'utils/validation';

const initActivityState = repositoryId => ({ repositoryId, type: null, data: {} });

export default {
  name: 'create-activity-dialog',
  mixins: [withValidation()],
  props: {
    repositoryId: { type: Number, required: true },
    levels: { type: Array, required: true },
    anchor: { type: Object, default: null }
  },
  data() {
    return {
      visible: true,
      activity: initActivityState(this.repositoryId)
    };
  },
  computed: {
    ...mapGetters('course', ['getMetadata']),
    ...mapGetters('activities', ['calculateInsertPosition']),
    metadata() {
      if (!this.activity.type) return null;
      return this.getMetadata({ type: this.activity.type });
    }
  },
  methods: {
    ...mapActions('activities', ['save']),
    setMetaValue(key, val) {
      this.activity.data[key] = val;
    },
    async create() {
      const isValid = await this.$validator.validateAll();
      if (!isValid) return;
      const { activity, anchor } = this;
      activity.parentId = isSameLevel(activity, anchor) ? anchor.parentId : anchor.id;
      activity.position = this.calculateInsertPosition(activity, anchor);
      this.save({ ...activity });
      if (anchor.id === activity.parentId) this.$emit('expand');
      this.visible = false;
    }
  },
  watch: {
    visible(val) {
      if (!val) this.$emit('close');
    }
  },
  components: { MetaInput, TypeSelect }
};
</script>
