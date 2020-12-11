<template>
  <div class="toolbar-wrapper">
    <div v-show="activity" class="activity-toolbar blue-grey darken-3">
      <activity-actions class="activity-actions" />
      <h1 class="pt-2 headline text-truncate">
        <span>{{ config.label }}</span>
        <span class="px-2 grey--text">|</span>
        <span class="secondary--text text--lighten-2">
          {{ activity.data.name }}
        </span>
      </h1>
      <active-users :users="activeUsers" class="mx-6" />
    </div>
    <element-toolbar
      v-if="element && element.parent"
      :key="`${element.parent.uid}-${element.id}`"
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
      :key="getElementId(element)"
      :element="element">
      <template slot="actions">
        <slot name="actions"></slot>
      </template>
    </element-toolbar>
  </div>
</template>

<script>
import ActiveUsers from 'tce-core/ActiveUsers';
import ActivityActions from './ActivityActions';
import { ElementToolbar } from 'tce-core';
import { getElementId } from 'tce-core/utils';
import { getLevel } from 'shared/activities';
import { mapGetters } from 'vuex';

export default {
  name: 'editor-toolbar',
  props: {
    element: { type: Object, default: null },
    activeUsers: { type: Array, default: () => [] }
  },
  computed: {
    ...mapGetters('editor', ['activity']),
    config() {
      return getLevel(this.activity.type);
    }
  },
  methods: {
    getElementId
  },
  components: { ActivityActions, ActiveUsers, ElementToolbar }
};
</script>

<style lang="scss" scoped>
.toolbar-wrapper {
  width: 100%;

  ::v-deep .v-text-field__details {
    margin: 0 !important;
    padding: 0 !important;

    .primary--text {
      opacity: 0;
    }

    .error--text {
      position: absolute;
      margin-top: 0.125rem;
      padding: 0.5rem;
      color: #fff !important;
      background-color: #3a3a3a;
      border-radius: 4px;
    }
  }
}

.activity-toolbar {
  display: flex;
  height: 3.125rem;
  padding: 0;
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
  max-width: 10.75rem;
}
</style>
