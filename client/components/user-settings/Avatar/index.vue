<template>
  <v-layout justify-center pb-3>
    <v-speed-dial direction="right">
      <v-avatar slot="activator" size="150px">
        <div class="img-container">
          <img :src="image">
          <v-icon
            dark
            large
            class="overlay">
            mdi-camera
          </v-icon>
        </div>
      </v-avatar>
      <v-btn @click="selectAvatar" fab dark small color="primary">
        <v-icon>mdi-upload</v-icon>
      </v-btn>
      <v-btn
        @click="deleteAvatar"
        :disabled="isGravatar"
        fab
        dark
        small
        color="secondary">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-speed-dial>
    <avatar-dialog
      ref="avatarDialog"
      @update="updateAvatar"
      :img-url="image" />
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import AvatarDialog from './AvatarDialog';
import EventBus from 'EventBus';

const appChannel = EventBus.channel('app');

const isGravatar = img => /gravatar.com/.test(img);

export default {
  name: 'user-avatar',
  computed: {
    ...mapState({ user: state => state.auth.user }),
    image: vm => vm.user.imgUrl,
    isGravatar: vm => isGravatar(vm.image)
  },
  methods: {
    ...mapActions(['updateInfo']),
    selectAvatar() {
      this.$refs.avatarDialog.$refs.croppa.chooseFile();
    },
    updateAvatar(imgUrl) {
      return this.updateInfo({ imgUrl }).then(() => {
        this.$snackbar.show('Your profile picture has been updated!');
      });
    },
    deleteAvatar() {
      appChannel.emit('showConfirmationModal', {
        title: 'Delete avatar?',
        message: 'Are you sure you want to delete your profile picture?',
        action: () => this.updateAvatar(null)
      });
    }
  },
  components: { AvatarDialog }
};
</script>

<style lang="scss" scoped>
$image-border: 4px solid #e3e3e3;
$image-bg-color: #f5f5f5;
$image-width: 150px;
$image-height: 150px;

.v-avatar {
  .img-container {
    position: relative;
    height: $image-height;
  }

  img, .v-icon {
    background-color: $image-bg-color;
    border: $image-border;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: $image-width;
    background: #607d8b;
    opacity: 0.7;
    cursor: pointer;
  }

  &:not(:hover) .overlay { display: none; }
}
</style>
