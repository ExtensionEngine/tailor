<template>
  <v-card class="elevation-2">
    <v-card-title class="header elevation-2 primary">
      <v-icon>mdi-pencil</v-icon>
      <h4 class="title">Edit Profile</h4>
    </v-card-title>
    <v-form @submit.prevent="updateUser">
      <user-avatar :imgUrl.sync="context.imgUrl" />
      <v-divider/>
      <v-layout class="general-info-container">
        <v-flex class="fields-box">
          <v-text-field
            v-validate="{ required: true, email: true }"
            v-model="context.email"
            :error-messages="vErrors.collect('email')"
            name="email"
            label="Email"/>
          <v-text-field
            v-validate="{ max: 20 }"
            v-model="context.firstName"
            :error-messages="vErrors.collect('firstName')"
            data-vv-as="first name"
            name="firstName"
            label="First name"/>
          <v-text-field
            v-validate="{ max: 20 }"
            v-model="context.lastName"
            :error-messages="vErrors.collect('lastName')"
            data-vv-as="last name"
            name="lastName"
            label="Last name"/>
        </v-flex>
        <v-flex class="fields-box">
          <v-layout class="role">
            <v-icon color="primary">mdi-account-star</v-icon>
            <h4 class="title">{{ user.role }}</h4>
          </v-layout>
          <v-text-field
            v-validate="{ max: 50 }"
            v-model="context.location"
            :error-messages="vErrors.collect('location')"
            name="location"
            label="Location"
            append-icon="mdi-map-marker"
            outline/>
        </v-flex>
      </v-layout>
      <v-card-actions>
        <v-layout class="btn-actions">
          <v-spacer/>
          <v-btn
            :disabled="!hasChanges"
            @click="resetUser"
            color="pink"
            flat>
            Cancel
          </v-btn>
          <v-btn
            :disabled="!hasChanges"
            type="submit"
            color="light-blue darken-3"
            flat>
            Update
          </v-btn>
        </v-layout>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import pick from 'lodash/pick';
import UserAvatar from './Avatar';
import { withValidation } from 'utils/validation';

const ATTRIBUTES = [ 'firstName', 'lastName', 'email', 'location', 'imgUrl' ];

const snackOpts = { right: true };

export default {
  name: 'user-general',
  mixins: [withValidation()],
  data: () => ({
    context: {
      firstName: null,
      lastName: null,
      email: null,
      location: null,
      imgUrl: null
    }
  }),
  computed: {
    ...mapState({ user: state => state.auth.user }),
    hasChanges: vm =>
      Object.keys(vm.context).some(name => vm.user[name] !== vm.context[name]),
    contextAttrs: () => ATTRIBUTES
  },
  methods: {
    ...mapActions(['updateInfo']),
    updateUser() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return this.$snackbar.error('Validation failed!', snackOpts);
        return this.updateInfo(pick(this.context, this.contextAttrs))
          .then(() => {
            this.$validator.reset();
            this.$snackbar.success('User information updated.', snackOpts);
          });
      })
      .catch(() => this.$snackbar.error('Email already exists!', snackOpts));
    },
    resetUser() {
      this.$validator.reset();
      this.context = pick(this.user, this.contextAttrs);
    }
  },
  created() {
    this.resetUser();
  },
  components: { UserAvatar }
};
</script>

<style lang="scss" scoped>
$color: #fff;

.header {
  height: 55px;
  color: $color;

  .title {
    margin: 0 8px;
    font-weight: 300;
  }

  .v-icon {
    margin-right: 8px;
    color: inherit;
  }
}

.v-form {
  .title {
    margin: 0 12px;
    padding-top: 2.5px;
    font-weight: 300;
  }

  .general-info-container {
    justify-content: center;
    flex-flow: row wrap;
    margin: 0;
    padding: 8px 8px;
  }

  .btn-actions {
    flex-flow: row wrap;
    margin: 24px 48px;

    .v-btn {
      width: 125px;
      min-width: 100px;
      margin-bottom: 10px;
    }
  }

  .fields-box {
    flex: 0 41%;
    max-width: 41%;
    margin: 0 16px;
    padding: 0 16px;

    .role {
      margin-top: 15px;
      margin-bottom: 20px;
    }
  }

  .v-card__actions {
    padding: 0;
  }
}
</style>
