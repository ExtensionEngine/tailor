<template>
  <v-dialog v-model="visible" width="640">
    <v-card>
      <v-card-title class="headline">
        <v-avatar color="primary" size="38" class="mr-2">
          <v-icon color="white">mdi-image</v-icon>
        </v-avatar>
        Change Avatar
      </v-card-title>
      <v-card-text>
        <v-layout justify-center>
          <croppa
            ref="croppa"
            @file-choose="visible = true"
            v-bind="options"
            prevent-white-space />
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-layout pb-3 pr-3>
          <v-spacer />
          <v-btn @click="close" flat>Cancel</v-btn>
          <v-btn @click="confirm" outline>
            Update
          </v-btn>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { avatar as avatarOpts } from 'shared';

export default {
  name: 'avatar-dialog',
  props: {
    imgUrl: { type: String, required: true }
  },
  data() {
    return { visible: false };
  },
  computed: {
    options: vm => ({
      accept: 'image/*',
      width: 220,
      height: 220
    })
  },
  methods: {
    close() {
      this.visible = false;
    },
    confirm() {
      const { mimetype, compressionRate } = avatarOpts;
      const imgUrl = this.$refs.croppa.generateDataUrl(mimetype, compressionRate);
      this.$emit('update', imgUrl);
      this.close();
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
        height: inherit !important;
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
