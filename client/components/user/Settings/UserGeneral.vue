<template>
  <v-flex>
    <v-layout row align-start pl-5 mt-5>
      <v-chip color="light-blue darken-3" text-color="white">
        <v-avatar>
          <v-icon>mdi-account-circle</v-icon>
        </v-avatar>
        {{ user.role }}
      </v-chip>
    </v-layout>
    <form @submit.prevent="updateUser">
      <v-layout column class="ma-5">
        <v-flex xs9 class="px-4">
          <v-text-field
            v-validate="{ required: true, email: true }"
            v-model="email"
            :error-messages="vErrors.collect('email')"
            data-vv-name="email"
            label="Email"/>
        </v-flex>
        <v-flex xs9 class="px-4">
          <v-text-field
            v-validate="'max:20'"
            v-model="firstName"
            :error-messages="vErrors.collect('name')"
            data-vv-name="name"
            label="First name"/>
        </v-flex>
        <v-flex xs9 class="px-4">
          <v-text-field
            v-validate="'max:20'"
            v-model="lastName"
            :error-messages="vErrors.collect('name')"
            data-vv-name="name"
            label="Last name"/>
        </v-flex>
      </v-layout>
      <v-btn type="submit" color="blue-grey darken-1" flat dark large>
        Submit
      </v-btn>
      <v-btn @click="routeTo('catalog')" color="light-blue darken-3" flat large>
        Return
      </v-btn>
    </form>
  </v-flex>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
import { withValidation } from 'utils/validation';
import EventBus from 'EventBus';
import pick from 'lodash/pick';

const appChannel = EventBus.channel('app');

export default {
  name: 'user-info',
  mixins: [withValidation()],
  data() {
    return {
      firstName: '',
      lastName: '',
      email: ''
    };
  },
  computed: {
    ...mapGetters(['user']),
    error() {
      return { color: 'error', message: 'An error has occurred!' };
    },
    success() {
      return { color: 'success', message: 'Changes saved.' };
    }
  },
  methods: {
    ...mapActions(['updateInfo']),
    updateUser() {
      const { firstName, lastName, email } = this;
      this.$validator.validateAll()
        .then(async isValid => {
          if (!isValid) return;
          await this.updateInfo({ firstName, lastName, email });
          appChannel.emit('showSnackbar', this.success);
          this.$nextTick(() => this.$validator.reset());
        })
        .catch(() => appChannel.emit('showSnackbar', this.error));
    },
    routeTo(name) {
      this.$router.push({ name });
    }
  },
  created() {
    Object.assign(this, pick(this.user, ['firstName', 'lastName', 'email']));
  }
};
</script>
