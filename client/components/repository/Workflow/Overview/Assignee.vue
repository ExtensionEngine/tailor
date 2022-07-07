<template>
  <v-tooltip open-delay="800" bottom>
    <template #activator="{ on }">
      <div v-on="on" class="column-assignee d-flex align-center">
        <assignee-avatar
          :label="label"
          :img-url="imgUrl"
          small
          class="mr-2" />
        <span class="text-truncate">{{ label }}</span>
      </div>
    </template>
    {{ label }}
  </v-tooltip>
</template>

<script>
import AssigneeAvatar from '@/components/repository/common/AssigneeAvatar';

export default {
  name: 'overview-assignee',
  inheritAttrs: false,
  props: {
    label: { type: String, default: 'Unassigned' },
    imgUrl: { type: String, default: null }
  },
  components: { AssigneeAvatar }
};
</script>
