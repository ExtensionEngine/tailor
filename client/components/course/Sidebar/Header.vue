<template>
  <div class="header">
    <div class="pull-right">
      <v-btn
        @click="deleteActivity"
        color="blue-grey darken-1"
        text
        icon
        class="btn-delete">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </div>
    <v-btn
      v-show="isEditable"
      @click.stop="edit"
      color="primary"
      fab
      dark
      class="btn-edit">
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import EventBus from 'EventBus';
import filter from 'lodash/filter';
import find from 'lodash/find';
import first from 'lodash/first';
import get from 'lodash/get';
import { isEditable } from 'shared/activities';
import sortBy from 'lodash/sortBy';

const appChannel = EventBus.channel('app');
const TREE_VIEW_ROUTE = 'tree-view';

export default {
  computed: {
    ...mapGetters('course', ['activity', 'activities']),
    isEditable() {
      const type = get(this.activity, 'type');
      return type && isEditable(type);
    }
  },
  methods: {
    ...mapActions('activities', ['remove']),
    ...mapMutations('course', ['focusActivity']),
    edit() {
      if (!this.isEditable) return;
      this.$router.push({
        name: 'editor',
        params: { activityId: this.activity.id }
      });
    },
    deleteActivity() {
      const { activity, $route: { name: routeName } } = this;
      const isTreeView = routeName === TREE_VIEW_ROUTE;
      const name = `${isTreeView ? `${activity.id}: ` : ''}${activity.data.name}`;
      appChannel.emit('showConfirmationModal', {
        title: 'Delete activity?',
        message: `Are you sure you want to delete activity ${name}?`,
        action: () => {
          const { parentId } = this.activity;
          const rootFilter = it => !it.parentId && (it.id !== this.activity.id);
          // Focus parent or first root node
          const focusNode = parentId
            ? find(this.activities, { id: parentId })
            : first(sortBy(filter(this.activities, rootFilter), 'position'));
          this.remove(this.activity);
          if (focusNode) this.focusActivity(focusNode._cid);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  min-height: 86px;
  margin-bottom: 60px;
  padding: 15px 10px;
  background-color: #eee;

  .btn-edit {
    position: absolute;
    bottom: -30px;
    left: 30px;
  }

  .btn-delete {
    margin: 0 10px 0 0;
  }
}
</style>
