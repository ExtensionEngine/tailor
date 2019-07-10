<template>
  <v-container fluid>
    <v-layout>
      <v-card>
        <sidebar/>
      </v-card>
      <v-flex>
        <router-view/>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Sidebar from './Sidebar';

export default {
  components: { Sidebar }
};
</script>

<style lang="scss" scoped>
.layout {
  align-items: flex-start;
  justify-content: center;
}

.flex {
  max-width: 58rem;
  margin-left: 48px;
}
</style>
