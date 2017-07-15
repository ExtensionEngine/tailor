<template>
  <div class="header">
    <div class="pull-right">
      <div @click="deleteActivity" class="btn-delete">
        <span class="mdi mdi-delete"></span>
      </div>
    </div>
    <div v-show="isEditable" @click.stop="edit" class="btn btn-fab btn-primary">
      <span class="mdi mdi-pencil"></span>
    </div>
  </div>
</template>

<script>
import EventBus from 'EventBus';
import { isEditable } from 'shared/activities';
import { mapActions, mapGetters } from 'vuex-module';

const appChannel = EventBus.channel('app');

export default {
  computed: {
    ...mapGetters(['activity'], 'course'),
    isEditable() {
      return isEditable(this.activity.type);
    },
    edit() {
      if (!this.isEditable) return;
      this.$router.push({
        name: 'editor',
        params: { activityId: this.activity.id }
      });
    }
  },
  methods: {
    ...mapActions(['remove'], 'activities'),
    deleteActivity() {
      appChannel.emit('showConfirmationModal', {
        type: 'activity',
        item: this.activity,
        action: () => this.remove(this.activity)
      });
    }
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
    left: 30px;
    bottom: -22px;
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
