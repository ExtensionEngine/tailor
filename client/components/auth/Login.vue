<template>
  <div class="login">
    <div class="info">
      <div v-if="message" class="message">
        <span class="fa fa-exclamation-triangle"></span> {{message}}
      </div>
    </div>

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

      <div>
        <router-link :to="{ name: 'reset-password' }">Forgotten password?</router-link>
      </div>

      <button type="submit" class="btn btn-primary btn-block">Login</button>
    </form>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';

  export default {
    name: 'login-form',

    computed: mapState({
      message: state => state[0].message
    }),

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
  .login {
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.74);
    color: rgba(0, 0, 0, .87);
    padding: 0 20px 30px 20px;
    margin: 0 auto;
    max-width: 80%;
    width: 400px;

    form {
      padding-top: 20px;

      button {
        margin-top: 30px;
      }
    }

    .info {
      color: #dd4b39;
      font-size: 16px;
      font-weight: 600;
      min-height: 40px;
      margin: 0 auto;
      padding: 15px 20px 0 20px;

      .message {
        height: 100%;
      }

      .fa {
        padding-right: 3px;
      }
    }
  }
</style>
