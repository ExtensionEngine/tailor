<template>
  <div class="container">
    <div class="course-name">
      <template v-if="showNameInput">
        <input
          class="form-control"
          v-model="newCourseName"
          v-focus="true"
          @blur="onNameInputBlur"
          @keyup.enter="onNameInputBlur"
          @keyup.esc="showNameInput = false">
      </template>
      <template v-else>
        <h2 @click.stop="showNameInput = true">
          {{ course.name }}
        </h2>
        <span class="fa fa-pencil pencil" aria-hidden="true"></span>
      </template>
    </div>
    <div class="course-description">
      <template v-if="showDescriptionInput">
        <textarea
          class="form-control"
          v-model="newCourseDescription"
          v-focus="true"
          @blur="onDescriptionInputBlur"
          @keyup.esc="showDescriptionInput = false">
        </textarea>
      </template>
      <template v-else>
        <span @click.stop="showDescriptionInput = true">
          {{ course.description }}
        </span>
        <span class="fa fa-pencil pencil" aria-hidden="true"></span>
      </template>
    </div>
    <div class="course-actions">
      <button type="button" class="btn btn-danger" @click.stop="removeCourse">
        <span class="fa fa-trash"></span>
        remove course
      </button>
    </div>
  </div>
</template>

<script>
import { focus } from 'vue-focus';
import { mapGetters } from 'vuex-module';
import find from 'lodash/find';

export default {
  directives: { focus },
  data() {
    return {
      showNameInput: false,
      showDescriptionInput: false,
      newCourseName: '',
      newCourseDescription: ''
    };
  },
  computed: {
    course() {
      return find(this.courses, c => c.id === this.$route.params.courseKey);
    },
    ...mapGetters(['courses'])
  },
  methods: {
    onNameInputBlur() {
      if (this.showNameInput) {
        this.showNameInput = false;
        if (this.newCourseName !== this.course.name) {
          console.log('update course name!');
        }
      }
    },
    onDescriptionInputBlur() {
      if (this.showDescriptionInput) {
        this.showDescriptionInput = false;
        if (this.newCourseDescription !== this.course.description) {
          console.log('update course description!');
        }
      }
    },
    removeCourse() {
      console.log('remove course!');
    }
  },
  created() {
    this.newCourseName = this.course.name.slice(0);
    this.newCourseDescription = this.course.description.slice(0);
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

.container {
  textarea {
    resize: vertical;
    height: 200px;
  }
}
</style>
