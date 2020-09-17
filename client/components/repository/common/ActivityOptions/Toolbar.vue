<template>
  <div class="activity-options-container">
    <v-tooltip
      v-for="it in options"
      :key="it.name"
      bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          @click.stop="it.action()"
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
      :action="action"
      :heading="`${createDialogHeading} ${activity.data.name}`" />
  </div>
</template>

<script>
import CreateDialog from '@/components/repository/common/CreateDialog';
import insertActions from '@/utils/insertActions';
import isEqual from 'lodash/isEqual';
import optionsMixin from './common';

const { ADD_AFTER, ADD_BEFORE, ADD_INTO } = insertActions;

const getOptions = vm => {
  const items = [{
    name: 'Add item above',
    icon: 'arrow-up',
    action: () => vm.setCreateContext(vm.sameLevel, ADD_BEFORE)
  }, {
    name: 'Add item below',
    icon: 'arrow-down',
    action: () => vm.setCreateContext(vm.sameLevel, ADD_AFTER)
  }];
  if (vm.subLevels.length) {
    items.push({
      name: 'Add item into',
      icon: 'subdirectory-arrow-right',
      action: () => vm.setCreateContext(vm.subLevels, ADD_INTO)
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
  mixins: [optionsMixin],
  props: {
    activity: { type: Object, required: true }
  },
  data: () => ({
    showCreateDialog: false,
    supportedLevels: [],
    action: null
  }),
  computed: {
    options: vm => getOptions(vm)
  },
  methods: {
    isEqual,
    setCreateContext(levels, action = null) {
      this.supportedLevels = levels;
      this.showCreateDialog = true;
      this.action = action;
    }
  },
  components: { CreateDialog }
};
</script>
