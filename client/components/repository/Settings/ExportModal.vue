<template>
  <tailor-dialog :value="true" header-icon="mdi-export" persistent>
    <template v-slot:header>Export {{ repository.name }}</template>
    <template v-slot:body>
      <v-alert v-bind="status" prominent>{{ status.message }}</v-alert>
    </template>
    <template v-slot:actions>
      <v-btn @click="close" text>Cancel</v-btn>
      <v-btn
        @click="exportRepository"
        :disabled="!jobId"
        color="primary darken-3"
        text>
        Download
      </v-btn>
    </template>
  </tailor-dialog>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { repository as api } from '@/api';
import TailorDialog from '@/components/common/TailorDialog';

const STATUS = {
  INIT: {
    icon: 'mdi-loading mdi-spin',
    color: 'grey lighten-3',
    message: 'Please wait while repository export is being prepared...'
  },
  READY: {
    icon: 'mdi-download',
    color: 'grey lighten-3',
    message: 'Repository export is ready. Click button below to download...'
  },
  ERROR: {
    icon: 'mdi-alert-circle-outline',
    color: 'secondary lighten-1',
    dark: true,
    message: 'Something went wrong. Please try again later.'
  }
};

export default {
  data: () => ({ jobId: null, status: STATUS.INIT }),
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
      .then(jobId => {
        this.jobId = jobId;
        this.status = STATUS.READY;
      })
      .catch(() => (this.status = STATUS.ERROR));
  },
  components: { TailorDialog }
};
</script>
