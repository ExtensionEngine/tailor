<template>
  <div class="row">
    <div class="col-md-4 col-md-offset-4">
      <login-form></login-form>
    </div>
  </div>
</template>

<script>
  import LoginForm from '../components/auth/LoginForm';

  export default {
    components: {
      LoginForm
    }
  };
</script>

<style lang="scss">
</style>
