<template>
  <v-hover v-slot="{ hover }">
    <v-card
      :to="route"
      :color="hover ? 'primary lighten-4' : 'primary lighten-5'"
      flat
      class="card d-flex align-center pa-2">
      <v-icon :color="color">mdi-label</v-icon>
      <v-tooltip open-delay="500" bottom>
        <template #activator="{ on }">
          <span v-on="on" class="flex-shrink-0 mx-2">{{ shortId }}</span>
        </template>
        {{ typeLabel }} ID
      </v-tooltip>
      <div class="text-truncate">{{ name }}</div>
      <v-spacer />
      <v-icon dense class="mx-1">mdi-arrow-right</v-icon>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: 'workflow-activity-card',
  props: {
    id: { type: Number, required: true },
    shortId: { type: String, required: true },
    name: { type: String, required: true },
    typeLabel: { type: String, required: true },
    color: { type: String, required: true }
  },
  computed: {
    route: vm => ({ name: 'repository', query: { activityId: vm.id } })
  }
};
</script>
