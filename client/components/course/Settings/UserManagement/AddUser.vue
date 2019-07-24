<template>
  <form @submit.prevent="addUser">
    <v-layout row align-center class="pl-3">
      <v-flex xs7 class="pr-2">
        <v-combobox
          v-validate="{ required: true, email: true }"
          v-model="email"
          :error-messages="vErrors.collect('email')"
          :items="suggestedEmails"
          @input.native="fetchEmails($event.srcElement.value)"
          data-vv-name="email"
          label="Email"/>
      </v-flex>
      <v-flex xs3 class="px-4">
        <v-select
          v-validate="'required'"
          v-model="role"
          :error-messages="vErrors.collect('role')"
          :items="roles"
          data-vv-name="role"
          flat/>
      </v-flex>
      <v-flex xs2>
        <v-btn type="submit" color="blue-grey darken-1" outline>Add</v-btn>
      </v-flex>
    </v-layout>
  </form>
</template>

<script>
import api from '@/api/user';
import debounce from 'lodash/debounce';
import { mapActions } from 'vuex';
import { withValidation } from 'utils/validation';

export default {
  mixins: [withValidation()],
  props: {
    roles: { type: Array, required: true }
  },
  data() {
    return {
      email: '',
      suggestedEmails: [],
      role: this.roles[0].value
    };
  },
  methods: {
    ...mapActions('course', ['upsertUser']),
    addUser() {
      const { email, role } = this;
      const { courseId } = this.$route.params;
      this.$validator.validateAll().then(async isValid => {
        if (!isValid) return;
        await this.upsertUser({ courseId, email, role });
        this.email = '';
        this.suggestedEmails = [];
        this.$nextTick(() => this.$validator.reset());
      });
    },
    fetchEmails: debounce(function (filter) {
      if (filter.length < 3) {
        this.suggestedEmails = [];
        return;
      }
      return api.fetch({ filter }).then(({ items }) => {
        this.suggestedEmails = items.map(it => it.email);
      });
    }, 500)
  }
};
</script>
