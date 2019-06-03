<template>
  <v-container class="mt-4">
    <v-layout row align-start>
      <v-card>
        <sidebar
          :isPublishing="isPublishing"
          @action="onActionClick"/>
      </v-card>
      <v-flex ml-4>
        <router-view/>
      </v-flex>
    </v-layout>
    <clone-modal
      :show="showCloneModal"
      @close="showCloneModal = false">
    </clone-modal>
    <progress-dialog :show="isPublishing" :status="publishPercentage"/>
    <app-footer/>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
import api from '@/api/course';
import AppFooter from '@/components/common/Footer';
import CloneModal from './CloneModal';
import CourseUserManagement from './CourseUserManagement';
import EventBus from 'EventBus';
import General from './General';
import JSZip from 'jszip';
import ProgressDialog from 'components/common/ProgressDialog';
import publishMixin from 'components/common/mixins/publish';
import saveAs from 'save-as';
import Sidebar from './Sidebar';

const appChannel = EventBus.channel('app');

export default {
  mixins: [publishMixin],
  data() {
    return {
      showCloneModal: false
    };
  },
  computed: {
    ...mapGetters(['course', 'outlineActivities'], 'course'),
    publishPercentage: ({ publishStatus }) => publishStatus.progress * 100
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
        title: 'Delete repository?',
        message: `Are you sure you want to delete repository ${this.course.name}?`,
        action: () => this.removeCourse(this.course) && this.$router.push('/')
      });
    },
    onActionClick(name) {
      const actions = {
        publish: this.publishRepository,
        clone: this.clone,
        delete: this.showDeleteConfirmation,
        knewton: this.downloadContentInventory
      };
      actions[name]();
    },
    publishRepository() {
      this.confirmPublishing(this.outlineActivities);
    },
    clone() {
      this.showCloneModal = true;
    }
  },
  components: {
    AppFooter,
    CloneModal,
    CourseUserManagement,
    General,
    ProgressDialog,
    Sidebar
  }
};
</script>
