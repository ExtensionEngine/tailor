<template>
  <div>
    <div class="heading primary elevation-3">
      <v-chip
        color="grey lighten-2"
        label outlined
        class="mt-2 ml-3 px-3 body-2">
        Profile
      </v-chip>
    </div>
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
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 46px;
  color: #444;
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
