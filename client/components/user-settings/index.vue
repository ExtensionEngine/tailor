<template>
  <div class="user-info-container white">
    <div class="heading primary elevation-5">
      <v-chip
        color="grey lighten-2"
        label
        outlined
        class="mt-2 ml-3 px-3 body-2">
        Profile
      </v-chip>
    </div>
    <v-container>
      <v-row justify="center">
        <v-col class="lg8 xl6">
          <v-card>
            <div class="primary">
              <v-row class="pt-3 px-6">
                <v-spacer />
                <change-password-dialog />
              </v-row>
              <user-avatar />
            </div>
            <user-info />
          </v-card>
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
.user-info-container {
  padding: 50px;
}

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
</style>
