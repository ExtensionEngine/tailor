<template>
  <span>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" icon text class="my-1">
          <v-icon color="primary lighten-4">mdi-tag-outline</v-icon>
        </v-btn>
      </template>
      <v-list class="py-0">
        <v-list-item
          v-for="it in tags"
          :key="it.id"
          @click="$emit('update', it)"
          class="py-0 secondary--text text--lighten-1">
          <v-list-item-title class="pr-3 text-left">
            {{ it.name }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="!tags.length">
          No available filters
        </v-list-item>
      </v-list>
    </v-menu>
  </span>
</template>

<script>

export default {
  props: {
    tags: { type: Array, default: () => [] }
  }
};
</script>
