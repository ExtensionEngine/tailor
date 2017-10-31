<template>
  <li>
    <div class="revision">
      <div :style="{ color }" class="acronym"><span>{{ acronym }}</span></div>
      <div class="content">
        <div class="description">{{ description }}</div>
        <div class="name">{{ revision.user.email }}</div>
      </div>
      <div class="date">{{ date }}</div>
    </div>
  </li>
</template>

<script>
import fecha from 'fecha';
import find from 'lodash/find';
import {
  getFormatDescription,
  getRevisionAcronym,
  getRevisionColor
} from 'utils/revision';
import { mapGetters } from 'vuex-module';

export default {
  name: 'revision-item',
  props: ['revision'],
  computed: {
    ...mapGetters(['getParent'], 'activities'),
    ...mapGetters(['structure'], 'course'),
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
      const level = find(this.structure, { type: current.type });
      if (level) return { ...current, label: level.label };
      return this.getOutlineLocation(this.getParent(current.id));
    }
  }
};
</script>

<style lang="scss" scoped>
.revision {
  display: flex;
  align-items: center;
  width: 100%;
  height: 72px;
  padding: 0 16px;

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

  &:hover {
    background-color: #f1f1f1;

    .acronym {
      background-color: #fff;
    }
  }
}
</style>
