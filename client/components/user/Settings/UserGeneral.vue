<template>
  <v-flex>
    <v-form @submit.prevent="updateUser">
      <v-layout row mr-0 ml-0>
        <set-image ref="setImage" :isEditing="isEditing" @editing="setEditing"/>
      </v-layout>
      <v-layout column ma-3 mt-5>
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
            v-validate="{ max: 20 }"
            v-model="firstName"
            :error-messages="vErrors.collect('name')"
            data-vv-name="name"
            label="First name"/>
        </v-flex>
        <v-flex xs9 class="px-4">
          <v-text-field
            v-validate="{ max: 20 }"
            v-model="lastName"
            :error-messages="vErrors.collect('name')"
            data-vv-name="name"
            label="Last name"/>
        </v-flex>
      </v-layout>
      <v-flex ma-4>
        <v-layout row justify-space-between>
          <v-btn
            @click="avatarSubmit"
            type="submit"
            color="blue-grey darken-1"
            flat
            dark
            large>
            Save
          </v-btn>
          <v-btn v-if="isEditing" @click="setEditing(false)" color="blue-grey" flat large>
            <v-icon left dark>mdi-close</v-icon>
            Cancel
          </v-btn>
        </v-layout>
      </v-flex>
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
      isEditing: false
    };
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    ...mapActions(['updateInfo']),
    updateUser() {
      const { firstName, lastName, email } = this;
      this.$validator.validateAll()
        .then(async isValid => {
          if (!isValid) return this.$snackbar.error('Validation failed!');
          await this.updateInfo({ firstName, lastName, email });
          this.$snackbar.success('Changes saved.');
        })
        .catch(() => this.$snackbar.error('An error has occurred!'));
    },
    setEditing(val) {
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
