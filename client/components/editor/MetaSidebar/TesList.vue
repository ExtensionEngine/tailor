<template>
  <div>
    <circular-progress v-if="isFetching" />
    <div v-else>
      <v-alert v-if="!hasAvailableElements" type="warning">
        No available elements.
      </v-alert>
      <div v-for="{ id } in contentContainers" :key="id">
        <div
          v-for="item in getTes(id)"
          :key="item.id"
          @click="toggleSelection(item)"
          class="tes-wrapper">
          <v-checkbox
            v-model="selected"
            @click.prevent
            :disabled="isDisabled(item)"
            :value="{ outlineId, containerId: item.activityId, id: item.id }" />
          <teaching-element
            disabled
            :class="{ 'selected': isSelected(item)}"
            :element="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CircularProgress from 'components/common/CircularProgress';
import { delay } from 'bluebird';
import find from 'lodash/find';
import repositoryApi from 'client/api/repository';
import sortBy from 'lodash/sortBy';
import TeachingElement from 'components/editor/TeachingElement';
import xorBy from 'lodash/xorBy';

export default {
  name: 'relationship-tes-list',
  props: {
    contentContainers: { type: Array, required: true },
    outlineId: { type: Number, required: true },
    repositoryId: { type: Number, required: true },
    elementId: { type: Number, required: true },
    allowedTypes: { type: Array, required: true },
    multiple: { type: Boolean, required: true },
    selected: { type: Array, default: () => [] }
  },
  data: () => ({
    tes: [],
    isFetching: false
  }),
  computed: {
    hasAvailableElements: ({ tes, allowedTypes }) =>
      tes.filter(te => allowedTypes.includes(te.type)).length
  },
  methods: {
    getTes(id) {
      return sortBy(
        this.tes.filter(({ activityId }) => activityId === id),
        'position'
      );
    },
    toggleSelection({ activityId: containerId, id, type }) {
      if (this.isDisabled({ id, type })) return;
      const { outlineId } = this;
      const selected = xorBy(this.selected, [{ outlineId, containerId, id }], 'id');
      this.$emit('change', selected);
    },
    isSelected({ id }) {
      return !!find(this.selected, { id });
    },
    isDisabled({ id, type }) {
      const { multiple, selected, elementId, allowedTypes } = this;
      if (!allowedTypes.includes(type) || id === elementId) return true;
      if (multiple) return false;
      return selected.length === 1 && selected[0].id !== id;
    }
  },
  watch: {
    contentContainers: {
      handler() {
        const { contentContainers, repositoryId } = this;
        const ids = contentContainers.map(({ id }) => id);
        this.isFetching = true;
        return Promise.all([
          repositoryApi.getContentElements({ id: repositoryId, ids }),
          delay(700)
        ]).then(([tes]) => { this.tes = tes; })
        .finally(() => { this.isFetching = false; });
      },
      immediate: true,
      deep: true
    }
  },
  components: {
    CircularProgress,
    TeachingElement
  }
};
</script>

<style lang="scss" scoped>
.selected {
  border: 1px solid #444;
}

.tes-wrapper {
  display: flex;
  position: relative;

  .v-input {
    margin: 0;
  }
}

::v-deep {
  .contained-content {
    .message {
      span:not(.heading) {
        display: none;
      }
    }
  }
}
</style>
