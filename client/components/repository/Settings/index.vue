<template>
  <v-container class="my-4">
    <v-row align="start">
      <v-col cols="3">
        <sidebar @action="onActionClick" />
      </v-col>
      <v-col cols="9">
        <router-view />
      </v-col>
    </v-row>
    <export-modal
      v-if="showExportModal"
      @close="showExportModal = false" />
    <clone-modal
      v-if="showCloneModal"
      @close="showCloneModal = false" />
    <progress-dialog :show="isPublishing" :status="publishPercentage" />
    <app-footer />
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import AppFooter from '@/components/common/Footer';
import CloneModal from './CloneModal';
import EventBus from 'EventBus';
import ExportModal from './ExportModal';
import ProgressDialog from '@/components/common/ProgressDialog';
import publishMixin from '@/components/common/mixins/publish';
import Sidebar from './Sidebar';

const appChannel = EventBus.channel('app');

export default {
  mixins: [publishMixin],
  data: () => ({
    showCloneModal: false,
    showExportModal: false
  }),
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapGetters('repository',
      ['repository', 'outlineActivities', 'isRepositoryAdmin']),
    publishPercentage: ({ publishStatus }) => publishStatus.progress * 100
  },
  methods: {
    ...mapActions('repositories', { removeRepository: 'remove' }),
    ...mapActions('repository/activities', { publishActivity: 'publish' }),
    showDeleteConfirmation() {
      appChannel.emit('showConfirmationModal', {
        title: 'Delete repository?',
        message: `Are you sure you want to delete repository ${this.repository.name}?`,
        action: async () => {
          await this.removeRepository(this.repository);
          this.$router.push('/');
        }
      });
    },
    onActionClick(name) {
      const actions = {
        publish: this.publishRepository,
        clone: this.clone,
        export: this.export,
        delete: this.showDeleteConfirmation
      };
      actions[name]();
    },
    publishRepository() {
      this.confirmPublishing(this.outlineActivities);
    },
    clone() {
      this.showCloneModal = true;
    },
    export() {
      this.showExportModal = true;
    }
  },
  created() {
    if (this.isAdmin || this.isRepositoryAdmin) return;
    this.$router.push({ name: 'repository' });
  },
  components: {
    AppFooter,
    CloneModal,
    ExportModal,
    ProgressDialog,
    Sidebar
  }
};
</script>
