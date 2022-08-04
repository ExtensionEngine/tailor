<template>
  <tailor-dialog
    v-model="visible"
    :data-testid="`${testIdPrefix}Dialog`"
    header-icon="mdi-folder-plus-outline">
    <template v-if="showActivator" #activator="{ on }">
      <v-btn
        v-on="on"
        :color="activatorColor"
        :data-testid="`${testIdPrefix}Btn`"
        text
        class="px-1">
        <v-icon class="pr-1">{{ activatorIcon }}</v-icon>
        {{ activatorLabel || defaultLabel }}
      </v-btn>
    </template>
    <template #header>{{ heading || defaultLabel }}</template>
    <template #body>
      <validation-observer
        :key="visible"
        ref="form"
        @submit.prevent="$refs.form.handleSubmit(submit)"
        tag="form"
        class="activity-form">
        <type-select
          :key="visible"
          v-model="activity.type"
          :options="levels"
          :disabled="hasSingleOption" />
        <v-alert
          v-if="!metadata"
          color="primary"
          icon="mdi-information"
          text prominent
          class="my-3">
          Please select the item type you want to add
        </v-alert>
        <meta-input
          v-for="input in metadata"
          :key="input.key"
          @update="setMetaValue"
          :meta="input" />
        <v-spacer />
        <div class="d-flex justify-end pt-5 pb-3">
          <v-btn @click="visible = false" text>Cancel</v-btn>
          <v-btn
            :disabled="submitting"
            :loading="submitting"
            type="submit"
            color="primary darken-4"
            text>
            Create
          </v-btn>
        </div>
      </validation-observer>
    </template>
  </tailor-dialog>
</template>

<script>
import { InsertLocation } from '@tailor-cms/utils';
import { mapActions } from 'vuex';
import MetaInput from '@/components/common/MetaInput';
import TailorDialog from '@/components/common/TailorDialog';
import TypeSelect from './TypeSelect';

const initActivityState = (repositoryId, levels) => ({
  repositoryId,
  type: levels.length > 1 ? null : levels[0].type,
  data: {}
});
const { ADD_AFTER, ADD_INTO } = InsertLocation;

export default {
  name: 'create-activity-dialog',
  inject: ['$schemaService'],
  props: {
    repositoryId: { type: Number, required: true },
    levels: { type: Array, required: true },
    anchor: { type: Object, default: null },
    action: { type: String, default: ADD_AFTER },
    heading: { type: String, default: '' },
    showActivator: { type: Boolean, default: false },
    activatorLabel: { type: String, default: '' },
    activatorColor: { type: String, default: 'grey darken-3' },
    activatorIcon: { type: String, default: 'mdi-folder-plus' },
    testIdPrefix: { type: String, default: 'repository__createActivity' }
  },
  data() {
    return {
      visible: false,
      submitting: false,
      activity: initActivityState(this.repositoryId, this.levels)
    };
  },
  computed: {
    metadata() {
      if (!this.activity.type) return null;
      return this.$schemaService.getActivityMetadata(this.activity);
    },
    hasSingleOption: vm => vm.levels.length === 1,
    defaultLabel: vm => vm.hasSingleOption ? `Add ${vm.levels[0].label}` : 'Add'
  },
  methods: {
    ...mapActions('repository/activities', ['save', 'calculateInsertPosition']),
    setMetaValue(key, val) {
      this.activity.data[key] = val;
    },
    async submit() {
      this.submitting = true;
      const { activity, anchor, action } = this;
      if (anchor) {
        activity.parentId = action === ADD_INTO ? anchor.id : anchor.parentId;
      }
      activity.position = await this.calculateInsertPosition({ activity, anchor, action });
      try {
        const item = await this.save({ ...activity });
        if (anchor && (anchor.id === activity.parentId)) this.$emit('expand', anchor);
        this.$emit('created', item);
        this.visible = false;
        this.$router.push({ query: { activityId: item.id } });
      } finally {
        this.submitting = false;
      }
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

<style lang="scss" scoped>
.activity-form {
  display: flex;
  flex-direction: column;
  min-height: 17rem;
  padding-top: 0.5rem;
}
</style>
