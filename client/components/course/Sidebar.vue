<template>
  <div class="course-sidebar">
    <h3 class="title">{{ activity.name }}</h3>

    <ul>
      <li>
        <router-link :to="{ name: 'course-details', params: { courseId } }">
          <span class="fa fa-2x fa-cubes"></span>
        </router-link>
      </li>

      <permission-wrapper :perms="perms">
        <li>
            <router-link :to="{ name: 'course-settings', params: { courseId } }">
              <span class="fa fa-2x fa-cog"></span>
            </router-link>
        </li>
      </permission-wrapper>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex-module';
import Permissions from '../../utils/perms';
import PermissionWrapper from '../common/PermissionWrapper';

export default {
  name: 'course-sidebar',

  components: {
    'permission-wrapper': PermissionWrapper
  },

  computed: {
    ...mapGetters(['activity'], 'editor'),
    courseId() {
      return this.$route.params.courseId;
    },
    perms() {
      const { isGlobalAdmin, isCourseAdmin } = Permissions;
      return [isGlobalAdmin, isCourseAdmin];
    }
  }
};
</script>

<style lang="scss">
.course-sidebar {
  width: 400px;
  height: 100%;
  position: fixed;
  right: 0;
  padding: 30px 20px;
  border-top: 1px solid #e8e8e8;
  background-color: #fcfcfc;

  .title {
    text-align: left;
    font-size: 18px;
  }
}
</style>
