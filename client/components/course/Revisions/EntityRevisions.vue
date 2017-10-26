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
        <div>
          <div class="header">Changes</div>
          <ul ref="revisions">
            <transition-group name="fade-in">
              <li
                v-for="(revision, index) in revisions"
                :key="revision.id"
                :class="{ selected: revision.id === selectedRevision.id }"
                @click="previewRevision(revision)"
                class="revision">
                <div class="description">
                  <div>{{ formatDate(revision) }}</div>
                  <div>{{ revision.user.email }}</div>
                </div>
                <div
                  v-show="!isDetached && index > 0"
                  @click.stop="rollback(revision)"
                  class="rollback">
                  <span class="mdi mdi-loop"></span>
                </div>
                <div v-show="revision.isResolving">
                  <div class="progress-background"></div>
                  <div class="progress-indicator"></div>
                </div>
              </li>
            </transition-group>
          </ul>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from 'client/api/request';
import fecha from 'fecha';
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
    formatDate(rev) {
      return fecha.format(new Date(rev.createdAt), 'M/D/YY HH:mm');
    },
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
          this.$refs.revisions.scrollTop = 0;
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
  components: { Loader, TeachingElement }
};
</script>

<style lang="scss" scoped>
$revision-padding: 32px;

.revisions {
  padding: 32px 8px;

  .loader {
    margin: 32px 0;
    text-align: center;
  }

  .header {
    margin: 8px 0;
    padding-left: $revision-padding;
    color: #808080;
  }

  .content {
    display: flex;
  }

  ul {
    max-height: 500px;
    padding: 0;
    list-style-type: none;
    overflow-y: auto;
  }

  .revision {
    width: (256px + $revision-padding);
    height: 52px;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: $revision-padding;
    overflow: hidden;
    cursor: pointer;
    font-size: 14px;
    color: #656565;

    &:hover {
      background-color: #f1f1f1;
      color: #333;
    }

    .description {
      width: 220px;
    }

    .rollback {
      display: none;
    }
  }

  .revision:hover, .selected {
    .rollback {
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;

      &:hover {
        background-color: #888;
        color: #fff;
      }

      .mdi {
        font-size: 18px;
      }
    }
  }

  .selected, .selected.revision:hover {
    background-color: #1e88e5;
    color: #fff;

    .rollback:hover {
      background-color: #42a5f5;
    }
  }

  .fade-in-enter {
    opacity: 0;
    transform: scale(0);
  }

  .fade-in-enter-active {
    transition: all 350ms cubic-bezier(0, 0.8, 0.32, 1.07);
  }

  .progress-background, .progress-indicator {
    width: 100%;
    height: 2px;
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: #757575;
  }

  .progress-background {
    opacity: 0.2;
  }

  .progress-indicator {
    width: 80px;
    animation: indeterminate 2.2s infinite;
  }

  @keyframes indeterminate {
    0% {
      left: -90%;
      right: 100%;
    }

    100% {
      left: 100%;
      right: -35%;
    }
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
