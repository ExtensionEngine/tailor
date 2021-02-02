<template>
  <v-tooltip open-delay="800" bottom>
    <template #activator="{ on }">
      <div v-on="on" class="column-name text-truncate">
        {{ value }}
      </div>
    </template>
    {{ value }}
  </v-tooltip>
</template>

<script>
export default {
  name: 'workflow-overview-name',
  inheritAttrs: false,
  props: {
    value: { type: String, required: true }
  }
};
</script>
