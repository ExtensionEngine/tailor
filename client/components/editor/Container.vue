<template>
  <div class="course-editor">
    <div class="row">
      <div class="col-md-2">
        <course-sidebar></course-sidebar>
      </div>
      <div class="col-md-10 col-md-offset-2 content">
        <div>
          <div class="row heading">
            <div class="col-md-12">
              <h2>{{ activity.name }}</h2>
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
import { mapGetters } from 'vuex-module';
import CourseSidebar from './Sidebar';
import CubeSpinner from '../loaders/CubeSpinner';

export default {
  name: 'course-edit',
  computed: mapGetters(['activity'], 'editor'),
  components: {
    CourseSidebar,
    CubeSpinner
  }
};
</script>

<style lang="scss">
.course-editor {
  .content {
    margin-left: 15%;
    width: 70%;

    h2 {
      float: left;
      font-size: 32px;
      font-weight: 600;
      margin: 0;
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
