<template>
  <div class="activity">{{ name }}</div>
</template>

<script>
export default {
  name: 'activity',
  props: ['name']
};
</script>

<style lang="scss">
.activity {
  margin: 10px 200px;
  padding: 5px;
  font-size: 22px;
  color: red;
  background-color: #ccc;
  cursor: pointer;
}
</style>
