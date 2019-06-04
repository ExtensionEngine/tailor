<template>
  <div class="col-lg-4">
    <div @click="navigateTo" class="repo-card white elevation-2">
      <div class="body">
        <div class="repo-title">
          <acronym :course="course"/>
          {{ name }}
        </div>
        <div class="description">{{ description }}</div>
      </div>
      <div class="row">
        <span class="col-xs-6">
          <stat :name="objectiveLabel" :value="objectives"/>
        </span>
        <span class="col-xs-6">
          <stat :value="assessments" name="Knowledge checks"/>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Acronym from 'components/common/Acronym';
import get from 'lodash/get';
import { getObjectives } from 'shared/activities';
import map from 'lodash/map';
import pluralize from 'pluralize';
import Stat from './Stat';
import truncate from 'truncate';

export default {
  props: {
    course: { type: Object, required: true }
  },
  computed: {
    name() {
      return truncate(this.course.name, 75);
    },
    description() {
      return truncate(this.course.description, 180);
    },
    objectiveLabel() {
      const objectives = map(getObjectives(this.course.schema), 'label');
      return objectives.length > 1 ? 'Objectives' : pluralize(objectives[0]);
    },
    assessments() {
      return get(this.course, 'stats.assessments', 0);
    },
    objectives() {
      return get(this.course, 'stats.objectives', 0);
    }
  },
  methods: {
    navigateTo() {
      if (window.getSelection().toString()) return;
      this.$router.push({
        name: 'course',
        params: { courseId: this.course.id }
      });
    }
  },
  components: {
    Acronym,
    Stat
  }
};
</script>

<style lang="scss" scoped>
.repo-card {
  min-height: 300px;
  margin-top: 40px;
  padding: 30px 30px 20px;
  color: #555;
  border-radius: 3px;
  transition: box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 10px 20px rgba(0,0,0,0.2), 0 8px 8px rgba(0,0,0,0.18) !important;
  }

  .body {
    height: 220px;
    margin-bottom: 15px;
    overflow: hidden;

    @media (min-width: 1200px) and (max-width: 1300px) {
      height: 250px;
    }
  }
}

.repo-title {
  height: 100px;
  margin: 20px 0 10px;
  font-size: 20px;
  font-weight: 300;
  line-height: 34px;
  text-align: left;

  @media (min-width: 1200px) and (max-width: 1300px) {
    height: 125px;
  }
}

.description {
  max-height: 130px;
  font-size: 14px;
  text-align: left;
}
</style>
