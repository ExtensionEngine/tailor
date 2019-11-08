<template>
  <transition name="slide-fade">
    <div class="revisions">
      <div class="preview">
        <teaching-element
          v-if="selectedRevision.resolved"
          :element="selectedRevision.state"
          :disabled="true" />
      </div>
      <entity-sidebar
        v-show="expanded"
        ref="sidebar"
        @preview="previewRevision"
        @rollback="rollback"
        :revisions="revisions"
        :selected="selectedRevision"
        :is-detached="isDetached" />
    </div>
  </transition>
</template>

<script>
import axios from 'client/api/request';
import EntitySidebar from './EntitySidebar';
import first from 'lodash/first';
import get from 'lodash/get';
import includes from 'lodash/includes';
import Promise from 'bluebird';
import TeachingElement from 'components/editor/TeachingElement';

const WITHOUT_STATICS = ['JODIT_HTML', 'BRIGHTCOVE_VIDEO', 'VIDEO', 'EMBED', 'BREAK', 'HTML'];

export default {
  name: 'entity-revisions',
  props: {
    revision: { type: Object, required: true },
    isDetached: { type: Boolean, default: false }
  },
  data() {
    return {
      expanded: false,
      revisions: [],
      selectedRevision: {}
    };
  },
  computed: {
    repositoryId: vm => vm.revision.repositoryId,
    baseUrl: vm => `/repositories/${vm.repositoryId}/revisions/`
  },
  methods: {
    getRevisions() {
      const { entity, state } = this.revision;
      const params = { entity, entityId: state.id };
      return axios.get(this.baseUrl, { params }).then(({ data: { data } }) => {
        data.forEach(it => {
          if (includes(WITHOUT_STATICS, it.state.type)) it.resolved = true;
        });
        return data;
      });
    },
    previewRevision(revision) {
      if (get(this.selectedRevision, 'id') === revision.id) return;
      this.selectedRevision = revision;
      if (revision.resolved) return;
      this.$set(revision, 'loading', true);
      return axios.get(`${this.baseUrl}${revision.id}`).then(({ data }) => {
        Object.assign(revision, { ...data, resolved: true });
        this.$set(this.selectedRevision, revision);
        return Promise.delay(600);
      }).then(() => this.$set(revision, 'loading', false));
    },
    rollback(revision) {
      this.$set(revision, 'loading', true);
      const entity = { ...revision.state, paranoid: false };
      axios.patch(`/repositories/${this.repositoryId}/tes/${entity.id}`, entity)
        .then(this.getRevisions)
        .then(revisions => {
          const newRevision = first(revisions);
          this.revisions.unshift(newRevision);
          this.previewRevision(newRevision);
          return Promise.delay(300);
        })
        .then(() => {
          this.$set(revision, 'loading', false);
          this.$refs.sidebar.scrollTop();
        });
    }
  },
  mounted() {
    this.getRevisions().then(revisions => (this.revisions = revisions));
    this.previewRevision(this.revision);
    Promise.delay(700).then(() => (this.expanded = true));
  },
  components: { EntitySidebar, TeachingElement }
};
</script>

<style lang="scss" scoped>
.revisions {
  display: flex;
  padding: 32px 8px;

  .preview {
    flex-grow: 1;
    min-width: 300px;
    min-height: 500px;
    margin-right: 16px;
    text-align: center;
  }
}

.slide-fade-enter-active, .slide-fade-leave-active {
  overflow: hidden;
  margin-top: 0;
  margin-bottom: 0;
  transition: all 350ms cubic-bezier(0.165, 0.84, 0.44, 1);
}

.slide-fade-enter, .slide-fade-leave-to {
  height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
