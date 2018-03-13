<template>
  <div>
    <circular-progress v-if="showLoader"></circular-progress>
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
import CircularProgress from 'components/common/CircularProgress';
import courseApi from 'client/api/course';
import Promise from 'bluebird';

export default {
  data() {
    return {
      showLoader: true,
      repositories: []
    };
  },
  created() {
    return Promise.join(courseApi.getCourses(), Promise.delay(700), repositories => {
      this.repositories = repositories;
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
