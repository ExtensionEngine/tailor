<template>
  <form @submit.prevent="handleLoginUser">
    <div class="form-group">
      <input
        ref="email"
        type="email"
        class="form-control"
        placeholder="email"
      />
    </div>

    <div class="form-group">
      <input
        ref="password"
        type="password"
        class="form-control"
        placeholder="password"
      />
    </div>

    <button type="submit">Login</button>
  </form>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    name: 'login-form',

    data() {
      return {
        login: true
      };
    },

    methods: {
      handleLoginUser() {
        const email = this.$refs.email.value;
        const password = this.$refs.password.value;

        if (email.length && password.length) {
          this.loginUser({ email, password });
        } else {
          this.loginUserFail();
        }
      },
      ...mapActions([
        'loginUser',
        'loginUserFail'
      ])
    }
  };
</script>

<style lang="scss">

</style>
