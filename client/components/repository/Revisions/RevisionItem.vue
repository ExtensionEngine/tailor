<template>
  <li>
    <div
      @click="toggle"
      :style="{ cursor: isContentElement ? 'pointer' : 'auto' }"
      :class="{ expanded, expandable: isContentElement }"
      class="revision">
      <v-avatar size="42" color="blue-grey darken-4">
        <span :style="{ color }" class="headline">{{ acronym }}</span>
      </v-avatar>
      <div class="content ml-3">
        <div class="text-truncate">{{ description }}</div>
        <div class="body-2">{{ date }} {{ revision.user.label }}</div>
      </div>
    </div>
    <entity-revisions
      v-if="expanded"
      :revision="revision"
      :is-detached="!activity" />
  </li>
</template>

<script>
import {
  getFormatDescription,
  getRevisionAcronym,
  getRevisionColor
} from 'utils/revision';
import EntityRevisions from './EntityRevisions';
import fecha from 'fecha';
import find from 'lodash/find';
import { mapGetters } from 'vuex';

export default {
  name: 'revision-item',
  props: {
    revision: { type: Object, required: true }
  },
  data() {
    return { expanded: false };
  },
  computed: {
    ...mapGetters('repository', ['structure']),
    ...mapGetters('repository/activities', ['getParent']),
    activity() {
      const { state } = this.revision;
      const activityId = state.activityId || state.id;
      return this.getOutlineLocation(this.getParent(activityId));
    },
    color() {
      return getRevisionColor(this.revision);
    },
    acronym() {
      return getRevisionAcronym(this.revision);
    },
    date() {
      return fecha.format(this.revision.createdAt, 'M/D/YY h:mm A');
    },
    description() {
      return getFormatDescription(this.revision, this.activity);
    },
    isContentElement() {
      return this.revision.entity === 'CONTENT_ELEMENT';
    }
  },
  methods: {
    getOutlineLocation(current) {
      if (!current) return null;
      const level = find(this.structure, { type: current.type });
      if (level) return { ...current, label: level.label };
      return this.getOutlineLocation(this.getParent(current.id));
    },
    toggle() {
      if (this.isContentElement) this.expanded = !this.expanded;
    }
  },
  components: { EntityRevisions }
};
</script>

<style lang="scss" scoped>
.revision {
  display: flex;
  align-items: center;
  min-height: 4.5rem;
  padding: 0 1rem;

  .content {
    flex: 1;
    overflow: hidden;
  }
}

.expandable.expanded, .expandable.revision:hover {
  background-color: #dadada;
}
</style>
