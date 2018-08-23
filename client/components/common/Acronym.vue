<template>
  <div :style="{ color }" class="acronym">
    <span>{{ acronym }}</span>
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
  text-align: center;
  border-radius: 30px;
  background-color: #eee;

  span {
    display: inline-block;
    padding-top: 6px;
  }
}
</style>
