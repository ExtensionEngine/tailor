<template>
  <div v-if="course" class="settings">
    <div class="form-group">
      <label for="courseName">Name</label>
      <span
        v-show="showNameInput"
        :class="{ 'has-error': vErrors.has('courseName') }">
        <textarea
          v-model="newCourseName"
          v-focus="true"
          v-validate="{ rules: { required: true, min: 2, max: 250 } }"
          @blur="updateName"
          @keyup.enter="updateName"
          @keyup.esc="showNameInput = false"
          name="courseName"
          data-vv-as="Name"
          id="courseName"
          class="form-control name">
        </textarea>
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
  </div>
</template>

<script>
import EventBus from 'EventBus';
import { focus } from 'vue-focus';
import Loader from '../../common/Loader';
import { mapGetters, mapActions } from 'vuex-module';

const appChannel = EventBus.channel('app');

export default {
  props: ['showLoader'],
  directives: { focus },
  components: { Loader },
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
      this.$validator.validateAll().then(result => {
        if (!result) return this.setCourseFields();
        this.update({ ...this.course, name: this.newCourseName });
      });
    },
    updateDescription() {
      if (!this.showDescriptionInput) return;
      this.showDescriptionInput = false;
      if (this.course.description === this.newCourseDescription) return;
      this.$validator.validateAll().then(result => {
        if (!result) return this.setCourseFields();
        this.update({ ...this.course, description: this.newCourseDescription });
      });
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
  },
  inject: ['$validator']
};
</script>

<style lang="scss" scoped>
.settings {
  padding: 30px 30px 10px;
  text-align: left;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  background-color: white;
}

h2 {
  display: inline-block;
  height: 40px;
  margin: 15px 0 30px;
  color: #444;
  font-size: 16px;
  font-weight: normal;
  line-height: 20px;
}

textarea.form-control.name {
  height: 50px;
  margin-top: 15px;
  padding-top: 5px;
  line-height: 20px;
  letter-spacing: 0.1px;
}

textarea.form-control {
  height: 200px;
  padding-top: 22px;
  letter-spacing: 0.1px;
}

span.form-display {
  display: inline-block;
  height: 225px;
  white-space: pre-line;
  font-size: 16px;
}

label {
  display: block;
  margin-top: 10px;
  color: gray;
  font-size: 14px;
}

.help-block {
  min-height: 20px;
}
</style>
