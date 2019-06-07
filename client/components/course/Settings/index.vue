<template>
  <v-container class="mt-4">
    <v-layout row align-start>
      <v-card>
        <sidebar
          :isPublishing="isPublishing"
          @action="onActionClick"/>
      </v-card>
      <v-flex ml-4>
        <router-view></router-view>
      </v-flex>
    </v-layout>
    <clone-modal
      :show="showCloneModal"
      @close="showCloneModal = false">
    </clone-modal>
    <progress-dialog :show="isPublishing" :status="publishPercentage"/>
    <v-footer height="52" color="primary" absolute>
      <v-layout row justify-center>
        <v-flex
          xs-12
          class="body-2 grey--text text--lighten-4 py-2">
          <v-chip
            color="grey lighten-4"
            label
            small
            class="mr-3 grey--text text--darken-4">
            v3.1 Silk
          </v-chip>
          Built with <v-icon color="pink">mdi-heart</v-icon>
          ExtnsnEngine
        </v-flex>
      </v-layout>
    </v-footer>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
import api from '../../../api/course';
import CloneModal from './CloneModal';
import EventBus from 'EventBus';
import General from './General';
import JSZip from 'jszip';
import ProgressDialog from '@/components/common/ProgressDialog';
import publishMixin from 'components/common/mixins/publish';
import saveAs from 'save-as';
import Sidebar from './Sidebar';
import UserManagement from './UserManagement';

const appChannel = EventBus.channel('app');

export default {
  mixins: [publishMixin],
  data() {
    return {
      showCloneModal: false
    };
  },
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapGetters(['course', 'outlineActivities', 'isCourseAdmin'], 'course'),
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
  created() {
    if (this.isAdmin || this.isCourseAdmin) return;
    this.$router.push({ name: 'course' });
  },
  components: {
    CloneModal,
    General,
    ProgressDialog,
    Sidebar,
    UserManagement
  }
};
</script>
