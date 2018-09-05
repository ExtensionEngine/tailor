<template>
  <div class="header">
    <div class="pull-right">
      <div @click="deleteActivity" class="btn-delete">
        <span class="mdi mdi-delete"></span>
      </div>
    </div>
    <button v-show="isEditable" @click.stop="edit" class="btn btn-fab btn-primary">
      <span class="mdi mdi-pencil"></span>
    </button>
    <div v-if="isEditable" class="pull-right">
      <active-editors
        :courseId="this.course.id"
        :activityId="this.activity.id">
      </active-editors>
    </div>
  </div>
</template>

<script>
import ActiveEditors from 'components/common/ActiveEditors';
import EventBus from 'EventBus';
import filter from 'lodash/filter';
import find from 'lodash/find';
import first from 'lodash/first';
import get from 'lodash/get';
import { isEditable } from 'shared/activities';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import sortBy from 'lodash/sortBy';

const appChannel = EventBus.channel('app');

export default {
  computed: {
    ...mapGetters(['activity', 'activities', 'course'], 'course'),
    isEditable() {
      const type = get(this.activity, 'type');
      return type && isEditable(type);
    }
  },
  methods: {
    ...mapActions(['remove'], 'activities'),
    ...mapMutations(['focusActivity'], 'course'),
    edit() {
      if (!this.isEditable) return;
      this.$router.push({
        name: 'editor',
        params: { activityId: this.activity.id }
      });
    },
    deleteActivity() {
      appChannel.emit('showConfirmationModal', {
        type: 'activity',
        item: this.activity,
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
  },
  components: {
    ActiveEditors
  }
};
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  min-height: 70px;
  margin-bottom: 60px;
  padding: 15px 10px;
  background-color: #eee;

  .btn-fab {
    position: absolute;
    bottom: -22px;
    left: 30px;
    padding: 6px;
    color: #fff;
    font-size: 23px;
  }

  .btn-delete {
    padding: 0 20px;
    color: #777;
    font-size: 20px;
    cursor: pointer;

    &:hover {
      color: #555;
    }
  }
}
</style>
