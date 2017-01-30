<template>
  <div class="auth-container">
    <div class="auth-panel">
      <div class="auth-header">
        <img src="../../assets/img/logo.png" alt="Logo"/>
        <h1>CGMA Authoring</h1>
      </div>
      <div class="auth-body">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

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
    padding-bottom: 15px;
  }

  .auth-body {
    padding: 20px 30px;

    a {
      color: inherit;
      font-weight: 500;
    }
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
