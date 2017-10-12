<template>
  <transition name="slide-fade">
    <div class="snapshots">
      <ul>
        <li
          v-for="snapshot in snapshots"
          :key="snapshot._cid"
          :class="{ opened: snapshot === currentSnapshot }"
          @click="currentSnapshot = snapshot"
          class="snapshot">
          <div class="date">{{ formatDate(snapshot) }}</div>
          <div class="name">{{ revision.user.email }}</div>
        </li>
      </ul>
      <!-- TODO(marko): Replace this with a Vuetify card component -->
      <div class="preview">
        <teaching-element
          :element="currentSnapshot.state"
          :disabled="true">
        </teaching-element>
      </div>
    </div>
  </transition>
</template>

<script>
import fecha from 'fecha';
import TeachingElement from '../../editor/teaching-elements';

export default {
  name: 'revision-snapshots',
  props: ['revision', 'snapshots'],
  data() {
    return { currentSnapshot: this.snapshots[0] };
  },
  methods: {
    formatDate(rev) {
      return fecha.format(rev.createdAt, 'M/D/YY HH:mm');
    }
  },
  components: { TeachingElement }
};
</script>

<style lang="scss" scoped>
.snapshots {
  display: flex;
  padding: 32px 8px;
  border: 1px solid #ddd;
  border-top: none;
  box-sizing: border-box;

  ul {
    padding: 0;
    list-style-type: none;
  }

  .snapshot {
    width: (256px + 64px); /* width + padding */
    height: 64px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 64px;
    cursor: pointer;

    .date {
      font-size: 16px;
    }

    .name {
      font-size: 14px;
      color: #808080;
    }
  }

  .opened, .snapshot:hover {
    background-color: #f1f1f1;
  }

  .preview {
    flex-grow: 1;
    margin-left: 16px;
    padding: 16px;
    box-radius: 2px;
    box-shadow:
      0px 3px 3px -2px rgba(0, 0, 0, 0.2),
      0px 2px 2px 0px rgba(0, 0, 0, 0.14),
      0px 1px 5px 0px rgba(0, 0, 0, 0.12);
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
