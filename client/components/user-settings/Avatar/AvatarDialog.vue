<template>
  <tailor-dialog
    v-model="isVisible"
    width="640"
    header-icon="mdi-image"
    eager>
    <template v-slot:header>Change Avatar</template>
    <template v-slot:body>
      <v-row justify="center">
        <croppa
          ref="croppa"
          @file-choose="isVisible = true"
          v-bind="options"
          prevent-white-space />
      </v-row>
    </template>
    <template v-slot:actions>
      <v-btn @click="close" text>Cancel</v-btn>
      <v-btn @click="confirm" color="primary darken-4" text>
        Update
      </v-btn>
    </template>
  </tailor-dialog>
</template>

<script>
import TailorDialog from '@/components/common/TailorDialog';

const AVATAR_OPTS = { compressionRate: 0.6, mimetype: 'image/jpeg' };

export default {
  name: 'avatar-dialog',
  inject: ['$storageService'],
  props: {
    imgUrl: { type: String, required: true }
  },
  data: () => ({ isVisible: false }),
  computed: {
    options: () => ({
      accept: 'image/*',
      width: 220,
      height: 220
    })
  },
  methods: {
    close() {
      this.isVisible = false;
    },
    async confirm() {
      const { mimetype, compressionRate } = AVATAR_OPTS;
      const blob = await this.$refs.croppa.promisedBlob(mimetype, compressionRate);
      const formData = new FormData();
      formData.append('file', blob);
      const { key } = await this.$storageService.uploadAvatar(formData);
      this.$emit('update', key);
      this.close();
    }
  },
  components: { TailorDialog }
};
</script>

<style lang="scss" scoped>
$image-border: 8px solid #e3e3e3;
$image-bg-color: #f5f5f5;
$image-size: 15rem;

.croppa-container {
  width: $image-size;
  height: $image-size;
  background-color: $image-bg-color;
  border: $image-border;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;

  &.croppa--has-target {
    ::v-deep {
      canvas {
        width: 100% !important;
        height: inherit !important;
      }
    }

    &:active { cursor: grab; }
    &.croppa--disabled { cursor: auto; }
  }
}
</style>
