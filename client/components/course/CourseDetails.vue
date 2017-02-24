<template>
  <div class="container">
    <div class="course-name">
      <template v-if="showNameInput">
        <input
          class="form-control"
          v-model="newCourseName"
          v-focus="true"
          @blur="updateName"
          @keyup.enter="updateName"
          @keyup.esc="showNameInput = false">
      </template>
      <template v-else>
        <h2 @click.stop="showNameInput = true">
          {{ course ? course.name : '' }}
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
          @blur="updateDescription"
          @keyup.esc="showDescriptionInput = false">
        </textarea>
      </template>
      <template v-else>
        <span @click.stop="showDescriptionInput = true">
          {{ course ? course.description : '' }}
        </span>
        <span class="fa fa-pencil pencil" aria-hidden="true"></span>
      </template>
    </div>
    <div class="course-actions">
      <button v-if="showRemoveButton" type="button" class="btn btn-danger" @click.stop="showModal">
        <span class="fa fa-trash"></span>
        remove course
      </button>
    </div>
  </div>
</template>

<script>
import { focus } from 'vue-focus';
import { mapGetters, mapActions } from 'vuex-module';
import modalBus from '../common/deletionModal/eventBus';

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
    ...mapGetters(['isAdmin']),
    ...mapGetters(['course'], 'editor'),
    showRemoveButton() {
      return this.isAdmin;
    }
  },
  methods: {
    ...mapActions(['update'], 'courses'),
    updateName() {
      if (this.showNameInput) {
        this.showNameInput = false;
        if (this.course.name !== this.newCourseName) {
          this.course.name = this.newCourseName;
          this.update(this.course);
        }
      }
    },
    updateDescription() {
      if (this.showDescriptionInput) {
        this.showDescriptionInput = false;
        if (this.course.description !== this.newCourseDescription) {
          this.course.description = this.newCourseDescription;
          this.update(this.course);
        }
      }
    },
    showModal() {
      modalBus.$emit('show', { item: this.course, type: 'course' });
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
