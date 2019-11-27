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
            <user-security />
            <user-avatar />
            <v-divider />
            <user-info />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import UserAvatar from './Avatar';
import UserInfo from './Info';
import UserSecurity from './Security';

export default {
  name: 'user-settings',
  components: { UserAvatar, UserInfo, UserSecurity }
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
