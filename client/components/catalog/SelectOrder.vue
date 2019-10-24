<template>
  <span>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" icon flat class="mx-0">
          <v-icon color="primary lighten-4">mdi-sort</v-icon>
        </v-btn>
      </template>
      <v-list class="py-0">
        <v-list-tile
          v-for="({ text, field, order }) in options"
          :key="field"
          @click="$emit('update', { field, order })"
          :class="{ 'secondary--text text--lighten-1': sortBy.field === field }">
          <v-list-tile-title class="pr-3">{{ text }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <v-btn @click="toggleOrder" icon flat class="mx-0">
      <v-icon color="primary lighten-4">
        mdi-sort-{{ sortBy.order === 'ASC' ? 'ascending' : 'descending' }}
      </v-icon>
    </v-btn>
  </span>
</template>

<script>
export default {
  props: {
    sortBy: { type: Object, required: true }
  },
  computed: {
    options() {
      return [
        { text: 'Creation date', field: 'createdAt', order: 'DESC' },
        { text: 'Name', field: 'name', order: 'ASC' }
      ];
    }
  },
  methods: {
    toggleOrder() {
      const order = this.sortBy.order === 'ASC' ? 'DESC' : 'ASC';
      this.$emit('update', { ...this.sortBy, order });
    }
  }
};
</script>

<style lang="scss" scoped>
.v-menu, .v-btn {
  display: inline-block;
}
</style>
