<template>
  <div>
    <div class="activity-input" v-if="showInput">
      <div class="row">
        <div class="col-lg-8">
          <input
            class="form-control"
            v-model="activityName"
            v-focus="focusInput"
            type="text"
            placeholder="Activity name">
        </div>
        <div class="col-lg-2">
          <select
            class="form-control"
            v-if="canCreateSubsection"
            v-model.number="newActivityLevel">
              <option value="0">Section</option>
              <option value="1">Subsection</option>
          </select>
        </div>
        <div class="col-lg-2">
          <button class="btn btn-default" @click.stop="add">Add</button>
          <button class="btn btn-default" @click.stop="hide">X</button>
        </div>
      </div>
    </div>
    <div class="divider-wrapper" v-else @click="show">
      <div class="divider">
        <div class="action"><span class="fa fa-plus"></span></div>
      </div>
    </div>
  </div>
</template>

<script>
import { focus } from 'vue-focus';
import { mapActions } from 'vuex-module';

export default {
  directives: { focus },
  props: ['parent', 'level'],
  data() {
    return {
      showInput: false,
      focusInput: true,
      activityName: '',
      newActivityLevel: 0
    };
  },
  computed: {
    canCreateSubsection() {
      return this.level < 2;
    }
  },
  methods: {
    show() {
      this.showInput = true;
      this.focusInput = true;
    },
    hide() {
      this.activityName = '';
      this.showInput = false;
    },
    add() {
      const isOnSameLevel = this.newActivityLevel === 0;
      const position = isOnSameLevel ? this.parent.position + 1 : 0;
      const parentKey = isOnSameLevel ? this.parent.parentKey : this.parent._key;

      const model = {
        name: this.activityName,
        position,
        parentKey
      };
      this.save(model);
      this.hide();
    },
    ...mapActions(['save'], 'activity')
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
