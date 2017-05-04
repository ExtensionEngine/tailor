<template>
  <div class="settings">
    <loader v-if="showLoader"></loader>
    <div v-else>
      <div class="form-group">
        <label for="courseName">Name</label>
        <span
          v-show="showNameInput"
          :class="{ 'has-error': vErrors.has('courseName') }">
          <input
            v-model="newCourseName"
            v-focus="true"
            v-validate="{ rules: { required: true, min: 2, max: 250 } }"
            @blur="updateName"
            @keyup.enter="updateName"
            @keyup.esc="showNameInput = false"
            name="courseName"
            data-vv-as="Name"
            id="courseName"
            class="form-control">
            <span class="help-block">{{ vErrors.first('courseName') }}</span>
        </span>
        <span v-show="!showNameInput">
          <h2 @click.stop="showNameInput = true">{{ course.name }}</h2>
        </span>
      </div>
      <div class="form-group">
        <label for="courseDescription">Description</label>
        <span
          v-show="showDescriptionInput"
          :class="{ 'has-error': vErrors.has('courseDescription') }">
          <textarea
            v-model="newCourseDescription"
            v-focus="true"
            v-validate="{ rules: { required: true, min: 2, max: 2000 } }"
            @blur="updateDescription"
            @keyup.esc="showDescriptionInput = false"
            name="courseDescription"
            data-vv-as="Description"
            id="courseDescription"
            class="form-control">
          </textarea>
          <span class="help-block">
            {{ vErrors.first('courseDescription') }}
          </span>
        </span>
        <span v-show="!showDescriptionInput">
          <span @click.stop="showDescriptionInput = true" class="form-display">
            {{ course.description }}
          </span>
        </span>
      </div>
      <div class="course-actions">
        <button
          v-if="showRemoveButton"
          @click.stop="removeCourse"
          type="button"
          class="btn btn-danger">
          <span class="mdi mdi-delete"></span>
          remove course
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from 'EventBus';
import { focus } from 'vue-focus';
import Loader from '../../common/Loader';
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
    ...mapGetters(['course'], 'course'),
    showRemoveButton() {
      return this.isAdmin;
    }
  },
  methods: {
    ...mapActions(['update', 'remove'], 'courses'),
    updateName() {
      if (!this.showNameInput) return;
      this.showNameInput = false;
      if (this.course.name === this.newCourseName) return;
      this.$validator.validateAll().then(() => {
        this.update({ ...this.course, name: this.newCourseName });
      }, () => this.setCourseFields());
    },
    updateDescription() {
      if (!this.showDescriptionInput) return;
      this.showDescriptionInput = false;
      if (this.course.description === this.newCourseDescription) return;
      this.$validator.validateAll().then(() => {
        this.update({ ...this.course, description: this.newCourseDescription });
      }, () => this.setCourseFields());
    },
    removeCourse() {
      const payload = {
        type: 'course',
        item: this.course,
        action: () => this.remove(this.course) && this.$router.push('/')
      };

      appChannel.emit('showConfirmationModal', payload);
    },
    setCourseFields() {
      this.newCourseName = this.course.name;
      this.newCourseDescription = this.course.description;
    }
  },
  mounted() {
    if (!this.course) return;
    this.setCourseFields();
  },
  watch: {
    course() {
      this.setCourseFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.course-actions {
  margin: 15px 0;
  text-align: center;
}

h2 {
  display: inline-block;
  font-size: 16px;
  color: #444;
  font-weight: normal;
  margin: 20px 0 32px 0;
}

input.form-control {
  padding-top: 3px;
  margin-top: 15px;
}

textarea.form-control {
  height: 200px;
  padding-top: 22px;
  font-size: 16px;
  letter-spacing: 0.1px;
}

span.form-display {
  font-size: 16px;
  white-space: pre-line;
  display: inline-block;
  height: 225px;
}

label {
  margin-top: 10px;
  color: gray;
  display: block;
  font-size: 14px;
}

.settings {
  float: right;
  width: 71%;
  margin: 75px 75px 40px 0px;
  padding: 30px 30px 10px 30px;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
  text-align: left;
}

.help-block {
  min-height: 20px;
}
</style>
