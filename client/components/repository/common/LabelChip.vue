<template functional>
  <custom-chip
    v-on="listeners"
    :class="[data.staticClass, data.class]"
    color="blue-grey lighten-5"
    label small
    class="flex-shrink-0 caption text-uppercase">
    <slot></slot>
  </custom-chip>
</template>

<script>
import CustomChip from '@/components/common/Chip';

export default {
  name: 'repository-label-chip',
  components: { CustomChip }
};
</script>
