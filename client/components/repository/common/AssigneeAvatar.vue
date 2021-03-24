<template functional>
  <v-tooltip :disabled="!props.showTooltip" open-delay="500" bottom>
    <template #activator="{ on }">
      <v-avatar
        v-on="{ ...on, ...listeners }"
        :size="props.small ? 24 : 34"
        :class="[data.staticClass, data.class]"
        color="primary lighten-4">
        <img v-if="props.imgUrl" :src="props.imgUrl">
        <v-icon
          v-else
          :size="props.small ? 16 : 24"
          color="primary darken-3">
          mdi-account
        </v-icon>
      </v-avatar>
    </template>
    <span>{{ props.label }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'assignee-avatar',
  props: {
    imgUrl: { type: String, default: null },
    label: { type: String, default: 'Unassigned' },
    small: { type: Boolean, default: false },
    showTooltip: { type: Boolean, default: false }
  }
};
</script>
