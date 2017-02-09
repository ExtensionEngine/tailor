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
          <button
            class="btn btn-default"
            :disabled="!isActivityNameValid"
            @click.stop="add">
            Add
          </button>
          <button class="btn btn-default" @click.stop="hide">X</button>
        </div>
      </div>
    </div>
    <div class="divider-wrapper" v-else @click="show">
      <div class="divider">
        <div class="action">
          <span class="fa fa-plus plus"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { focus } from 'vue-focus';
import findIndex from 'lodash/findIndex';
import { mapGetters, mapActions } from 'vuex-module';
import { getChildren, updatePosition } from '../../utils/activity.js';

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
    ...mapGetters(['activities']),
    ...mapGetters(['course'], 'editor'),
    canCreateSubsection() {
      return this.level < 3;
    },
    isActivityNameValid() {
      // Server imposes these requirements (see activity schema).
      const length = this.activityName.length;
      return length >= 3 && length <= 100;
    }
  },
  methods: {
    ...mapActions(['save'], 'activity'),
    show() {
      this.showInput = true;
      this.focusInput = true;
    },
    hide() {
      this.activityName = '';
      this.showInput = false;
    },
    add() {
      const sameLevel = this.newActivityLevel === 0;
      const parentId = sameLevel ? this.parent.parentId : this.parent.id;
      const courseId = this.parent.courseId;
      const children = getChildren(this.activities, parentId, courseId);
      const index = findIndex(children, it => it.position === this.parent.position);
      const positionData = {
        index,
        prev: this.parent,
        next: children[index + 1],
        first: children[0],
        count: children.length,
        sameLevel,
        reorder: false
      };

      this.save({
        name: this.activityName,
        courseId,
        position: updatePosition(positionData),
        parentId
      });

      this.hide();
      if (!sameLevel) this.$emit('expand');
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

  select {
    background-color: #e0e0e0;
  }
}

.plus {
  padding: 0px 7px;
}
</style>
