<template>
  <v-layout justify-center pb-3>
    <v-avatar size="150px">
      <div class="img-container">
        <img v-if="image" :src="image">
        <v-icon v-else size="142px" color="grey">mdi-account</v-icon>
        <v-icon
          @click="dialog = true"
          dark
          size="36px"
          class="overlay">
          mdi-camera
        </v-icon>
      </div>
    </v-avatar>
    <avatar-dialog
      @update="updateAvatar"
      :visible.sync="dialog"
      :img-url="image" />
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import AvatarDialog from './AvatarDialog';

export default {
  name: 'user-avatar',
  data() {
    return { dialog: false };
  },
  computed: {
    ...mapState({ user: state => state.auth.user }),
    image() {
      return this.user.imgUrl;
    }
  },
  methods: {
    ...mapActions(['updateInfo']),
    updateAvatar(imgUrl) {
      return this.updateInfo({ imgUrl }).then(() => {
        this.$snackbar.show('Your profile picture has been updated!');
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
