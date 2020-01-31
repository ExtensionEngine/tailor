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
      class="px-1">
      <v-icon class="pr-1">mdi-open-in-app</v-icon>
      Open
    </v-btn>
    <publishing v-if="isAdmin || isRepositoryAdmin" />
  </div>
</template>

<script>
import ActivityOptions from '@/components/repository/common/ActivityOptions';
import get from 'lodash/get';
import { isEditable } from 'shared/activities';
import { mapGetters } from 'vuex';
import Publishing from './Publishing';

export default {
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapGetters('repository', ['activity', 'isRepositoryAdmin']),
    isEditable() {
      const type = get(this.activity, 'type');
      return type && isEditable(type);
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
  padding: 1rem;
}

.options-container {
  min-height: 1.5rem;
}
</style>
