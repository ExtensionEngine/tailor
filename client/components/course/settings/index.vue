<template>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-3">
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
        </div>
        <div class="col-md-9">
          <router-view></router-view>
        </div>
      </div>
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
.row {
  margin: 60px 30px 5px;
}

.list-group {
  padding: 10px 10px 344px;
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
  margin-right: 15%;
  margin-left: 5%;
  font-size: 20px;
}
</style>
