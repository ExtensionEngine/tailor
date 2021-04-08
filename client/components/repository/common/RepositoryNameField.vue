<template>
  <validation-provider
    ref="validator"
    v-slot="{ errors }"
    :name="lowerCase(label)"
    :rules="validationRules"
    slim>
    <v-text-field
      v-model.trim="context"
      @change="update"
      v-bind="$attrs"
      :error-messages="errors"
      :messages="existingRepoWarning"
      :label="label"
      outlined
      class="required">
      <template #message="{ message }">
        <div class="d-flex align-center">
          <v-icon
            v-if="existingRepoWarning"
            color="warning"
            class="text-body-1 mr-1">
            mdi-alert
          </v-icon>
          <span :class="existingRepoWarning ? 'warning--text' : 'error--text'">
            {{ message }}
          </span>
        </div>
      </template>
    </v-text-field>
  </validation-provider>
</template>

<script>
import api from '@/api/repository';
import debounce from 'lodash/debounce';
import lowerCase from 'lodash/lowerCase';
import some from 'lodash/some';

const EXISTING_REPO_MESSAGE = 'Warning: a Repository with that name already exists.';

export default {
  name: 'repository-name-field',
  model: { event: 'change' },
  props: {
    value: { type: String, default: '' },
    label: { type: String, default: 'Name' },
    repositoryId: { type: Number, default: null },
    validationRules: { type: [String, Object], default: 'required|min:2|max:250' }
  },
  data: () => ({
    context: '',
    existingRepoWarning: '',
    repositoryNames: []
  }),
  methods: {
    lowerCase,
    async update() {
      const { valid } = await this.$refs.validator.validate();
      if (!valid) return;
      this.$emit('change', this.context);
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.context = val;
      }
    },
    context: debounce(function (name) {
      const isNameExists = some(this.repositoryNames, { name });
      this.existingRepoWarning = isNameExists ? EXISTING_REPO_MESSAGE : '';
    }, 200)
  },
  async created() {
    const { repositoryId } = this;
    const params = { ...repositoryId ? { repositoryId } : {}, getNames: true };
    this.repositoryNames = await api.getRepositories(params);
  }
};
</script>
