<template>
  <div>
    <div class="divider-wrapper" v-if="!input" @click="show">
      <div class="divider">
        <div class="action"><span class="fa fa-plus"></span></div>
      </div>
    </div>
    <div class="activity-input" v-if="input">
      <div class="row">
        <div class="col-lg-8">
          <input type="text" class="form-control" placeholder="Activity name">
        </div>
        <div class="col-lg-2">
          <select class="form-control">
            <option>Section</option>
            <option>Subsection</option>
          </select>
        </div>
        <div class="col-lg-2">
          <button class="btn btn-default">Add</button>
          <button class="btn btn-default" @click.stop="hide">X</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      input: false
    };
  },
  methods: {
    show: function () {
      this.input = true;
    },
    hide: function () {
      this.input = false;
    },
    add: function () {
      // TODO: Dispatch action
    }
  }
};
</script>

<style lang="scss">
.activity-input {
  padding: 20px 5px;

  input {
    background-color: #e0e0e0;
  }
}
</style>
