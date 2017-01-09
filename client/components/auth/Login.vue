<template>
  <div class="auth-container">
    <div class="auth-panel">
      <div class="auth-header">
        <img src="../../assets/img/logo.png" alt="Logo"/>
        <h1>
          CGMA Authoring
          <span class="fa fa-paint-brush"></span>
        </h1>
      </div>
      <div class="auth-body">
        <div class="message">
          <span v-if="message">{{ message }}</span>
        </div>
        <form @submit.prevent="submit">
          <div class="form-group">
            <input
              v-model="email"
              class="form-control"
              type="email"
              placeholder="Email"/>
          </div>
          <div class="form-group">
            <input
              v-model="password"
              class="form-control"
              type="password"
              placeholder="Password"/>
          </div>
          <div class="options">
            <router-link :to="{ name: 'reset-password' }">
              Forgot password ?
            </router-link>
          </div>
          <button type="submit" class="btn btn-default btn-block">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';

const INVALID_CREDENTIALS_MESSAGE = 'User email and password do not match';

export default {
  name: 'login',
  data() {
    return {
      email: '',
      password: '',
      message: ''
    };
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    ...mapActions(['login']),
    submit() {
      this.message = '';
      this.login({ email: this.email, password: this.password })
        .then(() => this.$router.push('/'))
        .catch(() => {
          this.message = INVALID_CREDENTIALS_MESSAGE;
        });
    }
  }
};
</script>

<style lang="scss">
.auth-container {
  padding-top: 5%;
}

.auth-panel {
  width: 500px;
  margin: auto;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);

  &:hover {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 2px 3px rgba(0,0,0,0.15);
  }

  h1 {
    margin: 0;
    color: white;
    font-size: 18px;
    line-height: 18px;
  }

  .auth-header {
    background-color: #da126d;
    padding-bottom: 10px;

    .fa {
      padding-left: 7px;
      font-size: 26px;
    }
  }

  .auth-body {
    padding: 20px 30px;

    a {
      color: inherit;
      font-weight: 500;
    }
  }

  .options {
    padding: 5px 0 10px 0;
    text-align: right;
  }

  .message {
    min-height: 16px;
    margin-bottom: 20px;
    color: #da126d;
    font-size: 16px;
    line-height: 16px;
  }
}
</style>
