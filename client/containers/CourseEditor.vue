<template>
  <div class="course-editor">
    <div class="row">
      <div class="col-md-2">
        <course-sidebar></course-sidebar>
      </div>

      <div class="col-md-10 col-md-offset-2 content">
        <cube-spinner v-if="fetchStatus.request"></cube-spinner>
        <div v-else>
          <div class="row heading">
            <div class="col-md-12">
              <h1>Expressions</h1>

              <ul>
                <li v-for="user in users">
                  <span class="fa fa-2x fa-user"></span>
                </li>
              </ul>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <div class="editor">
                <div class="wrapper">
                  <a><span class="fa fa-3x fa-plus"></span></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

  import CourseSidebar from '../components/editor/Sidebar';
  import CubeSpinner from '../components/loaders/CubeSpinner';

  export default {
    name: 'course-edit',

    components: {
      CourseSidebar,
      CubeSpinner
    },

    data() {
      return {
        users: ['test', 'test', 'test']
      };
    },

    methods: {
      ...mapActions([
        'fetchCourse',
        'removeCourse'
      ])
    },

    computed: {
      ...mapGetters({
        course: 'getCourse',
        fetchStatus: 'getCourseFetchStatus'
      })
    },

    created() {
      this.fetchCourse(this.$route.params.courseId);
    },

    destroyed() {
      this.removeCourse();
    }
  };
</script>

<style lang="scss">
  .course-editor {
    .content {
      margin-left: 15%;
      width: 70%;

      h1 {
        float: left;
        font-size: 32px;
        font-weight: 600;
        margin: 0;
      }

      ul {
        float: right;
        margin: 0;
        padding: 30px 0 5px;

        li {
          display: inline-block;
          padding: 0 10px;
        }
      }

      .heading {
        padding: 40px 0 5px;
      }

      .editor {
        background-color: #fff;
        border: 1px solid transparent;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.74);
        min-height: 600px;

        .wrapper {
          border: 1px dashed #000;
          height: 100px;
          margin: 60px 90px;

          a {
            color: #000;
            cursor: pointer;
            display: block;
            height: 100%;
            padding-top: 29px;
            width: 100%;

            &:hover {
              background-color: lighten(#000, 90%);
            }
          }
        }
      }
    }
  }
</style>
