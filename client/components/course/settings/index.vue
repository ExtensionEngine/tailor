<template>
  <div class="main-container">
    <div class="list-group table-of-contents">
      <a
        class="list-group-item"
        @click="generalSelected = true"
        :class="{ selected: generalSelected }">
        <span class="mdi mdi-wrench"></span>
        General
      </a>
      <a
        class="list-group-item"
        @click="generalSelected = false"
        :class="{ selected: !generalSelected }">
        <span class="mdi mdi-account"></span>
        User management
      </a>
    </div>
    <course-details v-if="generalSelected"></course-details>
    <user-management v-else></user-management>
  </div>
</template>

<script>
import CourseDetails from '../CourseDetails';
import UserManagement from './UserManagement';

export default {
  data() {
    return {
      generalSelected: true
    };
  },
  components: {
    CourseDetails,
    UserManagement
  }
};
</script>

<style lang="scss" scoped>
.list-group {
  line-height: 32px;
  display: inline-block;
  float: left;
  margin: 75px 10px 0 60px;
  width: 19%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  padding: 10px 10px 350px 10px;
  background-color: white;

  .list-group-item {
    padding: 10px 0;
    margin-bottom: 1px;
    border: 0px;
    border-radius: 0;
    text-align: left;

    &.selected {
      background-color: #f9f9f9;
    }
  }
}

.settings {
  display: inline-block;
  float: right;
  width: 71%;
  margin: 75px 75px 40px 0px;
  padding: 30px 30px 10px 30px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}

.mdi {
  float: left;
  margin: 0 30px;
  font-size: 20px;
}
</style>
