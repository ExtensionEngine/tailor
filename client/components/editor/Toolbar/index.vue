<template>
  <div class="toolbar-wrapper">
    <div
      v-show="activity"
      class="activity-toolbar primary elevation-1">
      <activity-actions class="activity-actions" />
      <h1 class="headline text-truncate pt-2">
        <span>{{ config.label }}</span> - {{ activity.data.name }}
      </h1>
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
import ActivityActions from './ActivityActions';
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
  components: { ActivityActions, ElementToolbar }
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
  height: 3.125rem;
  padding: 0 0.375rem 0 0;
  z-index: 999;

  h1 {
    flex: 1;
    margin: 0;
    color: #fff;
    font-size: 1.375rem;
    text-align: left;
  }
}

.activity-actions {
  max-width: 11.25rem;
  margin-top: 0.0625rem;
}
</style>
