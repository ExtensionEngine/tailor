<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-4 col-lg-3">
        <ul class="list-group">
          <li
            :class="{ selected: $route.name === 'course-info' }"
            @click="routeTo('course-info')"
            class="list-group-item">
            <v-icon>mdi-wrench</v-icon>General
          </li>
          <li
            :class="{ selected: $route.name === 'user-management' }"
            @click="routeTo('user-management')"
            class="list-group-item">
            <v-icon>mdi-account</v-icon>User Management
          </li>
        </ul>
        <div class="actions">
          <v-btn
            @click="downloadContentInventory"
            color="blue-grey darken-3"
            flat
            block>
            <v-icon>mdi-download</v-icon>
            Knewton Inventory
          </v-btn>
          <v-btn
            @click="showCloneModal = true"
            color="blue-grey darken-3"
            flat
            block>
            <v-icon>mdi-content-copy</v-icon>Clone repository
          </v-btn>
          <v-btn
            :loading="isPublishing"
            @click="confirmPublishing(outlineActivities)"
            color="blue-grey darken-3"
            flat
            block>
            <v-icon>mdi-upload</v-icon>Publish content
          </v-btn>
          <v-btn
            @click.stop="showDeleteConfirmation"
            color="error"
            flat
            block>
            <v-icon>mdi-delete</v-icon>
            Delete repository
          </v-btn>
        </div>
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
import api from '../../../api/course';
import CloneModal from './CloneModal';
import EventBus from 'EventBus';
import General from './General';
import JSZip from 'jszip';
import { mapActions, mapGetters } from 'vuex-module';
import saveAs from 'save-as';
import publishMixin from 'components/common/mixins/publish';
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
    }
  },
  components: {
    CloneModal,
    General,
    UserManagement
  }
};
</script>

<style lang="scss" scoped>
.row {
  margin: 60px 30px 5px;
}

.list-group {
  padding: 10px 10px 350px;
  line-height: 32px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.list-group-item {
  margin-bottom: 2px;
  padding: 4px;
  color: #444;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  font-weight: 500;
  text-align: left;
  text-transform: uppercase;
  border: 0;
  cursor: pointer;

  &.selected {
    background-color: #efefef;
  }
}

.mdi {
  margin-right: 13%;
  margin-left: 5%;
  font-size: 20px;
}

.actions {
  position: absolute;
  right: 15px;
  bottom: 20px;
  left: 15px;
  padding: 10px;
}

.v-btn {
  margin: 15px 0;

  /deep/ div {
    justify-content: left;
  }
}
</style>
