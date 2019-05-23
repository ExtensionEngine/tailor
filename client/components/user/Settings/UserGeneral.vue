<template>
  <v-form @submit.prevent="updateUser">
    <set-image ref="setImage" :isEditing="isEditing" @editing="setEditing"/>
    <v-layout class="main-container">
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
        <v-text-field
          v-validate="{ numeric: true, max: 10 }"
          v-model="context.phoneNumber"
          :error-messages="vErrors.collect('phoneNumber')"
          name="phoneNumber"
          mask="phone"
          label="Phone number"/>
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
        <v-btn @click="avatarSubmit" type="submit" color="light-blue darken-3" flat>
          Update
        </v-btn>
      </v-layout>
    </v-card-actions>
  </v-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
import { withValidation } from 'utils/validation';
import SetImage from './SetImage';
import pick from 'lodash/pick';

export default {
  name: 'user-info',
  mixins: [withValidation()],
  data() {
    return {
      context: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        location: ''
      },
      isEditing: false
    };
  },
  computed: {
    ...mapGetters(['user']),
    hasChanges: vm => Object.keys(vm.context).some(name => vm.user[name] !== vm.context[name]),
    fieldNames: vm => ['firstName', 'lastName', 'email', 'phoneNumber', 'location']
  },
  methods: {
    ...mapActions(['updateInfo']),
    updateUser() {
      const { context, hasChanges, fieldNames } = this;
      if (!hasChanges) return;
      this.$validator.validateAll()
        .then(async isValid => {
          if (!isValid) return this.$snackbar.error('Validation failed!');
          await this.updateInfo(pick(context, fieldNames));
          this.$snackbar.success('User information updated.');
          this.$validator.reset();
        })
        .catch(() => this.$snackbar.error('Email already exists!'));
    },
    setEditing(val) {
      this.$refs.setImage.croppa.refresh();
      this.isEditing = val;
    },
    avatarSubmit() {
      this.$refs.setImage.doneEditing();
    }
  },
  created() {
    const { context, user, fieldNames } = this;
    Object.assign(context, pick(user, fieldNames));
  },
  components: { SetImage }
};
</script>

<style lang="scss" scoped>
@mixin flex-container-setup ($justify-content: center) {
  display: flex;
  flex-flow: row wrap;
  justify-content: $justify-content;
}

.main-container {
  margin: 0;
  padding: 8px 8px;
  @include flex-container-setup();
}

.btn-actions {
  margin: 24px 48px;
  @include flex-container-setup(flex-end);

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
}

.v-card__actions {
  padding: 0;
}
</style>
