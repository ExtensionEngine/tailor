<template>
  <div class="reset-password">
    <div class="info">
      <div v-show="!submitted && !status.message" class="init">
        <span class="fa fa-info"></span> {{initMessage}}
      </div>

      <div v-show="submitted && !status.message" class="sent">
        <span class="fa fa-check"></span> {{sentMessage}}
      </div>

      <div v-show="status.message" class="error">
        <span class="fa fa-exclamation-triangle"></span> {{status.message}}
      </div>
    </div>
    <form @submit.prevent="handleResetPassword" novalidate>
      <div class="form-group">
        <input
          ref="email"
          type="email"
          class="form-control"
          placeholder="email"
        />
      </div>

      <div class="form-submit">
        <button type="submit" class="btn btn-primary btn-block">
          Send Reset Request
        </button>
      </div>
    </form>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex-module';

  export default {
    name: 'reset-password',

    data() {
      const submitted = false;
      const initMessage = 'Please enter your email';
      const sentMessage = 'Password reset request successfully ' +
                          'sent, please check your email';

      return {
        initMessage,
        sentMessage,
        submitted
      };
    },

    computed: {
      ...mapGetters({
        status: 'resetPasswordStatus'
      }, 'auth')
    },

    methods: {
      handleResetPassword() {
        const email = this.$refs.email.value;

        if (email.length) {
          this.submitted = true;
          this.resetPassword(email);
        } else {
          // TODO: Remove when backend is implemented
          this.resetPasswordFail();
        }
      },
      ...mapActions([
        'resetPassword',
        'resetPasswordFail'
      ], 'auth')
    }
  };
</script>

<style lang="scss">
  .reset-password {
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.74);
    color: rgba(0, 0, 0, .87);
    padding: 0 20px 30px 20px;
    margin: 0 auto;
    max-width: 80%;
    width: 400px;

    form {
      padding-top: 20px;
    }

    .info {
      font-size: 16px;
      font-weight: 600;
      min-height: 40px;
      margin: 0 auto;
      padding: 15px 20px 0 20px;

      .init {
        color: rgba(0, 0, 0, .87);
      }

      .sent {
        color: #4CAF50;
      }

      .error {
        color: #dd4b39;
      }

      .fa {
        font-size: 18px;
        padding-right: 3px;
      }
    }
  }
</style>
