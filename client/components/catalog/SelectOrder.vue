<template>
  <span>
    <v-menu offset-y>
      <template #activator="{ on: menu }">
        <v-tooltip open-delay="800" top>
          <template #activator="{ on: tooltip }">
            <v-btn
              v-on="{ ...menu, ...tooltip }"
              color="primary lighten-2"
              icon
              class="my-1">
              <v-icon>mdi-sort</v-icon>
            </v-btn>
          </template>
          <span>Order by</span>
        </v-tooltip>
      </template>
      <v-list class="py-0">
        <v-list-item
          v-for="({ text, field, order }) in options"
          :key="field"
          @click="$emit('update', { field, order })"
          :class="{ 'secondary--text text--lighten-1': sortBy.field === field }">
          <v-list-item-title class="pr-3 text-left">{{ text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-tooltip open-delay="800" top>
      <template #activator="{ on }">
        <v-btn
          v-on="on"
          @click="toggleOrder"
          color="primary lighten-2"
          icon
          class="my-1">
          <v-icon>
            mdi-sort-{{ sortBy.order === 'ASC' ? 'ascending' : 'descending' }}
          </v-icon>
        </v-btn>
      </template>
      <span>Order direction</span>
    </v-tooltip>
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
