<template>
  <tailor-dialog
    v-model="visible"
    header-icon="mdi-folder-plus-outline">
    <template v-if="showActivator" v-slot:activator="{ on }">
      <v-btn v-on="on" color="grey darken-3" text class="px-1">
        <v-icon class="pr-1">mdi-folder-plus</v-icon>
        Create {{ hasSingleOption ? levels[0].label : '' }}
      </v-btn>
    </template>
    <template v-slot:header>Create</template>
    <template v-slot:body>
      <type-select
        v-model="activity.type"
        :options="levels"
        :disabled="hasSingleOption" />
      <template v-if="activity.type && visible">
        <meta-input
          v-for="input in metadata"
          :key="input.key"
          @update="setMetaValue"
          :meta="input" />
      </template>
    </template>
    <template v-slot:actions>
      <v-btn @click="visible = false" text>Cancel</v-btn>
      <v-btn @click="create" color="primary" text>Create</v-btn>
    </template>
  </tailor-dialog>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { isSameLevel } from 'utils/activity';
import MetaInput from 'components/common/Meta';
import TailorDialog from '@/components/common/TailorDialog';
import TypeSelect from './TypeSelect';
import { withValidation } from 'utils/validation';

const initActivityState = (repositoryId, levels) => ({
  repositoryId,
  type: levels.length > 1 ? null : levels[0].type,
  data: {}
});

export default {
  name: 'create-activity-dialog',
  mixins: [withValidation()],
  props: {
    repositoryId: { type: Number, required: true },
    levels: { type: Array, required: true },
    anchor: { type: Object, default: null },
    showActivator: { type: Boolean, default: false }
  },
  data() {
    return {
      visible: false,
      activity: initActivityState(this.repositoryId, this.levels)
    };
  },
  computed: {
    ...mapGetters('repository', ['getMetadata']),
    ...mapGetters('activities', ['calculateInsertPosition']),
    hasSingleOption: vm => vm.levels.length === 1,
    metadata() {
      if (!this.activity.type) return null;
      return this.getMetadata({ type: this.activity.type });
    }
  },
  methods: {
    ...mapActions('activities', ['save']),
    ...mapMutations('repository', ['focusActivity']),
    setMetaValue(key, val) {
      this.activity.data[key] = val;
    },
    async create() {
      const isValid = await this.$validator.validateAll();
      if (!isValid) return;
      const { activity, anchor } = this;
      if (anchor) {
        activity.parentId = isSameLevel(activity, anchor)
          ? anchor.parentId
          : anchor.id;
      }
      activity.position = this.calculateInsertPosition(activity, anchor);
      const item = await this.save({ ...activity });
      if (anchor && (anchor.id === activity.parentId)) this.$emit('expand', anchor);
      this.$emit('created', item);
      this.focusActivity(item._cid);
      this.visible = false;
    }
  },
  watch: {
    visible(val) {
      if (val) return;
      this.$emit('close');
      this.activity = initActivityState(this.repositoryId, this.levels);
    }
  },
  mounted() {
    this.visible = !this.showActivator;
  },
  components: { MetaInput, TailorDialog, TypeSelect }
};
</script>
