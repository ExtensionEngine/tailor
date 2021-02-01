<template>
  <v-bottom-sheet v-on="$listeners" v-bind="$attrs" max-width="1240" inset>
    <div class="element-container">
      <v-toolbar color="blue-grey darken-4" dense class="mb-2 elevation-1">
        <slot name="header"></slot>
      </v-toolbar>
      <div
        v-for="group in library"
        :key="group.name">
        <div class="group-heading blue-grey--text text--darken-4">
          <span>{{ group.name }}</span>
        </div>
        <div class="group-elements">
          <button
            v-for="element in group.elements"
            :key="element.position"
            @click.stop="$emit('add', [element])"
            :disabled="!isAllowed(element.type)"
            class="add-element">
            <v-icon v-if="element.ui.icon">{{ element.ui.icon }}</v-icon>
            <h5 class="body-2">{{ element.name }}</h5>
          </button>
        </div>
      </div>
    </div>
  </v-bottom-sheet>
</template>

<script>
export default {
  name: 'add-new-element',
  props: {
    library: { type: Array, required: true },
    allowedTypes: { type: Array, required: true }
  },
  methods: {
    isAllowed(type) {
      if (!this.allowedTypes.length) return true;
      return this.allowedTypes.includes(type);
    }
  }
};
</script>

<style lang="scss" scoped>
$font-color: #333;
$accent-color: #d81b60;
$disabled-color: #a1a1a1;

.element-container {
  min-height: 25rem;
  padding: 0 0 1.875rem;
  background: #fff;
}

.group-heading {
  margin: 0 2.5rem 0.375rem;
  padding-top: 1.25rem;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.75rem;
  text-align: left;

  .v-icon, span {
    line-height: 1.75rem;
    vertical-align: middle;
  }

  .v-icon {
    margin-right: 0.375rem;
    color: #546e7a;
  }
}

.group-elements {
  display: flex;
  width: 100%;
  padding: 0 1.875rem;
  flex-wrap: wrap;
}

.add-element {
  align-self: center;
  width: 8.125rem;
  min-width: 8.125rem;
  min-height: 4.375rem;
  padding: 0.375rem;
  color: $font-color;
  font-size: 1.25rem;
  border: 1px solid #fff;
  border-radius: 4px;
  outline: none;
  cursor: pointer;

  .v-icon {
    padding: 0.125rem 0;
    color: $font-color;
    font-size: 1.875rem;
  }

  &:disabled {
    color: $disabled-color;
    cursor: not-allowed;

    .v-icon {
      color: $disabled-color;
    }
  }

  &:enabled:hover {
    color: $accent-color;
    background: #fcfcfc;
    border: 1px solid #888;

    .v-icon {
      color: $accent-color;
    }
  }

  &-title {
    margin: 0;
    padding: 0;
    font-weight: 500;
    line-height: 1.25rem;
  }
}

.v-toolbar {
  .v-divider {
    align-self: auto;
  }

  .width-label {
    min-width: 11.25rem;
  }
}
</style>
