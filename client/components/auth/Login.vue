<template>
  <div class="login">
    <div class="info">
      <div v-if="status.message" class="message">
        <span class="fa fa-exclamation-triangle"></span> {{status.message}}
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

      <div class="form-subtext">
        <router-link :to="{ name: 'reset-password' }">Forgotten password?</router-link>
      </div>

      <div class="form-submit">
        <button type="submit" class="btn btn-primary btn-block">Login</button>
      </div>
    </form>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex-module';

  export default {
    name: 'login',

    computed: {
      ...mapGetters({ status: 'loginUserStatus' }, 'auth')
    },

    methods: {
      handleLoginUser() {
        const email = this.$refs.email.value;
        const password = this.$refs.password.value;

        if (email.length && password.length) {
          this.loginUser({ email, password });
        } else {
          // TODO: Remove when backend is implemented
          this.loginUserFail();
        }
      },
      ...mapActions([
        'loginUser',
        'loginUserFail'
      ], 'auth')
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

      .form-subtext {
        text-align: right;

        a {
          color: inherit;
          font-weight: 500;
          text-decoration: none;
        }
      }

      .form-submit {
        padding-top: 30px;
        overflow: visible;
        width: 100%;
      }

      .form-group + .form-group {
        margin-bottom: 8px;
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
        font-size: 18px;
        padding-right: 3px;
      }
    }
  }
</style>
