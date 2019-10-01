<template>
  <div class="tce-brightcove-toolbar">
    <v-text-field
      v-model="accountId"
      :disabled="!edit"
      single-line
      hide-details
      placeholder="Account Id" />
    <v-text-field
      v-model="playerId"
      :disabled="!edit"
      single-line
      hide-details
      placeholder="Player Id" />
    <v-text-field
      v-model="videoId"
      :disabled="!edit"
      single-line
      hide-details
      placeholder="Video Id" />
    <v-btn
      v-if="!edit"
      @click="edit = true"
      small
      type="button">
      Edit
    </v-btn>
    <v-btn
      v-if="edit"
      @click="save"
      small
      color="success"
      type="button">
      Save
    </v-btn>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';

const props = ['accountId', 'playerId', 'videoId'];

export default {
  name: 'tce-brightcove-toolbar',
  props: {
    element: { type: Object, required: true }
  },
  data() {
    return {
      edit: isEmpty(pick(this.element.data, props)),
      accountId: '',
      playerId: '',
      videoId: '',
      ...cloneDeep(this.element.data)
    };
  },
  methods: {
    save() {
      this.edit = false;
      const element = cloneDeep(this.element);
      Object.assign(element.data, pick(this, props));
      this.$emit('save', element);
    }
  }
};
</script>

<style lang="scss" scoped>
.tce-brightcove-toolbar {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 999;
  width: 100%;
  height: 60px;
  padding: 0 30px 0 10px;

  .v-input {
    max-width: 250px;
    margin-top: 0;
    margin-right: 16px;
    padding: 0;
  }
}
</style>
