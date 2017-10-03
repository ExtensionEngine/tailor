<template>
<li>
  <div class="revision">
    <div :style="{ color }" class="type">
      <div class="acronym"><span>{{ acronym }}</span></div>
    </div>
    <div class="content">
      <div class="description">{{ formatDescription(revision) }}</div>
      <div class="name">{{ revision.user.email }}</div>
    </div>
    <div class="date">{{ formatDate(revision) }}</div>
  </div>
</li>
</template>

<script>
import fecha from 'fecha';
import {
  describeActivityRevision,
  describeElementRevision,
  describeCourseRevision,
  getRevisionAcronym,
  getRevisionColor
} from 'utils/revision';
import { mapGetters } from 'vuex-module';

const describe = {
  'COURSE': describeCourseRevision,
  'ACTIVITY': describeActivityRevision,
  'TEACHING_ELEMENT': describeElementRevision
};

export default {
  name: 'revision-item',
  props: ['revision'],
  computed: {
    ...mapGetters(['getParent'], 'activities'),
    color() {
      return getRevisionColor(this.revision);
    },
    acronym() {
      return getRevisionAcronym(this.revision);
    }
  },
  methods: {
    formatDate(rev) {
      return fecha.format(rev.createdAt, 'M/D/YY HH:mm');
    },
    formatDescription(rev) {
      return describe[rev.entity](rev);
    }
  }
};
</script>

<style lang="scss" scoped>
.revision {
  display: table;
  table-layout: fixed;
  width: 100%;
  height: 72px;
  padding: 0 16px;

  &:hover {
    background-color: #f1f1f1;

    .acronym {
      background-color: #fff !important;
    }
  }

  .type, .content, .date {
    display: table-cell;
    vertical-align: middle;
  }

  .type {
    width: 56px;
    padding-right: 16px;

    .acronym {
      width: 40px;
      height: 40px;
      font-size: 18px;
      text-align: center;
      border-radius: 50%;
      background-color: #eee;

      span {
        display: inline-block;
        line-height: 40px;
        vertical-align: middle;
      }
    }
  }

  .content {
    width: 100%;

    .description {
      font-size: 16px;
    }

    .name {
      font-size: 14px;
      color: #808080;
    }
  }

  .date {
    width: 96px;
    font-size: 14px;
    color: #808080;
  }
}
</style>
