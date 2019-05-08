<template>
  <v-flex>
    <v-form @submit.prevent="updateUser">
      <set-image ref="setImage" :isEditing="isEditing" @editing="setEditing"/>
      <v-layout column mx-5 mt-2>
        <v-text-field
          v-validate="{ required: true, email: true }"
          v-model="email"
          :error-messages="vErrors.collect('email')"
          name="email"
          label="Email"/>
        <v-text-field
          v-validate="{ max: 20 }"
          v-model="firstName"
          :error-messages="vErrors.collect('name')"
          name="firstName"
          label="First name"/>
        <v-text-field
          v-validate="{ max: 20 }"
          v-model="lastName"
          :error-messages="vErrors.collect('name')"
          name="lastName"
          label="Last name"/>
        <v-card-actions>
          <v-layout my-4 justify-end>
            <v-btn
              v-if="isEditing"
              @click="setEditing(false)"
              color="error"
              flat
              outline>
              Cancel
            </v-btn>
            <v-btn
              @click="avatarSubmit"
              type="submit"
              color="light-blue darken-3"
              flat
              dark
              outline>
              Save changes
            </v-btn>
          </v-layout>
        </v-card-actions>
      </v-layout>
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
      this.isEditing = val;
      this.$refs.setImage.croppa.refresh();
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
