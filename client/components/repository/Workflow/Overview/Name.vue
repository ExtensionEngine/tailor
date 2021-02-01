<template functional>
  <v-tooltip open-delay="800" bottom>
    <template #activator="{ on }">
      <div v-on="on" class="text-truncate">
        {{ props.value }}
      </div>
    </template>
    {{ props.value }}
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
