<template>
  <span>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" icon flat>
          <v-icon color="primary lighten-4">mdi-sort</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-tile
          v-for="({ text, field, order }) in options"
          :key="field"
          @click="$emit('update', { field, order })">
          <v-list-tile-title
            :class="`${selected.field === field ? 'pink' : 'black'}--text`">
            {{ text }}
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <v-btn @click="toggleOrder" icon flat>
      <v-icon color="primary lighten-4">
        mdi-sort-{{ selected.order === 'ASC' ? 'ascending' : 'descending' }}
      </v-icon>
    </v-btn>
  </span>
</template>

<script>
export default {
  props: {
    selected: { type: Object, required: true }
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
      const order = this.selected.order === 'ASC' ? 'DESC' : 'ASC';
      this.$emit('update', { ...this.selected, order });
    }
  }
};
</script>

<style lang="scss" scoped>
.v-menu, .v-btn {
  display: inline-block;
}
</style>
