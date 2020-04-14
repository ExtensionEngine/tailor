<template>
  <v-toolbar height="72" class="tce-brightcove-toolbar">
    <v-toolbar-title>Brightcove Video</v-toolbar-title>
    <v-toolbar-items class="mx-auto">
      <v-text-field
        v-model="accountId"
        :disabled="!edit"
        label="Account Id"
        placeholder="Account Id..."
        filled dense hide-details
        class="mt-2 mr-3" />
      <v-text-field
        v-model="playerId"
        :disabled="!edit"
        label="Player Id"
        placeholder="Player Id..."
        filled dense hide-details
        class="mt-2 mr-3" />
      <v-text-field
        v-model="videoId"
        :disabled="!edit"
        label="Video Id"
        placeholder="Video Id..."
        filled dense hide-details
        class="mt-2 mr-3" />
      <v-btn v-if="!edit" @click="edit = true" text>
        Edit
      </v-btn>
      <v-btn v-if="edit" @click="save" text>
        Save
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
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
.tce-brightcove-toolbar ::v-deep .v-btn__content {
  min-width: 2.75rem;
}

.v-toolbar__title {
  min-width: 23.875rem;
  text-align: left;
}
</style>
