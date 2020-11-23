<template functional>
  <tailor-chip
    v-on="listeners"
    :class="[data.staticClass, data.class]"
    color="blue-grey lighten-5"
    label small
    class="flex-shrink-0 caption text-uppercase">
    <slot></slot>
  </tailor-chip>
</template>

<script>
import TailorChip from '@/components/common/TailorChip';

export default {
  name: 'repository-label-chip',
  components: { TailorChip }
};
</script>
