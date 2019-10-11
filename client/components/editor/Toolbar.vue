<template>
  <div class="toolbar-wrapper">
    <div
      v-show="activity"
      class="activity-toolbar primary elevation-1">
      <v-chip :color="config.color" label dark class="mr-3">
        {{ config.label }}
      </v-chip>
      <h1 class="text-truncate">{{ activity.data.name }}</h1>
    </div>
    <element-toolbar
      v-if="element && element.parent"
      :key="`${element.parent._cid}-${element.id}`"
      :element="element.parent"
      :embed="element">
      <template slot="embed-toolbar">
        <element-toolbar :element="element" />
      </template>
      <template slot="actions">
        <slot name="actions"></slot>
      </template>
    </element-toolbar>
    <element-toolbar
      v-else-if="element"
      :key="element._cid || element.id"
      :element="element">
      <template slot="actions">
        <slot name="actions"></slot>
      </template>
    </element-toolbar>
  </div>
</template>

<script>
import { ElementToolbar } from 'tce-core';
import { getLevel } from 'shared/activities';
import { mapGetters } from 'vuex';

export default {
  name: 'editor-toolbar',
  props: {
    element: { type: Object, default: null }
  },
  computed: {
    ...mapGetters('editor', ['activity']),
    config() {
      return getLevel(this.activity.type);
    }
  },
  components: { ElementToolbar }
};
</script>

<style lang="scss" scoped>
.toolbar-wrapper {
  position: fixed;
  width: 100%;
  z-index: 99;
}

.activity-toolbar {
  display: flex;
  height: 50px;
  padding: 0 5px;
  z-index: 999;

  .v-chip {
    max-width: 300px;
    height: 26px;
    margin: 12px 10px;
    font-size: 13px;
    font-weight: 500;
    text-transform: uppercase;
  }

  h1 {
    flex: 1;
    margin: 0;
    padding-top: 13px;
    color: #fff;
    font-size: 22px;
    font-weight: 300;
    text-align: left;
  }
}
</style>
