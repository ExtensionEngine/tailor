<template>
  <user-management
    :users="users"
    :roles="roles"
    :isRequesting="isRequesting"
    @upsert="upsert"
    @remove="remove"
    roleType="courseRole"/>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
import map from 'lodash/map';
import { role } from 'shared';
import { title as titleCase } from 'to-case';
import UserManagement from 'components/common/UserManagement';

export default {
  props: {
    courseId: { type: Number, required: true }
  },
  data() {
    return {
      isRequesting: true
    };
  },
  computed: {
    ...mapGetters(['users'], 'course'),
    roles() {
      return map(role.course, it => ({
        text: titleCase(it.replace('COURSE', '')),
        value: it
      }));
    }
  },
  methods: {
    ...mapActions(['getUsers', 'upsertUser', 'removeUser'], 'course'),
    upsert(email, role) {
      const { courseId } = this;
      this.isRequesting = true;
      this.upsertUser({ email, role, courseId }).then(() => (this.isRequesting = false));
    },
    remove({ id: userId }) {
      const { courseId } = this;
      this.isRequesting = true;
      this.removeUser({ userId, courseId }).then(() => (this.isRequesting = false));
    }
  },
  created() {
    this.getUsers().then(() => (this.isRequesting = false));
  },
  components: {
    UserManagement
  }
};
</script>
