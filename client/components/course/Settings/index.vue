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
import AppFooter from '@/components/common/Footer';
import CloneModal from './CloneModal';
import EventBus from 'EventBus';
import ProgressDialog from '@/components/common/ProgressDialog';
import publishMixin from '@/components/common/mixins/publish';
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
    ...mapGetters('course', ['course', 'outlineActivities', 'isCourseAdmin']),
    publishPercentage: ({ publishStatus }) => publishStatus.progress * 100
  },
  methods: {
    ...mapActions('courses', { removeCourse: 'remove' }),
    ...mapActions('activities', { publishActivity: 'publish' }),
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
        delete: this.showDeleteConfirmation
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
    AppFooter,
    CloneModal,
    ProgressDialog,
    Sidebar
  }
};
</script>
