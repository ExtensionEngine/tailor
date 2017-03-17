<template>
  <div class="settings">
    <loader v-if="showLoader"></loader>
    <div v-else>
      <div class="course-name">
        <label for="name-field">Name</label>
        <span v-if="showNameInput">
          <input
            v-model="newCourseName"
            v-focus="true"
            @blur="updateName"
            @keyup.enter="updateName"
            @keyup.esc="showNameInput = false"
            id="name-field"
            class="form-control">
        </span>
        <span v-else class="course-name">
          <h2 @click.stop="showNameInput = true">
            {{ course ? course.name : '' }}
          </h2>
        </span>
      </div>
      <div class="course-description">
        <label for="description-field">Description</label>
        <span v-if="showDescriptionInput">
          <textarea
            v-model="newCourseDescription"
            v-focus="true"
            @blur="updateDescription"
            @keyup.esc="showDescriptionInput = false"
            id="description-field"
            class="form-control">
          </textarea>
        </span>
        <span v-else>
          <span @click.stop="showDescriptionInput = true" class="form-display">
            {{ course ? course.description : '' }}
          </span>
        </span>
      </div>
      <div class="course-actions">
        <button
          v-if="showRemoveButton"
          @click.stop="removeCourse"
          type="button"
          class="btn btn-danger">
          <span class="fa fa-trash"></span>
          remove course
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from 'EventBus';
import { focus } from 'vue-focus';
import Loader from '../common/Loader';
import { mapGetters, mapActions } from 'vuex-module';
import { tooltip } from 'vue-strap';

const appChannel = EventBus.channel('app');

export default {
  props: ['showLoader'],
  directives: { focus },
  components: { Loader, tooltip },
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
    ...mapActions(['update', 'remove'], 'courses'),
    updateName() {
      if (this.showNameInput) return;
      this.showNameInput = false;
      if (this.course.name !== this.newCourseName) {
        this.course.name = this.newCourseName;
        this.update(this.course);
      }
    },
    updateDescription() {
      if (this.showDescriptionInput) return;
      this.showDescriptionInput = false;
      if (this.course.description !== this.newCourseDescription) {
        this.course.description = this.newCourseDescription;
        this.update(this.course);
      }
    },
    removeCourse() {
      const payload = {
        type: 'course',
        item: this.course,
        action: () => this.remove(this.course).then(() => this.$router.push('/'))
      };

      appChannel.emit('showConfirmationModal', payload);
    },
    setCourseFields() {
      this.newCourseName = this.course.name;
      this.newCourseDescription = this.course.description;
    }
  },
  created() {
    this.setCourseFields();
  },
  watch: {
    course() {
      this.setCourseFields();
    }
  }
};
</script>

<style scoped lang="scss">
.course-name {
  margin: 20px 0 30px 0;
  text-align: left;
}

.course-description {
  text-align: left;
}

.course-actions {
  margin: 25px 0;
}

h2 {
  display: inline-block;
  font-size: 16px;
  color: #444;
  font-weight: normal;
  margin: 20px 0 7px 0; 
}

input.form-control {
  padding-top: 3px; 
  margin-top: 15px;
}

textarea.form-control {
  height: 300px;
  padding-top: 22px;
  font-size: 16px;
  letter-spacing: 0.1px;
}

span.form-display {
  font-size: 16px;
  white-space: pre-line;
  display: inline-block;
  height: 300px;
}

label {
  color: gray;
  display: block;
  font-size: 14px;
}

.settings {
  margin: 40px 20px; 
  padding: 10px 30px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.74);
}
</style>
