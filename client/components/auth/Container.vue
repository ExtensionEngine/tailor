<template>
  <div class="auth-container">
    <div class="auth-panel">
      <div class="auth-header">
        <img src="../../assets/img/logo-a.svg" alt="Logo"/>
        <h1>Course Authoring</h1>
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
  transition: all 0.3s cubic-bezier(0.25,0.8,0.25,1);

  &:hover {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 2px 3px rgba(0,0,0,0.15);
  }

  img {
    width: 130px;
    margin: 15px 0 10px;
  }

  h1 {
    margin: 0;
    color: white;
    font-size: 18px;
    line-height: 18px;
  }

  .auth-header {
    padding-bottom: 15px;
    background: linear-gradient(90deg, #672d89 60%, #b94164);
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
