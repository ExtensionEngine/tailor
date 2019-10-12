<template>
  <img ref="img" :src="src" :style="style" :alt="alt">
</template>

<script>
import assign from 'lodash/assign';
import Cropper from 'cropperjs';
import omit from 'lodash/omit';

// Forked from https://github.com/Agontuk/vue-cropperjs/blob/master/VueCropper.js
// Cropperjs docs: https://github.com/fengyuanchen/cropperjs
export default {
  name: 'cropper',
  props: {
    containerStyle: { type: Object, default: null },
    data: { type: Object, default: null },
    preview: { type: String, default: null },
    src: { type: String, default: '' },
    alt: { type: String, default: null },
    dragMode: { type: String, default: null },
    responsive: { type: Boolean, default: true },
    restore: { type: Boolean, default: true },
    checkCrossOrigin: { type: Boolean, default: true },
    checkOrientation: { type: Boolean, default: true },
    cropBoxMovable: { type: Boolean, default: true },
    cropBoxResizable: { type: Boolean, default: true },
    toggleDragModeOnDblclick: { type: Boolean, default: true },
    modal: { type: Boolean, default: true },
    center: { type: Boolean, default: true },
    highlight: { type: Boolean, default: true },
    zoomOnTouch: { type: Boolean, default: true },
    zoomOnWheel: { type: Boolean, default: true },
    scalable: { type: Boolean, default: true },
    zoomable: { type: Boolean, default: true },
    guides: { type: Boolean, default: true },
    background: { type: Boolean, default: true },
    autoCrop: { type: Boolean, default: true },
    movable: { type: Boolean, default: true },
    rotatable: { type: Boolean, default: true },
    viewMode: { type: Number, default: null },
    aspectRatio: { type: Number, default: null },
    autoCropArea: { type: Number, default: null },
    wheelZoomRatio: { type: Number, default: null },
    // Size limitation
    minCanvasWidth: { type: Number, default: null },
    minCanvasHeight: { type: Number, default: null },
    minCropBoxWidth: { type: Number, default: null },
    minCropBoxHeight: { type: Number, default: null },
    minContainerWidth: { type: Number, default: null },
    minContainerHeight: { type: Number, default: null },
    // Callbacks
    ready: { type: Function, default: null },
    cropstart: { type: Function, default: null },
    cropmove: { type: Function, default: null },
    cropend: { type: Function, default: null },
    crop: { type: Function, default: null }
  },
  computed: {
    style() {
      return assign({ 'max-width': '100%' }, this.containerStyle);
    }
  },
  methods: {
    show() {
      // Event handler and crop function share the same name
      return this.cropper.crop();
    },
    reset() {
      return this.cropper.reset();
    },
    clear() {
      return this.cropper.clear();
    },
    replace(url, onlyColorChanged) {
      return this.cropper.replace(url, onlyColorChanged);
    },
    enable() {
      return this.cropper.enable();
    },
    disable() {
      return this.cropper.disable();
    },
    destroy() {
      return this.cropper.destroy();
    },
    move(offsetX, offsetY) {
      return this.cropper.move(offsetX, offsetY);
    },
    moveTo(x, y) {
      return this.cropper.moveTo(x, y);
    },
    zoom(ratio, _originalEvent) {
      return this.cropper.zoom(ratio, _originalEvent);
    },
    zoomTo(ratio, _originalEvent) {
      return this.cropper.zoomTo(ratio, _originalEvent);
    },
    rotate(degree) {
      return this.cropper.rotate(degree);
    },
    rotateTo(degree) {
      return this.cropper.rotateTo(degree);
    },
    scale(scaleX, scaleY) {
      return this.cropper.scale(scaleX, scaleY);
    },
    scaleX(_scaleX) {
      return this.cropper.scaleX(_scaleX);
    },
    scaleY(_scaleY) {
      return this.cropper.scaleY(_scaleY);
    },
    getData(rounded) {
      return this.cropper.getData(rounded);
    },
    setData(data) {
      return this.cropper.setData(data);
    },
    getContainerData() {
      return this.cropper.getContainerData();
    },
    getImageData() {
      return this.cropper.getImageData();
    },
    getCanvasData() {
      return this.cropper.getCanvasData();
    },
    setCanvasData(data) {
      return this.cropper.setCanvasData(data);
    },
    getCropBoxData() {
      return this.cropper.getCropBoxData();
    },
    setCropBoxData(data) {
      return this.cropper.setCropBoxData(data);
    },
    getCroppedCanvas(options) {
      return this.cropper.getCroppedCanvas(options);
    },
    setAspectRatio(aspectRatio) {
      return this.cropper.setAspectRatio(aspectRatio);
    },
    setDragMode() {
      return this.cropper.setDragMode();
    }
  },
  mounted() {
    const props = {};
    const data = omit(this.$options.props, ['containerStyle', 'src', 'alt']);
    for (const key in data) {
      if (this[key] !== undefined) {
        props[key] = this[key];
      }
    }
    this.cropper = new Cropper(this.$refs.img, props);
  }
};
</script>

<style lang="scss">
@import '~cropperjs/dist/cropper.min.css';
</style>
