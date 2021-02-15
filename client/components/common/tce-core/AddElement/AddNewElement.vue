<template>
  <v-bottom-sheet
    v-on="$listeners"
    v-bind="$attrs"
    max-width="1240"
    inset>
    <div class="element-container grey lighten-5">
      <div class="d-flex align-center py-4 px-10">
        <slot name="header"></slot>
      </div>
      <div
        v-for="group in library"
        :key="group.name">
        <div class="group-heading grey--text text--darken-4">{{ group.name }}</div>
        <div class="group-elements">
          <v-hover
            v-for="element in group.elements"
            :key="element.position"
            v-slot:default="{ hover }">
            <v-btn
              @click.stop="$emit('add', [element])"
              :disabled="!isAllowed(element.type)"
              :color="hover ? 'secondary accent-2' : 'blue-grey darken-4'"
              text
              class="add-element">
              <v-icon
                v-if="element.ui.icon"
                size="26"
                color="primary darken-3">
                {{ element.ui.icon }}
              </v-icon>
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
      return !this.allowedTypes.length || this.allowedTypes.includes(type);
    }
  }
};
</script>

<style lang="scss" scoped>
.element-container {
  min-height: 20rem;
  padding: 0 0 1.875rem;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  overflow: hidden;
}

.group-heading {
  margin: 0 2.5rem 0.375rem;
  padding-top: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1rem;
  text-align: left;
}

.group-elements {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 0 1.875rem;
}

.add-element {
  width: 8.125rem;
  min-width: 8.125rem;
  height: auto !important;
  min-height: 4.375rem;
  padding: 0 !important;
  white-space: normal;

  ::v-deep .v-btn__content {
    flex: 1 1 100%;
    flex-direction: column;
    padding: 0.375rem;
    text-transform: none;
  }

  .v-icon {
    padding: 0.125rem 0;
    font-size: 1.875rem;
  }

  .button-text {
    margin: 0.625rem 0;
  }
}
</style>
