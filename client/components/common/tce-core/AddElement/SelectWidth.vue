<template>
  <v-container :grid-list-xs="true">
    <v-layout row wrap>
      <v-flex
        v-for="{ value, label, icon } in widths"
        :key="value"
        @click="$emit('selected', value)"
        align-self-center
        class="width-container">
        <v-icon large class="width-icon">
          {{ icon }}
        </v-icon>
        <div class="width-label">
          {{ label }} width
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'select-width',
  data() {
    return {
      widths: [
        { label: 'Half', value: 6, icon: 'mdi-page-layout-sidebar-left' },
        { label: 'Full', value: 12, icon: 'mdi-page-layout-body' }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.width-container {
  font-size: 16px;
  cursor: pointer;

  .width-icon {
    color: #444;
  }

  &:hover {
    .width-icon, .width-label {
      color: #42b983;
    }
  }
}
</style>
