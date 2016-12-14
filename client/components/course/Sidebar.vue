<template>
  <div class="sidebar">
    <ul>
      <li>
        <router-link :to="{ name: 'course-details', params: { courseId } }">
          <span class="fa fa-2x fa-cubes"></span>
        </router-link>
      </li>

      <li>
        <router-link :to="{ name: 'course-settings', params: { courseId } }">
          <span class="fa fa-2x fa-cog"></span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'course-sidebar',

    computed: {
      courseId() {
        return this.$route.params.courseId;
      }
    }
  };
</script>

<style lang="scss">
  .sidebar {
    background-color: #fff;
    border-right: 1px solid #eee;
    box-shadow: 0 1px 4px rgba(0, 0, 0, .74);
    bottom: 0;
    display: block;
    padding: 0;
    position: fixed;
    top: 50px;
    width: 80px;
    z-index: 1;

    .row:before {
      display: inline;
    }

    ul {
      list-style: none;
      padding: 0;

      li > a {
        color: #000;
        cursor: pointer;
        display: block;
        height: 100%;
        padding: 20px 10px;
        width: 100%;

        &:hover {
          background-color: #eee;
        }
      }
    }
  }
</style>
