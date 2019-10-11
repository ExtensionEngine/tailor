<template>
  <div :style="{ color }" class="acronym">
    {{ acronym }}
  </div>
</template>

<script>
import { getAcronym, getColor } from 'utils/course';

export default {
  name: 'acronym',
  props: {
    course: { type: Object, required: true }
  },
  computed: {
    acronym() {
      return getAcronym(this.course.name);
    },
    color() {
      return getColor(this.course);
    }
  }
};
</script>

<style lang="scss" scoped>
.acronym {
  display: inline-block;
  width: 45px;
  height: 45px;
  margin-right: 8px;
  font-size: 18px;
  font-weight: 400;
  line-height: 45px;
  text-align: center;
  border-radius: 30px;
  background: #f1f1f1;
}
</style>
