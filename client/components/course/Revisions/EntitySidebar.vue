<template>
  <div class="sidebar">
    <div class="header">Changes</div>
    <div ref="revisions" class="revision-list">
      <transition-group name="fade-in">
        <span
          v-for="(revision, index) in revisions"
          :key="revision.id"
          @click="$emit('preview', revision)"
          :class="{ selected: isSelected(revision) }"
          class="revision">
          <div class="description">
            <div>{{ formatDate(revision) }}</div>
            <div>{{ revision.user.email }}</div>
          </div>
          <div
            v-show="!isDetached && index > 0 && !revision.loading"
            @click.stop="$emit('rollback', revision)"
            class="rollback">
            <span class="mdi mdi-restore"></span>
          </div>
          <div v-show="revision.loading">
            <div class="progress-background"></div>
            <div class="progress-indicator"></div>
          </div>
        </span>
      </transition-group>
    </div>
  </div>
</template>

<script>
import fecha from 'fecha';

export default {
  name: 'entity-sidebar',
  props: {
    revisions: { type: Array, default: () => ([]) },
    selected: { type: Object, default: null },
    isDetached: { type: Boolean, default: false }
  },
  methods: {
    isSelected(revision) {
      return revision.id === this.selected.id;
    },
    formatDate(rev) {
      return fecha.format(new Date(rev.createdAt), 'M/D/YY HH:mm');
    },
    scrollTop() {
      this.$refs.revisions.scrollTop = 0;
    }
  }
};
</script>

<style lang="scss" scoped>
$revision-padding: 32px;

@mixin selected-revision {
  color: #fff;
  background-color: #37474f;
}

.sidebar {
  flex: 0 0 320px;
}

.header {
  margin: 8px 0;
  padding-left: $revision-padding;
  color: #808080;
}

.revision-list {
  max-height: 500px;
  padding: 0;
  overflow-y: auto;
}

.revision {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  height: 52px;
  padding-left: $revision-padding;
  color: #656565;
  font-size: 14px;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    color: #333;
    background-color: #f1f1f1;
  }

  .description {
    width: 225px;
  }

  .rollback {
    display: none;
  }
}

.selected, .revision:hover {
  .rollback {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    margin-right: 8px;
    border-radius: 50%;

    &:hover {
      color: #222;
    }

    .mdi {
      font-size: 18px;
    }
  }
}

.selected.revision:hover {
  @include selected-revision;

  .rollback:hover {
    background-color: #ddd;
  }
}

.fade-in-enter {
  opacity: 0;
  transform: scale(0.8);
}

.fade-in-enter-active {
  transition: all 250ms cubic-bezier(0, 0.8, 0.32, 1.07);
}

.progress-background, .progress-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #757575;
}

.progress-background {
  opacity: 0.2;
}

.progress-indicator {
  width: 80px;
  animation: indeterminate 1.2s infinite;
}

.selected {
  @include selected-revision;

  .progress-background {
    opacity: 1;
  }

  .progress-indicator {
    background-color: #e91e63;
  }
}

@keyframes indeterminate {
  0% {
    right: 100%;
    left: -90%;
  }

  100% {
    right: -35%;
    left: 100%;
  }
}
</style>
