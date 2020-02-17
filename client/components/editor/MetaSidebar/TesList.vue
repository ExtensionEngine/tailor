<template>
  <div>
    <v-alert v-if="!hasRelatedableElements" type="warning">
      No available elements to relate to.
    </v-alert>
    <div
      v-for="item in tes"
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
</template>

<script>
import find from 'lodash/find';
import repositoryApi from 'client/api/repository';
import TeachingElement from 'components/editor/TeachingElement';
import xorBy from 'lodash/xorBy';

export default {
  name: 'tes-list',
  props: {
    activityIds: { type: Array, required: true },
    outlineId: { type: Number, required: true },
    repositoryId: { type: Number, required: true },
    elementId: { type: Number, required: true },
    allowedTypes: { type: Array, required: true },
    multiple: { type: Boolean, required: true },
    selected: { type: Array, default: () => [] }
  },
  data: () => ({
    tes: []
  }),
  computed: {
    hasRelatedableElements: ({ tes, allowedTypes }) =>
      tes.filter(te => allowedTypes.includes(te.type)).length
  },
  methods: {
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
    activityIds: {
      handler() {
        const { activityIds: ids, repositoryId: id } = this;
        if (!ids) return;
        return repositoryApi.getContentElements({ id, ids })
          .then(tes => { this.tes = tes; });
      },
      immediate: true,
      deep: true
    }
  },
  components: {
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
