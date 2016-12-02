<template>
  <div class="course-create">
    <button type="button" class="btn btn-primary btn-trigger" data-toggle="modal" data-target="#createCourse">
      Create new Course
    </button>

    <div class="modal fade" id="createCourse" tabindex="-1" role="dialog" aria-labelledby="createCourseLabel">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div v-if="createStatus.failure">
            {{createStatus.message}}
          </div>

          <cube-grid v-if="createStatus.request"></cube-grid>
          <form v-else @submit.prevent="handleCreateCourse">
            <div class="modal-body">
              <div class="form-group">
                <input
                ref="title"
                type="text"
                class="form-control"
                placeholder="title..."
                />
              </div>

              <div class="form-group">
                <textarea
                ref="description"
                class="form-control"
                placeholder="description..."
                >
              </textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary">Create</button>
          </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { max } from 'lodash';

  // TODO: replace with Vue component
  import $ from 'jquery';

  import CubeGrid from '../loaders/CubeGrid';

  export default {
    name: 'course-create',

    components: {
      CubeGrid
    },

    computed: {
      ...mapGetters({
        courses: 'getCourses',
        createStatus: 'getCreateStatus'
      })
    },

    beforeDestroy() {
      $(this.$el.querySelector('#createCourse')).modal('hide');
    },

    methods: {
      handleCreateCourse() {
        const id = max(this.courses.map(c => c.id)) + 1;
        const title = this.$refs.title.value;
        const description = this.$refs.description.value;
        const data = title && description ? { id, title, description } : {};

        this.createCourse(data);
      },
      ...mapActions([
        'createCourse'
      ])
    }
  };
</script>

<style lang="scss">
  .course-create {
    input[type="text"] {
      padding: 0 10px;
    }

    textarea.form-control {
      height: 80px;
      padding: 10px;
      resize: none;
    }

    .modal-content {
      border-radius: 0;
    }

    .modal-footer {
      border: 0;
    }
  }
</style>
