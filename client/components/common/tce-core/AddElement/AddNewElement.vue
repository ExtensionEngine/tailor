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
          <v-hover
            v-for="element in group.elements"
            :key="element.position"
            v-slot:default="{ hover }">
            <v-btn
              @click.stop="$emit('add', [element])"
              :disabled="!isAllowed(element.type)"
              :color="hover ? 'pink' : '#333'"
              text
              class="add-element">
              <v-icon v-if="element.ui.icon">{{ element.ui.icon }}</v-icon>
              <span class="button-text body-2">{{ element.name }}</span>
            </v-btn>
          </v-hover>
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
  width: 8.125rem;
  min-width: 8.125rem;
  height: auto !important;
  min-height: 4.375rem;
  padding: 0 !important;
  border: 1px solid transparent;
  white-space: normal;

  ::v-deep .v-btn__content {
    flex: 1 1 100%;
    padding: 0.375rem;
    flex-direction: column;
    text-transform: none;
  }

  .v-icon {
    padding: 0.125rem 0;
    font-size: 1.875rem;
  }

  .button-text {
    margin: 0.625rem 0;
  }

  &:enabled:hover {
    background: #fcfcfc;
    border: 1px solid #888;
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
