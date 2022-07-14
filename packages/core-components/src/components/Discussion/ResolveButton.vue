<template>
  <div class="resolve-btn-container">
    <v-tooltip open-delay="800" left>
      <template #activator="{ on }">
        <v-btn
          v-on="{ ...$listeners, ...on }"
          color="teal accent-4"
          small text
          class="px-1">
          <v-icon size="24" color="teal accent-4" class="mr-2">
            mdi-checkbox-outline
          </v-icon>
          Resolve All
        </v-btn>
      </template>
      <span>Mark all as resolved and hide discussion</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: 'resolve-comments-btn'
};
</script>
