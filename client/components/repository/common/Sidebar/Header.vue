<template>
  <div class="header">
    <div class="options-container">
      <activity-options :activity="activity" class="float-right" />
    </div>
    <v-btn
      v-show="isEditable"
      @click.stop="edit"
      color="primary darken-3"
      text
      class="px-1 btn-open">
      <v-icon class="mr-2">mdi-page-next-outline</v-icon>
      Open
    </v-btn>
    <publishing
      v-if="isAdmin || isRepositoryAdmin"
      :activity="activity"
      :outline-activities="outlineActivities" />
  </div>
</template>

<script>
import ActivityOptions from '@/components/repository/common/ActivityOptions/Menu.vue';
import get from 'lodash/get';
import { mapGetters } from 'vuex';
import Publishing from './Publishing.vue';

export default {
  name: 'activity-sidebar-header',
  inject: ['$schemaService'],
  props: {
    activity: { type: Object, required: true }
  },
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapGetters('repository', ['outlineActivities', 'isRepositoryAdmin']),
    isEditable() {
      const type = get(this.activity, 'type');
      return type && this.$schemaService.isEditable(type);
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
  components: { ActivityOptions, Publishing }
};
</script>

<style lang="scss" scoped>
.header {
  padding: 1rem 1rem 0;
}

.options-container {
  min-height: 1.5rem;
}

.btn-open {
  margin-right: 0.5rem;
}
</style>
