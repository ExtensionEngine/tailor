<template>
  <div>
    <v-toolbar
      height="42"
      color="blue-grey darken-3"
      absolute
      class="heading elevation-2">
      <tailor-chip
        color="blue-grey lighten-3"
        small
        class="ml-1 px-7 body-2">
        Profile
      </tailor-chip>
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
import TailorChip from '@/components/common/TailorChip';
import UserAvatar from './Avatar';
import UserInfo from './Info';

export default {
  name: 'user-settings',
  components: {
    ChangePasswordDialog,
    TailorChip,
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
