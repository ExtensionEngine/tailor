<template>
  <transition name="slide-fade">
    <div class="revisions">
      <loader v-if="showLoader" class="loader"></loader>
      <div v-else class="content">
        <teaching-element
          v-if="selectedRevision"
          :element="selectedRevision.state"
          :disabled="true"
          class="preview">
        </teaching-element>
        <entity-sidebar
          :revisions="revisions"
          :selected="selectedRevision"
          :isDetached="isDetached"
          @preview="revision => previewRevision(revision)"
          @rollback="revision => rollback(revision)"
          ref="sidebar">
        </entity-sidebar>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from 'client/api/request';
import EntitySidebar from './EntitySidebar';
import findIndex from 'lodash/findIndex';
import includes from 'lodash/includes';
import Loader from 'components/common/Loader';
import { mapActions } from 'vuex-module';
import Promise from 'bluebird';
import TeachingElement from 'components/editor/teaching-elements';

const withoutStatics = ['HTML', 'VIDEO', 'EMBED', 'BREAK'];

export default {
  name: 'entity-revisions',
  props: ['revision', 'isDetached'],
  data() {
    return {
      revisions: [],
      selectedRevision: {},
      showLoader: true
    };
  },
  computed: {
    courseId() {
      return Number(this.$route.params.courseId);
    },
    baseUrl() {
      return `/courses/${this.courseId}/revisions/`;
    }
  },
  methods: {
    ...mapActions(['save'], 'tes'),
    getRevisions() {
      const params = { entityId: this.revision.state.id };
      return axios.get(this.baseUrl, { params });
    },
    previewRevision(revision) {
      if (revision.isResolving) return;
      if (revision.resolved || includes(withoutStatics, revision.state.type)) {
        this.selectedRevision = revision;
        this.showLoader = false;
        return;
      }
      const index = findIndex(this.revisions, { id: revision.id });
      this.revisions.splice(index, 1, { ...revision, isResolving: true });
      const resolveStatics = axios.get(`${this.baseUrl}${revision.id}`);
      Promise.join(resolveStatics, Promise.delay(1000)).then(([response]) => {
        const revision = { ...response.data, isResolving: false, resolved: true };
        this.revisions.splice(index, 1, revision);
        this.selectedRevision = revision;
        this.showLoader = false;
      });
    },
    rollback(revision) {
      this.save(revision.state)
        .then(this.getRevisions)
        .then(response => {
          this.$refs.sidebar.scrollTop();
          const revision = response.data[0];
          this.revisions.splice(0, 0, revision);
          this.selectedRevision = revision;
        });
    }
  },
  mounted() {
    Promise.join(this.getRevisions(), Promise.delay(700)).then(([response]) => {
      this.revisions = response.data;
      this.previewRevision(this.revision);
    });
  },
  components: { EntitySidebar, Loader, TeachingElement }
};
</script>

<style lang="scss" scoped>
.revisions {
  padding: 32px 8px;

  .loader {
    margin: 32px 0;
    text-align: center;
  }

  .content {
    display: flex;
  }

  .preview {
    flex-grow: 1;
    margin-right: 16px;
    text-align: center;
  }
}

.slide-fade-enter-active, .slide-fade-leave-active {
  overflow: hidden;
  margin-top: 0;
  margin-bottom: 0;
  transition: all 350ms cubic-bezier(0.165, 0.84, 0.44, 1); // "easeOutQuart"
}

.slide-fade-enter, .slide-fade-leave-to {
  height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
