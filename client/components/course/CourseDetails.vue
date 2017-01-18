<template>
  <div class="container">
    <div class="course-name">
      <template v-if="showNameInput">
        <input class="form-control" v-model="newCourseName"/>
      </template>
      <template v-else>
        <h2>
          {{ course.name }}
        </h2>
        <span class="fa fa-pencil pencil" aria-hidden="true"></span>
      </template>
    </div>
    <div class="course-description">
      <template v-if="showDescriptionInput">
        <textarea
          class="form-control"
          v-model="newCourseDescription">
          <!-- @blur="onInputBlur"
          @keyup.enter="onInputEnter"
          @keyup.esc="deactivateInput"> -->
        </textarea>
      </template>
      <template v-else>
        {{ course.description }}
        <span class="fa fa-pencil pencil" aria-hidden="true"></span>
      </template>
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
  data() {
    return {
      showNameInput: true,
      showDescriptionInput: true,
      newCourseName: '',
      newCourseDescription: '',
    };
  },
  computed: {
    course() {
      return find(this.courses, c => c._key === this.$route.params.courseKey) || {};
    },
    ...mapGetters(['courses'])
  },
  onCreated() {
    this.newCourseName = this.course.name || '';
    this.newCourseDescription = this.course.description || '';
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
