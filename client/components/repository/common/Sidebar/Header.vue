<template>
  <div class="header">
    <div class="options-container">
      <activity-options :activity="activity" class="float-right" />
    </div>
    <v-btn
      v-show="isEditable"
      @click.stop="edit"
      color="primary darken-1"
      text
      class="px-1 btn-open">
      <v-icon class="pr-1">mdi-open-in-app</v-icon>
      Open
    </v-btn>
    <create-dialog
      v-if="subLevels.length"
      :repository-id="activity.repositoryId"
      :levels="subLevels"
      :anchor="activity"
      :heading="`Add into ${activity.data.name}`"
      activator-label="Add into"
      activator-color="blue-grey darken-3"
      activator-icon="mdi-folder-plus-outline"
      add-child show-activator />
    <publishing
      v-if="isAdmin || isRepositoryAdmin"
      :activity="activity"
      :outline-activities="outlineActivities" />
  </div>
</template>

<script>
import ActivityOptions from '@/components/repository/common/ActivityOptions/Menu';
import CreateDialog from '@/components/repository/common/CreateDialog';
import get from 'lodash/get';
import { isEditable } from 'shared/activities';
import { mapGetters } from 'vuex';
import Publishing from './Publishing';

export default {
  name: 'activity-sidebar-header',
  props: {
    activity: { type: Object, required: true }
  },
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapGetters('repository',
      ['structure', 'outlineActivities', 'isRepositoryAdmin']),
    isEditable() {
      const type = get(this.activity, 'type');
      return type && isEditable(type);
    },
    subLevels() {
      const { activity, structure = [] } = this;
      if (!activity) return [];
      const config = structure.find(it => it.type === activity.type);
      const subLevels = get(config, 'subLevels', []);
      return structure.filter(it => subLevels.includes(it.type));
    }
  },
  methods: {
    edit() {
      if (!this.isEditable) return;
      this.$router.push({
        name: 'editor',
        params: { activityId: this.activity.id }
      });
    }
  },
  components: { ActivityOptions, CreateDialog, Publishing }
};
</script>

<style lang="scss" scoped>
.header {
  padding: 1rem;
}

.options-container {
  min-height: 1.5rem;
}

.btn-open {
  margin-right: 0.5rem;
}
</style>
