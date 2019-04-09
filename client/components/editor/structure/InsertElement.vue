<template>
  <add-element
    :include="include"
    :activity="activity"
    :position="position"
    :layout="layout"
    :popover="true"
    @add="el => $emit('add', el)"/>
</template>

<script>
import AddElement from 'tce-core/AddElement';

export default {
  props: {
    activity: { type: Object, default: null },
    position: { type: Number, default: null },
    layout: { type: Boolean, default: true },
    include: { type: Array, default: null }
  },
  components: {
    AddElement
  }
};
</script>
