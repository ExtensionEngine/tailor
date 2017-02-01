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
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import { mapGetters, mapActions } from 'vuex-module';

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
    ...mapGetters(['course'], 'editor'),
    ...mapGetters(['activities']),
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
      const parentId = isOnSameLevel ? this.parent.parentId : this.parent.id;
      const courseId = this.parent.courseId;

      let children = filter(this.activities, it => {
        return it.parentId === parentId && it.courseId === courseId;
      }).sort((a, b) => a.position > b.position);

      let prev = findIndex(children, it => it.position === this.parent.position);

      let position;
      if (!isOnSameLevel) {
        position = 1;
      } else if (prev + 1 === children.length) {
        position = children[prev].position + 1;
      } else {
        let nextPosition = children[prev + 1].position;
        position = (this.parent.position + nextPosition) / 2;
      }

      const model = {
        name: this.activityName,
        courseId: courseId,
        position,
        parentId
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

.plus {
  padding: 0px 7px;
}
</style>
