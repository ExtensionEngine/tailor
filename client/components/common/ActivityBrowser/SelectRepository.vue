<template>
  <div>
    <circular-progress v-if="showLoader"></circular-progress>
    <div v-else>
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

export default {
  data() {
    return {
      showLoader: true,
      repositories: []
    };
  },
  created() {
    courseApi.getCourses().then(repositories => {
      this.repositories = repositories;
      this.showLoader = false;
    });
  },
  components: { CircularProgress }
};
</script>

<style lang="scss" scoped>
.repository-item {
  padding: 5px 20px;
}
</style>
