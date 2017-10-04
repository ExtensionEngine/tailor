<template>
  <li>
    <div class="revision">
      <div :style="{ color }" class="acronym"><span>{{ acronym }}</span></div>
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

const describe = {
  'COURSE': describeCourseRevision,
  'ACTIVITY': describeActivityRevision,
  'TEACHING_ELEMENT': describeElementRevision
};

export default {
  name: 'revision-item',
  props: ['revision'],
  computed: {
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
  width: 100%;
  height: 72px;
  display: flex;
  align-items: center;
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
      font-size: 14px;
      color: #808080;
    }
  }

  .date {
    width: 96px;
    font-size: 14px;
    color: #808080;
  }

  &:hover {
    background-color: #f1f1f1;

    .acronym {
      background-color: #fff;
    }
  }
}
</style>
