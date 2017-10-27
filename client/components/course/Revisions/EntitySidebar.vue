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
  display: flex;
  position: relative;
  width: (256px + $revision-padding);
  height: 52px;
  flex-direction: row;
  align-items: center;
  padding-left: $revision-padding;
  overflow: hidden;
  color: #656565;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: #333;
    background-color: #f1f1f1;
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
    display: flex;
    width: 32px;
    height: 32px;
    justify-content: center;
    align-items: center;
    border-radius: 50%;

    &:hover {
      color: #fff;
      background-color: #888;
    }

    .mdi {
      font-size: 18px;
    }
  }
}

.selected, .selected.revision:hover {
  color: #fff;
  background-color: #1e88e5;

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
  animation: indeterminate 2.2s infinite;
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
