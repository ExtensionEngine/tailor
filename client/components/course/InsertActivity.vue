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
import cuid from 'cuid';
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
      let subLevel = this.activityLevel === 2;
      let order = subLevel ? 1 : this.parent.order + 1;
      let parent = subLevel ? this.parent._key : this.parent.parentKey;

      this.create({
        _key: cuid(),
        name: this.activityName,
        order: order,
        parentKey: parent,
        unsynced: true
      });

      this.hide();
    },
    ...mapActions(['create'], 'activities')
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
