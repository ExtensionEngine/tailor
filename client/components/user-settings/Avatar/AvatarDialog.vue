<template>
  <v-dialog v-model="show" width="640">
    <v-card>
      <v-card-title class="headline">
        <v-avatar color="primary" size="38" class="mr-2">
          <v-icon color="white">mdi-image</v-icon>
        </v-avatar>
        Change Avatar
        <v-spacer />
        <v-menu
          offset-y
          left
          min-width="120px"
          transition="slide-y-transition">
          <v-btn
            slot="activator"
            color="primary"
            outline
            flat>
            <v-icon small class="mr-1">mdi-pencil</v-icon>Edit
          </v-btn>
          <v-list>
            <v-list-tile class="pa-0">
              <v-btn
                @click="remove"
                :disabled="disableRemove"
                color="primary"
                flat>
                <v-icon small class="mr-1">mdi-eraser</v-icon>Remove
              </v-btn>
            </v-list-tile>
            <v-list-tile class="pa-0">
              <v-btn @click="upload" color="primary" flat>
                <v-icon small class="mr-1">mdi-upload</v-icon>Upload
              </v-btn>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-card-title>
      <v-card-text>
        <v-layout justify-center>
          <croppa
            v-model="croppa"
            @new-image="disabled = false"
            v-bind="options"
            :initial-image="imgUrl"
            prevent-white-space />
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-layout pb-3 pr-3>
          <v-spacer />
          <v-btn @click="close" flat color="primary">Cancel</v-btn>
          <v-btn
            @click="confirm"
            :disabled="disabled"
            outline
            color="primary">
            Update
          </v-btn>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { avatar as avatarOpts } from 'shared';
// import gravatar from 'gravatar';

// const gravatarConfig = { size: 130, default: 'mp' };

export default {
  name: 'avatar-dialog',
  props: {
    visible: { type: Boolean, default: false },
    imgUrl: { type: String, default: null }
  },
  data() {
    return {
      croppa: null,
      image: null,
      disabled: true
    };
  },
  computed: {
    options: vm => ({
      accept: 'image/*',
      width: 220,
      height: 220
    }),
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) this.close();
      }
    },
    disableRemove() {
      return this.croppa && !this.croppa.hasImage();
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false);
    },
    remove() {
      this.croppa.remove();
      this.disabled = false;
    },
    upload() {
      this.croppa.chooseFile();
    },
    confirm() {
      const { mimetype, compressionRate } = avatarOpts;
      const imgUrl = this.croppa.generateDataUrl(mimetype, compressionRate);
      this.$emit('update', imgUrl);
      this.close();
    }
  },
  watch: {
    visible(val) {
      if (val) this.croppa.refresh();
      this.disabled = true;
    }
  }
};
</script>

<style lang="scss" scoped>
$image-border: 8px solid #e3e3e3;
$image-bg-color: #f5f5f5;
$image-width: 240px;
$image-height: 240px;

.croppa-container {
  overflow: hidden;
  border-radius: 50%;
  width: $image-width;
  height: $image-height;
  background-color: $image-bg-color;
  border: $image-border;
  cursor: pointer;

  &.croppa--has-target {
    /deep/ {
      canvas {
        width: 100% !important;
        height: 224px !important;
      }
    }

    &:active { cursor: grab; }
    &.croppa--disabled { cursor: auto; }
  }
}

.v-list {
  padding: 0;

  /deep/ .v-list__tile {
    padding: 0;
  }
}
</style>
