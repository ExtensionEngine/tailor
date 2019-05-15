<template>
  <v-flex>
    <v-form @submit.prevent="updateUser">
      <set-image ref="setImage" :isEditing="isEditing" @editing="setEditing"/>
      <v-layout row wrap mx-0 pa-2 justify-center>
        <v-flex xs5 px-3 mx-3>
          <v-text-field
            v-validate="{ required: true, email: true }"
            v-model="email"
            :error-messages="vErrors.collect('email')"
            name="email"
            label="Email"/>
          <v-text-field
            v-validate="{ max: 20 }"
            v-model="firstName"
            :error-messages="vErrors.collect('firstName')"
            data-vv-as="first name"
            name="firstName"
            label="First name"/>
          <v-text-field
            v-validate="{ max: 20 }"
            v-model="lastName"
            :error-messages="vErrors.collect('lastName')"
            data-vv-as="last name"
            name="lastName"
            label="Last name"/>
        </v-flex>
        <v-flex xs5 px-3 mx-3>
          <v-text-field
            v-validate="{ numeric: true, max: 10 }"
            v-model="phoneNumber"
            :error-messages="vErrors.collect('phoneNumber')"
            name="phoneNumber"
            mask="phone"
            label="Phone number"/>
          <v-select
            :items="cities"
            label="Headquarter location"
            outline
          ></v-select>
        </v-flex>
      </v-layout>
      <v-card-actions>
        <v-layout mx-5 my-4 row wrap justify-end>
          <v-btn v-if="isEditing" @click="setEditing(false)" color="pink" flat>
            Cancel
          </v-btn>
          <v-btn @click="avatarSubmit" type="submit" color="light-blue darken-3" flat>
            Update
          </v-btn>
        </v-layout>
      </v-card-actions>
    </v-form>
  </v-flex>
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
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      cities: ['New York', 'Boston', 'Split', 'Zagreb'],
      isEditing: false
    };
  },
  computed: {
    ...mapGetters(['user']),
    hasChanges: vm => Object.keys(vm.vFields).some(name => vm.vFields[name].changed)
  },
  methods: {
    ...mapActions(['updateInfo']),
    updateUser() {
      const { firstName, lastName, email } = this;
      this.$validator.validateAll()
        .then(async isValid => {
          if (!isValid) return this.$snackbar.error('Validation failed!');
          if (!this.hasChanges) return;
          await this.updateInfo({ firstName, lastName, email });
          this.$validator.reset();
          this.$snackbar.success('User information updated.');
        })
        .catch(() => this.$snackbar.error('An error has occurred!'));
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
    Object.assign(this, pick(this.user, ['firstName', 'lastName', 'email']));
  },
  components: { SetImage }
};
</script>

<style lang="scss" scoped>
.v-card__actions {
  padding: 0;

  .v-btn {
    width: 125px;
    min-width: 100px;
    margin-bottom: 10px;
  }
}
</style>
