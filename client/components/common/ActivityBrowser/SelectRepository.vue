<template>
  <div>
    <circular-progress v-if="showLoader" />
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
import api from 'client/api/repository';
import CircularProgress from 'components/common/CircularProgress';
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
    return Promise.join(api.getRepositories(), Promise.delay(700), repositories => {
      this.repositories = sortBy(repositories, 'name');
      this.showLoader = false;
    });
  },
  components: { CircularProgress }
};
</script>

<style lang="scss" scoped>
.repository-list {
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

.circular-progress {
  margin: 30px 0;
}
</style>
