<template>
  <li>
    <div
      :class="{ expanded }"
      :style="{ cursor: isTeachingElement ? 'pointer' : 'auto' }"
      @click="toggle"
      class="revision">
      <div :style="{ color }" class="acronym">{{ acronym }}</div>
      <div class="content">
        <div class="description">{{ description }}</div>
        <div class="name">{{ revision.user.email }}</div>
      </div>
      <v-icon v-if="isRemoved" @click.stop="restoreItem" class="restore">
        mdi mdi-loop
      </v-icon>
      <div class="date">{{ date }}</div>
    </div>
    <entity-revisions
      v-if="expanded"
      :revision="revision"
      :isDetached="!activity">
    </entity-revisions>
  </li>
</template>

<script>
import {
  getFormatDescription,
  getRevisionAcronym,
  getRevisionColor
} from 'utils/revision';
import { mapActions, mapGetters } from 'vuex-module';
import EntityRevisions from './EntityRevisions';
import fecha from 'fecha';
import find from 'lodash/find';

export default {
  name: 'revision-item',
  props: {
    revision: { type: Object, required: true }
  },
  data: () => ({ expanded: false }),
  computed: {
    ...mapGetters(['structure'], 'course'),
    ...mapGetters(['getParent'], 'activities'),
    activity() {
      const { state } = this.revision;
      const activityId = state.activityId || state.id;
      return this.getOutlineLocation(this.getParent(activityId));
    },
    color: vm => getRevisionColor(vm.revision),
    acronym: vm => getRevisionAcronym(vm.revision),
    date: vm => fecha.format(vm.revision.createdAt, 'M/D/YY HH:mm'),
    description: vm => getFormatDescription(vm.revision, vm.activity),
    isTeachingElement: vm => vm.revision.entity === 'TEACHING_ELEMENT',
    isRemoved: vm => vm.revision.operation === 'REMOVE'

  },
  methods: {
    ...mapActions(['restore'], 'revisions'),
    ...mapActions({ resetActivities: 'reset' }, 'activities'),
    getOutlineLocation(current) {
      if (!current) return null;
      const level = find(this.structure, { type: current.type });
      if (level) return { ...current, label: level.label };
      return this.getOutlineLocation(this.getParent(current.id));
    },
    toggle() {
      if (this.isTeachingElement) this.expanded = !this.expanded;
    },
    restoreItem() {
      const { name: revisionName } = this.revision.state.data;
      this.restore(this.revision)
        .then(() => {
          this.resetActivities();
          this.$snackbar.show(`${revisionName} restored.`);
        });
    }
  },
  components: { EntityRevisions }
};
</script>

<style lang="scss" scoped>
.revision {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 72px;
  padding: 0 16px;

  .acronym {
    width: 40px;
    height: 40px;
    margin-right: 16px;
    font-size: 20px;
    line-height: 41px;
    text-align: center;
    border-radius: 50%;
    background-color: #f1f1f1;
  }

  .content {
    flex: 1;
    overflow: hidden;

    .description {
      font-size: 16px;
      word-wrap: break-word;
    }

    .name {
      color: #808080;
      font-size: 14px;
    }
  }

  .date {
    width: 128px;
    color: #808080;
    text-align: right;
    font-size: 14px;
  }
}

.expanded, .revision:hover {
  background-color: #f1f1f1;

  .acronym {
    background-color: #fff;
  }
}

.restore {
  width: 32px;
  height: 32px;
  border-radius: 50%;

  &:hover {
    color: #fff;
    background-color: #888;
  }
}
</style>
