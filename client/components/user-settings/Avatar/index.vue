<template>
  <v-row justify="center" class="pb-3">
    <v-speed-dial direction="right">
      <template #activator>
        <v-avatar size="150">
          <div class="img-container">
            <img :src="image">
            <v-icon
              dark large
              class="overlay">
              mdi-camera
            </v-icon>
          </div>
        </v-avatar>
      </template>
      <v-btn
        @click="selectAvatar"
        color="primary darken-3"
        fab dark small>
        <v-icon>mdi-upload</v-icon>
      </v-btn>
      <v-btn
        v-if="!isGravatar"
        @click="deleteAvatar"
        color="secondary lighten-1"
        fab dark small>
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-speed-dial>
    <avatar-dialog
      ref="avatarDialog"
      @update="updateAvatar"
      :img-url="image" />
  </v-row>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import AvatarDialog from './AvatarDialog';
import { mapRequests } from '@extensionengine/vue-radio';

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
    ...mapRequests('app', ['showConfirmationModal']),
    selectAvatar() {
      this.$refs.avatarDialog.$refs.croppa.chooseFile();
    },
    updateAvatar(imgUrl) {
      return this.updateInfo({ imgUrl }).then(() => {
        this.$snackbar.show('Your profile picture has been updated!');
      });
    },
    deleteAvatar() {
      this.showConfirmationModal({
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

.v-avatar ::v-deep {
  .img-container {
    position: relative;
    height: $image-height;
  }

  img, .v-icon {
    background-color: $image-bg-color;
    border: $image-border;
    border-radius: 50%;
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
