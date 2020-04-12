<template>
  <v-toolbar height="72">
    <v-toolbar-title>{{ label }}</v-toolbar-title>
  </v-toolbar>
</template>

<script>
export default {
  name: 'default-toolbar',
  props: {
    label: { type: String, required: true }
  }
};
</script>
