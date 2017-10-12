<template>
  <li>
    <div @click="toggleOpen" :class="{ opened }" class="revision">
      <div :style="{ color }" class="acronym"><span>{{ acronym }}</span></div>
      <div class="content">
        <div class="description">{{ description }}</div>
        <div class="name">{{ revision.user.email }}</div>
      </div>
      <div class="date">{{ date }}</div>
    </div>
    <revision-snapshots
      v-if="opened"
      :revision="revision"
      :snapshots="snapshots">
    </revision-snapshots>
  </li>
</template>

<script>
import fecha from 'fecha';
import filter from 'lodash/filter';
import find from 'lodash/find';
import {
  getFormatDescription,
  getRevisionAcronym,
  getRevisionColor
} from 'utils/revision';
import { mapGetters } from 'vuex-module';
import { OUTLINE_LEVELS } from 'shared/activities';
import RevisionSnapshots from './RevisionSnapshots';

export default {
  name: 'revision-item',
  props: ['revision'],
  data() {
    return { opened: false };
  },
  computed: {
    ...mapGetters(['getParent'], 'activities'),
    ...mapGetters(['revisions'], 'course'),
    activity() {
      const activityId = this.revision.state.activityId || this.revision.state.id;
      return this.getOutlineLocation(this.getParent(activityId));
    },
    color() {
      return getRevisionColor(this.revision);
    },
    acronym() {
      return getRevisionAcronym(this.revision);
    },
    snapshots() {
      return filter(this.revisions, rev => rev.state.id === this.revision.state.id);
    },
    date() {
      return fecha.format(this.revision.createdAt, 'M/D/YY HH:mm');
    },
    description() {
      return getFormatDescription(this.revision, this.activity);
    }
  },
  methods: {
    getOutlineLocation(current) {
      if (!current) return null;
      const level = find(OUTLINE_LEVELS, { type: current.type });
      if (level) return { ...current, label: level.label };
      return this.getOutlineLocation(this.getParent(current.id));
    },
    toggleOpen() {
      if (this.revision.entity !== 'TEACHING_ELEMENT') return;
      this.opened = !this.opened;
    }
  },
  components: { RevisionSnapshots }
};
</script>

<style lang="scss" scoped>
.revision {
  width: 100%;
  height: 72px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  cursor: pointer;

  .acronym {
    width: 40px;
    height: 40px;
    margin-right: 16px;
    font-size: 18px;
    text-align: center;
    border-radius: 50%;
    background-color: #eee;

    span {
      line-height: 40px;
    }
  }

  .content {
    flex-grow: 1;

    .description {
      font-size: 16px;
    }

    .name {
      font-size: 14px;
      color: #808080;
    }
  }

  .date {
    width: 128px;
    text-align: right;
    font-size: 14px;
    color: #808080;
  }
}

.opened, .revision:hover {
  background-color: #f1f1f1;

  .acronym {
    background-color: #fff;
  }
}
</style>
