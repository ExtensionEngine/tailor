<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-4 col-lg-3">
        <v-card>
          <sidebar
            :isPublishing="isPublishing"
            @actionClick="onActionClick"/>
        </v-card>
      </div>
      <div class="col-md-8 col-lg-9">
        <router-view></router-view>
      </div>
    </div>
    <clone-modal
      :show="showCloneModal"
      @close="showCloneModal = false">
    </clone-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
import api from '../../../api/course';
import CloneModal from './CloneModal';
import EventBus from 'EventBus';
import General from './General';
import JSZip from 'jszip';
import publishMixin from 'components/common/mixins/publish';
import result from 'lodash/result';
import saveAs from 'save-as';
import Sidebar from './Sidebar';
import UserManagement from './UserManagement';

const appChannel = EventBus.channel('app');

export default {
  mixins: [publishMixin],
  data() {
    return {
      showCloneModal: false,
      ACTIONS: {
        knewton: this.downloadContentInventory,
        clone: () => (this.showCloneModal = true),
        publish: () => this.confirmPublishing(this.outlineActivities),
        delete: this.showDeleteConfirmation
      }
    };
  },
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapGetters(['course', 'outlineActivities'], 'course')
  },
  methods: {
    ...mapActions({ removeCourse: 'remove' }, 'courses'),
    ...mapActions({ publishActivity: 'publish' }, 'activities'),
    downloadContentInventory() {
      api.getContentInventory(this.$route.params.courseId)
        .then(response => JSZip.loadAsync(response))
        .then(zip => zip.generateAsync({ type: 'blob' }))
        .then(file => saveAs(file, 'Content Inventory.xlsx'));
    },
    showDeleteConfirmation() {
      appChannel.emit('showConfirmationModal', {
        title: 'Delete course?',
        message: `Are you sure you want to delete course ${this.course.name}?`,
        action: () => this.removeCourse(this.course) && this.$router.push('/')
      });
    },
    routeTo(name) {
      this.$router.push({ name });
    },
    onActionClick(name) {
      result(this.ACTIONS, name);
    }
  },
  components: {
    CloneModal,
    General,
    Sidebar,
    UserManagement
  }
};
</script>

<style lang="scss" scoped>
.row {
  margin: 60px 30px 5px;
}
</style>
