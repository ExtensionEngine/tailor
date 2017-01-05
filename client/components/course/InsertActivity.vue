<template>
  <div>
    <div class="divider-wrapper" v-if="!inputShown" @click="show">
      <div class="divider">
        <div class="action"><span class="fa fa-plus"></span></div>
      </div>
    </div>
    <div class="activity-input" v-if="inputShown">
      <div class="row">
        <div class="col-lg-8">
          <input
            v-model="activityName"
            v-focus="inputFocused"
            type="text"
            class="form-control"
            placeholder="Activity name">
        </div>
        <div class="col-lg-2">
          <select class="form-control" v-model.number="activityLevel">
            <option value="1">Section</option>
            <option value="2">Subsection</option>
          </select>
        </div>
        <div class="col-lg-2">
          <button class="btn btn-default" @click.stop="add">Add</button>
          <button class="btn btn-default" @click.stop="hide">X</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { focus } from 'vue-focus';
import { mapActions } from 'vuex-module';

export default {
  directives: { focus },
  props: ['parent'],
  data() {
    return {
      inputShown: false,
      inputFocused: true,
      activityName: '',
      activityLevel: 1
    };
  },
  methods: {
    show() {
      this.inputShown = true;
      this.inputFocused = true;
    },
    hide() {
      this.activityName = '';
      this.inputShown = false;
    },
    add() {
      const isOnSameLevel = this.activityLevel === 1;
      const position = isOnSameLevel ? this.parent.position + 1 : 0;
      const parentKey = isOnSameLevel ? this.parent.parentKey : this.parent._key;

      const model = {
        name: this.activityName,
        position,
        parentKey
      };
      this.save(model).then(() => this.fetch());
      this.hide();
    },
    ...mapActions(['save', 'fetch'], 'activity')
  }
};
</script>

<style lang="scss">
.activity-input {
  padding: 20px 5px;

  input {
    background-color: #e0e0e0;
  }

  select {
    background-color: #e0e0e0;
  }
}
</style>
