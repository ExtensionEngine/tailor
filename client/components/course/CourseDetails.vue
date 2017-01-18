<template>
  <div class="container">
    <div class="course-name">
      <h2>
        {{ course.name }}
      </h2>
      <span class="fa fa-pencil pencil" aria-hidden="true"></span>
    </div>
    <div class="course-description">
      {{ course.description }}
      <span class="fa fa-pencil pencil" aria-hidden="true"></span>
    </div>
    <div class="course-actions">
      <button type="button" class="btn btn-danger">
        <span class="fa fa-trash"></span>
        remove course
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex-module';
import find from 'lodash/find';

export default {
  computed: {
    course() {
      return find(this.courses, c => c._key === this.$route.params.courseKey) || {};
    },
    ...mapGetters(['courses'])
  }
};
</script>

<style scoped lang="scss">
.pencil {
  display: none;
}

.course-name {
  margin: 80px 0 30px 0;
  text-align: left;

  &:hover {
    .pencil {
      display: inline;
    }
  }
}

.course-description {
  text-align: left;

  &:hover {
    .pencil {
      display: inline;
    }
  }
}

.course-actions {
  margin: 25px 0;
}

h2 {
  display: inline-block;
  font-size: 20px;
  color: #444;
}
</style>
