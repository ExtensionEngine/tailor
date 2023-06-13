<template>
  <tailor-dialog
    v-model="isVisible"
    width="640"
    header-icon="mdi-image"
    eager>
    <template #header>Change Avatar</template>
    <template #body>
      <v-row justify="center">
        <croppa
          ref="croppa"
          @file-choose="isVisible = true"
          v-bind="options"
          prevent-white-space />
      </v-row>
    </template>
    <template #actions>
      <v-btn @click="close" text>Cancel</v-btn>
      <v-btn @click="confirm" color="primary darken-4" text>
        Update
      </v-btn>
    </template>
  </tailor-dialog>
</template>

<script>
import TailorDialog from '@/components/common/TailorDialog.vue';

const AVATAR_OPTS = { compressionRate: 0.6, mimetype: 'image/jpeg' };

export default {
  name: 'avatar-dialog',
  props: {
    imgUrl: { type: String, required: true }
  },
  data() {
    return { isVisible: false };
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
      this.isVisible = false;
    },
    confirm() {
      const { mimetype, compressionRate } = AVATAR_OPTS;
      const imgUrl = this.$refs.croppa.generateDataUrl(mimetype, compressionRate);
      this.$emit('update', imgUrl);
      this.close();
    }
  },
  components: { TailorDialog }
};
</script>

<style lang="scss" scoped>
$image-border: 8px solid #e3e3e3;
$image-bg-color: #f5f5f5;
$image-width: 15rem;
$image-height: 15rem;

.croppa-container {
  width: $image-width;
  height: $image-height;
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
