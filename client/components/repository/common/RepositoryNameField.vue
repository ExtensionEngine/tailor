<template>
  <validation-provider
    ref="validator"
    v-slot="{ errors }"
    :name="lowerCase(label)"
    :rules="validationRules"
    slim>
    <v-text-field
      v-model.trim="internalValue"
      @change="update"
      v-bind="$attrs"
      :error-messages="errors"
      :messages="warning"
      :label="label"
      outlined
      class="required">
      <template #message="{ message }">
        <div v-if="warning" class="d-flex align-center">
          <v-icon color="warning" class="mr-1 text-body-1">mdi-alert</v-icon>
          <span class="warning--text">{{ message }}</span>
        </div>
        <template v-else>{{ message }}</template>
      </template>
    </v-text-field>
  </validation-provider>
</template>

<script>
import api from '@/api/repository';
import debounce from 'lodash/debounce';
import lowerCase from 'lodash/lowerCase';
import some from 'lodash/some';

const EXISTING_NAME_MSG = 'Warning: a Repository with that name already exists.';

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
    internalValue: '',
    repositoryNames: [],
    warning: ''
  }),
  methods: {
    lowerCase,
    async update() {
      const { valid } = await this.$refs.validator.validate();
      if (!valid) return;
      this.$emit('change', this.internalValue);
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.internalValue = val;
      }
    },
    internalValue: debounce(function (name) {
      const isDuplicate = some(this.repositoryNames, { name });
      this.warning = isDuplicate ? EXISTING_NAME_MSG : '';
    }, 200)
  },
  async created() {
    const { repositoryId } = this;
    const params = { ...repositoryId ? { repositoryId } : {}, getNames: true };
    this.repositoryNames = await api.getRepositories(params);
  }
};
</script>
