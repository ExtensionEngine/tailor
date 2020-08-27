<template>
  <tailor-dialog
    v-model="visible"
    header-icon="mdi-folder-plus-outline">
    <template v-if="showActivator" v-slot:activator="{ on }">
      <v-btn v-on="on" :color="activatorColor" text class="px-1">
        <v-icon class="pr-1">{{ activatorIcon }}</v-icon>
        {{ activatorLabel || defaultLabel }}
      </v-btn>
    </template>
    <template v-slot:header>{{ heading || defaultLabel }}</template>
    <template v-slot:body>
      <validation-observer
        ref="form"
        @submit.prevent="$refs.form.handleSubmit(submit)"
        tag="form">
        <type-select
          v-model="activity.type"
          :options="levels"
          :disabled="hasSingleOption" />
        <meta-input
          v-for="input in metadata"
          :key="input.key"
          @update="setMetaValue"
          :meta="input" />
        <div class="d-flex justify-end">
          <v-btn @click="visible = false" text>Cancel</v-btn>
          <v-btn type="submit" color="blue-grey darken-4" text>
            Create
          </v-btn>
        </div>
      </validation-observer>
    </template>
  </tailor-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { getActivityMetadata } from 'shared/activities';
import MetaInput from 'tce-core/MetaInput';
import TailorDialog from '@/components/common/TailorDialog';
import TypeSelect from './TypeSelect';

const initActivityState = (repositoryId, levels) => ({
  repositoryId,
  type: levels.length > 1 ? null : levels[0].type,
  data: {}
});

export default {
  name: 'create-activity-dialog',
  props: {
    repositoryId: { type: Number, required: true },
    levels: { type: Array, required: true },
    anchor: { type: Object, default: null },
    addChild: { type: Boolean, default: false },
    heading: { type: String, default: '' },
    showActivator: { type: Boolean, default: false },
    activatorLabel: { type: String, default: '' },
    activatorColor: { type: String, default: 'grey darken-3' },
    activatorIcon: { type: String, default: 'mdi-folder-plus' }
  },
  data() {
    return {
      visible: false,
      activity: initActivityState(this.repositoryId, this.levels)
    };
  },
  computed: {
    ...mapGetters('repository/activities', ['calculateInsertPosition']),
    metadata() {
      if (!this.activity.type) return null;
      return getActivityMetadata(this.activity);
    },
    hasSingleOption: vm => vm.levels.length === 1,
    defaultLabel: vm => vm.hasSingleOption ? `Add ${vm.levels[0].label}` : 'Add'
  },
  methods: {
    ...mapActions('repository/activities', ['save']),
    setMetaValue(key, val) {
      this.activity.data[key] = val;
    },
    async submit() {
      const { activity, anchor } = this;
      if (anchor) {
        activity.parentId = this.addChild ? anchor.id : anchor.parentId;
      }
      activity.position = this.calculateInsertPosition(activity, anchor);
      const item = await this.save({ ...activity });
      if (anchor && (anchor.id === activity.parentId)) this.$emit('expand', anchor);
      this.$emit('created', item);
      this.visible = false;
      this.$router.push({ query: { activityId: item.id } });
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
