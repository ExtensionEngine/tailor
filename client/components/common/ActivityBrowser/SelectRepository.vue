<template>
  <div class="repository-list-container">
    <v-progress-circular v-if="showLoader" indeterminate color="primary"/>
    <div v-else class="repository-list">
      <div
        v-for="repository in repositories"
        :key="repository.id"
        @click="$emit('selected', repository)"
        class="repository-item">
        {{ repository.name }}
      </div>
    </div>
  </div>
</template>

<script>
import api from 'client/api/course';
import Promise from 'bluebird';
import sortBy from 'lodash/sortBy';

export default {
  data() {
    return {
      showLoader: true,
      repositories: []
    };
  },
  created() {
    return Promise.join(api.getCourses(), Promise.delay(700), repositories => {
      this.repositories = sortBy(repositories, 'name');
      this.showLoader = false;
    });
  }
};
</script>

<style lang="scss" scoped>
.repository-list-container {
  margin: 25px 20px 20px;
}

.repository-item {
  padding: 6px 20px;
  font-size: 14px;

  &:hover {
    color: #42b983;
    cursor: pointer;
  }
}
</style>
