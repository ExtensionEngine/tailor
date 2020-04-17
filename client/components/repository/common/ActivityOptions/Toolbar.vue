<template>
  <div class="activity-options-container">
    <v-tooltip
      v-for="it in options"
      :key="it.name"
      bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          @click="it.action()"
          color="blue-grey darken-4"
          icon
          class="mr-1">
          <v-icon>mdi-{{ it.icon }}</v-icon>
        </v-btn>
      </template>
      <span>{{ it.name }}</span>
    </v-tooltip>
    <create-dialog
      v-if="showCreateDialog"
      @close="showCreateDialog = null"
      @created="expandParent"
      :repository-id="activity.repositoryId"
      :levels="supportedLevels"
      :anchor="activity"
      :heading="`
        Add ${isEqual(supportedLevels, subLevels) ? 'into' : 'below'}
        ${activity.data.name}`" />
  </div>
</template>

<script>
import CreateDialog from '@/components/repository/common/CreateDialog';
import helperMixin from './common';
import isEqual from 'lodash/isEqual';

const getOptions = vm => {
  const items = [{
    name: 'Add item below',
    icon: 'arrow-down',
    action: () => vm.setCreateContext(vm.sameLevel)
  }];
  if (vm.subLevels.length) {
    items.push({
      name: 'Add item into',
      icon: 'subdirectory-arrow-right',
      action: () => vm.setCreateContext(vm.subLevels)
    });
  }
  if (vm.isEditable) {
    const { id: activityId } = vm.activity;
    items.push({
      name: 'Open',
      icon: 'open-in-app',
      action: () => vm.$router.push({ name: 'editor', params: { activityId } })
    });
  }
  return items;
};

export default {
  name: 'activity-options-toolbar',
  mixins: [helperMixin],
  props: {
    activity: { type: Object, required: true }
  },
  data: () => ({
    showCreateDialog: false,
    supportedLevels: []
  }),
  computed: {
    options: vm => getOptions(vm)
  },
  methods: {
    isEqual,
    setCreateContext(levels) {
      this.supportedLevels = levels;
      this.showCreateDialog = true;
    }
  },
  components: { CreateDialog }
};
</script>
