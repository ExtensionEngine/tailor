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
        class="readonly ml-1 px-7 body-2">
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
import ChangePasswordDialog from './ChangePasswordDialog';
import UserAvatar from './Avatar';
import UserInfo from './Info';

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
  width: 100%;
  text-align: left;
  text-transform: uppercase;
  z-index: 2;
}

.user-panel {
  position: relative;
  max-width: 50rem;
  margin-top: 3.5rem;
}
</style>
