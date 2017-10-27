<template>
  <div>
    <div class="header">Changes</div>
    <ul ref="revisions">
      <transition-group name="fade-in">
        <li
          v-for="(revision, index) in revisions"
          :key="revision.id"
          :class="{ selected: revision.id === selected.id }"
          @click="$emit('preview', revision)"
          class="revision">
          <div class="description">
            <div>{{ formatDate(revision) }}</div>
            <div>{{ revision.user.email }}</div>
          </div>
          <div
            v-show="!isDetached && index > 0"
            @click.stop="$emit('rollback', revision)"
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
</template>

<script>
import fecha from 'fecha';

export default {
  name: 'entity-sidebar',
  props: ['revisions', 'selected', 'isDetached'],
  methods: {
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

.header {
  margin: 8px 0;
  padding-left: $revision-padding;
  color: #808080;
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
</style>
