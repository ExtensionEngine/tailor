<template>
  <v-card class="elevation-2">
    <v-card-title class="header elevation-2 primary">
      <v-icon>mdi-pencil</v-icon>
      <h4 class="title">Edit Profile</h4>
    </v-card-title>
    <v-form @submit.prevent="updateUser">
      <user-avatar ref="userAvatar" :isEditing="isEditing" @editing="setEditing"/>
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
          <v-btn v-if="isEditing" @click="setEditing(false)" color="pink" flat>
            Cancel
          </v-btn>
          <v-btn
            @click="avatarSubmit"
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

const snackOpts = { right: true };

export default {
  name: 'user-general',
  mixins: [withValidation()],
  data: () => ({
    context: {
      firstName: '',
      lastName: '',
      email: '',
      location: ''
    },
    isEditing: false
  }),
  computed: {
    ...mapState({
      user: state => state.auth.user
    }),
    hasChanges: vm => {
      Object.keys(vm.context).some(name => vm.user[name] !== vm.context[name]);
    },
    fieldNames: vm => ['firstName', 'lastName', 'email', 'phoneNumber', 'location']
  },
  methods: {
    ...mapActions(['updateInfo']),
    updateUser() {
      const { context, hasChanges, fieldNames } = this;
      if (!hasChanges) return;
      this.$validator.validateAll()
        .then(isValid => {
          if (!isValid) return this.$snackbar.error('Validation failed!', snackOpts);
          return this.updateInfo(pick(context, fieldNames))
            .then(() => {
              this.$snackbar.success('User information updated.', snackOpts);
              this.$validator.reset();
            });
        })
        .catch(() => this.$snackbar.error('Email already exists!', snackOpts));
    },
    setEditing(val) {
      this.$refs.userAvatar.croppa.refresh();
      this.isEditing = val;
    },
    avatarSubmit() {
      this.$refs.userAvatar.doneEditing();
    }
  },
  created() {
    const { context, user, fieldNames } = this;
    Object.assign(context, pick(user, fieldNames));
  },
  components: { UserAvatar }
};
</script>

<style lang="scss" scoped>
$color: #fff;

@mixin flex-container($justify-content: center) {
  display: flex;
  justify-content: $justify-content;
}

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
    flex-flow: row wrap;
    margin: 0;
    padding: 8px 8px;
    @include flex-container();
  }

  .btn-actions {
    flex-flow: row wrap;
    margin: 24px 48px;
    @include flex-container(flex-end);

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
