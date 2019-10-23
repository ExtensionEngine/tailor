<template>
  <v-container class="mt-4">
    <v-layout row align-start>
      <v-card>
        <sidebar @action="onActionClick" :is-publishing="isPublishing" />
      </v-card>
      <v-flex ml-4>
        <router-view />
      </v-flex>
    </v-layout>
    <clone-modal @close="showCloneModal = false" :show="showCloneModal" />
    <progress-dialog :show="isPublishing" :status="publishPercentage" />
    <app-footer />
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import api from '@/api/repository';
import AppFooter from '@/components/common/Footer';
import CloneModal from './CloneModal';
import EventBus from 'EventBus';
import JSZip from 'jszip';
import ProgressDialog from '@/components/common/ProgressDialog';
import publishMixin from '@/components/common/mixins/publish';
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
    ...mapGetters(['isAdmin']),
    ...mapGetters('repository', ['repository', 'outlineActivities', 'isRepositoryAdmin']),
    publishPercentage: ({ publishStatus }) => publishStatus.progress * 100
  },
  methods: {
    ...mapActions('repositories', { removeRepository: 'remove' }),
    ...mapActions('activities', { publishActivity: 'publish' }),
    downloadContentInventory() {
      api.getContentInventory(this.$route.params.repositoryId)
        .then(response => JSZip.loadAsync(response))
        .then(zip => zip.generateAsync({ type: 'blob' }))
        .then(file => saveAs(file, 'Content Inventory.xlsx'));
    },
    showDeleteConfirmation() {
      appChannel.emit('showConfirmationModal', {
        title: 'Delete repository?',
        message: `Are you sure you want to delete repository ${this.repository.name}?`,
        action: () => this.removeRepository(this.repository) && this.$router.push('/')
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
    if (this.isAdmin || this.isRepositoryAdmin) return;
    this.$router.push({ name: 'repository' });
  },
  components: {
    AppFooter,
    CloneModal,
    ProgressDialog,
    Sidebar
  }
};
</script>
