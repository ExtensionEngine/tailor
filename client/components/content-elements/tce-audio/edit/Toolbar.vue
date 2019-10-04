<template>
  <div class="tce-audio-toolbar">
    <v-text-field
      v-model="url"
      :disabled="!edit"
      hide-details
      single-line
      label="URL" />
    <v-btn
      v-if="edit"
      @click="save"
      small
      color="success"
      type="button">
      Save
    </v-btn>
    <v-btn
      v-else
      @click="edit = true"
      small
      type="button">
      Edit
    </v-btn>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';

export default {
  name: 'tce-audio-toolbar',
  props: {
    element: { type: Object, required: true }
  },
  data() {
    return {
      url: '',
      edit: !this.element.data.url,
      ...cloneDeep(this.element.data)
    };
  },
  methods: {
    save() {
      this.edit = false;
      const element = cloneDeep(this.element);
      element.data.url = this.url;
      this.$emit('save', element);
    }
  }
};
</script>

<style lang="scss" scoped>
.tce-audio-toolbar {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 999;
  width: 100%;
  height: 60px;
  padding: 0 30px 0 10px;

  .v-input {
    max-width: 500px;
    margin-top: 0;
    margin-right: 16px;
    padding: 0;
  }
}
</style>
