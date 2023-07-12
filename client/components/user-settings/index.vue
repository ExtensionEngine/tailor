<template>
  <div>
    <v-toolbar
      height="42"
      color="primary darken-3"
      absolute
      class="heading elevation-2">
      <v-chip
        color="primary lighten-3"
        text-color="black"
        small
        class="readonly ml-1 px-7 text-body-2">
        Profile
      </v-chip>
    </v-toolbar>
    <v-container class="user-panel">
      <v-row no-gutters>
        <v-spacer />
        <change-password-dialog />
      </v-row>
      <v-row>
        <v-col>
          <user-avatar />
          <user-info />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ChangePasswordDialog from './ChangePasswordDialog.vue';
import UserAvatar from './Avatar/index.vue';
import UserInfo from './Info.vue';

export default {
  name: 'user-settings',
  components: {
    ChangePasswordDialog,
    UserAvatar,
    UserInfo
  }
};
</script>

<style lang="scss" scoped>
.heading {
  z-index: 2;
  width: 100%;
  text-align: left;
  text-transform: uppercase;
}

.user-panel {
  position: relative;
  margin-top: 3.5rem;
  max-width: 50rem;
}
</style>
