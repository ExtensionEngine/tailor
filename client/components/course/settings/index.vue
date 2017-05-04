<template>
  <div class="main-container">
    <div class="list-group table-of-contents">
      <router-link
        :class="{ selected: $route.name === 'general' }"
        :to="{ name: 'general' }"
        class="list-group-item">
        <span class="mdi mdi-wrench"></span>General
      </router-link>
      <router-link
        :class="{ selected: $route.name === 'user-management' }"
        :to="{ name: 'user-management' }"
        class="list-group-item">
        <span class="mdi mdi-account"></span>User Management
      </router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import General from './General';
import UserManagement from './UserManagement';

export default {
  data() {
    return {
      generalSelected: true
    };
  },
  components: {
    General,
    UserManagement
  }
};
</script>

<style lang="scss" scoped>
.list-group {
  float: left;
  width: 19%;
  margin: 75px 10px 0 60px;
  padding: 10px 10px 350px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  line-height: 32px;
  background-color: white;

  .list-group-item {
    margin-bottom: 2px;
    padding: 10px;
    border: 0px;
    cursor: pointer;
    text-align: left;

    &:hover, &.selected {
      background-color: #f9f9f9;
    }
  }
}

.mdi {
  float: left;
  margin: 0 30px;
  font-size: 20px;
}
</style>
