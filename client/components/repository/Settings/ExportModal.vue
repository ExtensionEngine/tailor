<template>
  <tailor-dialog :value="true" header-icon="mdi-export" persistent>
    <template v-slot:header>Export {{ repository.name }}</template>
    <template v-slot:body>
      <div v-if="loading">
        Please wait while repository export is being prepared.
        <v-progress-circular
          size="20"
          width="2"
          color="primary"
          indeterminate
          class="progress" />
      </div>
      <div v-else-if="jobId">Repository export is ready. Click to download.</div>
      <div v-else>Something went wrong. Please try again later.</div>
    </template>
    <template v-slot:actions>
      <v-btn @click="close" text>Cancel</v-btn>
      <v-btn
        @click="exportRepository"
        :disabled="!jobId"
        color="success"
        text>
        Download
      </v-btn>
    </template>
  </tailor-dialog>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import api from '@/api/repository';
import TailorDialog from '@/components/common/TailorDialog';

export default {
  data: () => ({
    loading: true,
    jobId: null
  }),
  computed: {
    ...mapState({ token: state => state.auth.token }),
    ...mapGetters('repository', ['repository'])
  },
  methods: {
    exportRepository() {
      const { jobId, repository, token } = this;
      const fields = { token: { value: token, type: 'hidden' } };
      return api.exportRepository(repository.id, jobId, fields)
        .finally(() => this.close());
    },
    close() {
      this.$emit('close');
    }
  },
  created() {
    return api.initiateExportJob(this.repository.id)
      .then(jobId => (this.jobId = jobId))
      .finally(() => (this.loading = false));
  },
  components: { TailorDialog }
};
</script>

<style lang="scss" scoped>
.progress {
  margin-top: 0.05rem;
  margin-left: 0.5rem;
}
</style>
