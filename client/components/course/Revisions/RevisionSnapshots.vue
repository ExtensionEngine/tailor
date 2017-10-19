<template>
  <transition name="slide-fade">
    <div class="snapshots">
      <loader v-if="showLoader" class="loader"></loader>
      <div v-else class="content">
        <div class="preview">
          <teaching-element
            v-if="selectedSnapshot"
            :element="selectedSnapshot.state"
            :disabled="true">
          </teaching-element>
          <button
            v-if="!isDetached"
            @click="$emit('rollback', selectedSnapshot.state)"
            class="btn btn-success">
            Rollback
          </button>
        </div>
        <div>
          <div class="header">Changes</div>
          <ul>
            <li
              v-for="snapshot in snapshots"
              :key="snapshot.id"
              :class="{ selected: snapshot.id === selectedSnapshot.id }"
              @click="onSnapshotClicked(snapshot)"
              class="snapshot">
              <div>{{ formatDate(snapshot) }}</div>
              <div>{{ revision.user.email }}</div>
              <div v-if="resolving === snapshot.id" class="resolving-background"></div>
              <div v-if="resolving === snapshot.id" class="resolving-progress"></div>
            </li>
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
import Loader from 'components/common/Loader';
import Promise from 'bluebird';
import TeachingElement from 'components/editor/teaching-elements';

export default {
  name: 'revision-snapshots',
  props: ['revision', 'isDetached'],
  data() {
    return {
      snapshots: [],
      selectedSnapshot: {},
      resolved: [],
      showLoader: true,
      resolving: null
    };
  },
  computed: {
    courseId() {
      return Number(this.$route.params.courseId);
    }
  },
  methods: {
    formatDate(rev) {
      return fecha.format(new Date(rev.createdAt), 'M/D/YY HH:mm');
    },
    resolveStatics(snapshot) {
      return !this.resolved.includes(snapshot.id)
        ? axios.get(`/courses/${this.courseId}/revisions/${snapshot.id}`)
        : Promise.resolve({ data: snapshot });
    },
    onSnapshotClicked(snapshot) {
      this.resolving = snapshot.id;
      this.resolveStatics(snapshot).then(response => this.updateResolved(response));
    },
    updateResolved(response) {
      this.showLoader = false;
      setTimeout(() => (this.resolving = null), 1000);
      this.resolved.push(response.data.id);
      const index = findIndex(this.snapshots, { id: response.data.id });
      this.snapshots.splice(index, 1, response.data);
      this.selectedSnapshot = response.data;
    }
  },
  mounted() {
    const params = { entityId: this.revision.state.id };
    const getRevisions = axios.get(`/courses/${this.courseId}/revisions/`, { params });
    Promise.join(getRevisions, this.resolveStatics(this.revision), Promise.delay(700))
      .then(([revisionsResponse, resolveStaticsResponse]) => {
        this.snapshots = revisionsResponse.data;
        this.updateResolved(resolveStaticsResponse);
      });
  },
  components: { Loader, TeachingElement }
};
</script>

<style lang="scss" scoped>
$snapshot-padding: 32px;

.snapshots {
  padding: 32px 8px;

  .loader {
    margin: 32px 0;
    text-align: center;
  }

  .header {
    margin: 8px 0;
    padding-left: $snapshot-padding;
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

  .snapshot {
    width: (256px + $snapshot-padding);
    height: 52px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: $snapshot-padding;
    overflow: hidden;
    cursor: pointer;
    font-size: 14px;
    color: #656565;

    .resolving-background, .resolving-progress {
      width: 100%;
      height: 4px;
      position: absolute;
      left: 0;
      bottom: 0;
      background-color: #1a237e;
    }

    .resolving-background {
      opacity: 0.3;
    }

    .resolving-progress {
      width: auto;
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
  }

  .snapshot:hover {
    background-color: #f1f1f1;
    color: #333;
  }

  .selected, .selected.snapshot:hover {
    background-color: #e3f2fd;
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
