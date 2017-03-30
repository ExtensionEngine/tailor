<template>
  <div>
    <div class="activity-input" v-if="showInput">
      <div class="row">
        <div class="col-lg-9">
          <div class="row">
            <div class="col-lg-9">
              <span class="form-group" :class="{ 'has-error': vErrors.has('name') }">
                <input
                  v-model="activityName"
                  v-focus.lazy="focusInput"
                  v-validate="{ rules: { required: true, min: 2, max: 250 } }"
                  class="form-control"
                  name="name"
                  type="text"
                  placeholder="Activity name">
                <span v-show="vErrors.has('name')" class="help-block">
                  {{ vErrors.first('name') }}
                </span>
              </span>
            </div>
            <div class="col-lg-3">
              <multiselect
                v-if="canCreateSubsection"
                :value="activityLevels[0]"
                :options="activityLevels"
                :searchable="false"
                :onChange="onActivityLevelChange">
              </multiselect>
            </div>
          </div>
        </div>
        <div class="col-lg-3">
          <button class="btn delete btn-default pull-right" @click.stop="hide">X</button>
          <button
            class="btn add btn-default pull-right"
            :disabled="vErrors.any()"
            @click.stop="add">
            Add
          </button>
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
import multiselect from '../common/Select';
import { getChildren } from '../../utils/activity.js';
import calculatePosition from '../../utils/calculatePosition.js';

const noop = Function.prototype;

export default {
  directives: { focus },
  props: ['parent', 'level'],
  data() {
    return {
      showInput: false,
      focusInput: true,
      activityName: '',
      activityLevels: [
        { name: 'Section', value: 0 },
        { name: 'Subsection', value: 1 }
      ],
      newActivityLevel: ''
    };
  },
  components: {
    multiselect
  },
  computed: {
    ...mapGetters(['activities']),
    ...mapGetters(['course'], 'course'),
    canCreateSubsection() {
      return this.level < 3;
    }
  },
  methods: {
    ...mapActions(['save'], 'activities'),
    show() {
      this.showInput = true;
      this.focusInput = true;
    },
    hide() {
      this.activityName = '';
      this.showInput = false;
    },
    add() {
      this.$validator.validateAll().then(() => {
        const sameLevel = this.newActivityLevel.value === 0;
        const parentId = sameLevel ? this.parent.parentId : this.parent.id;
        const courseId = this.parent.courseId;
        const items = getChildren(this.activities, parentId, courseId);
        const newPosition = findIndex(items, it => it.position === this.parent.position);
        const isFirstChild = !sameLevel || newPosition === -1;
        const context = { items, newPosition, isFirstChild, insert: true };

        this.save({
          name: this.activityName,
          courseId,
          parentId,
          position: calculatePosition(context)
        });

        this.hide();
        if (!sameLevel) this.$emit('expand');
      }, noop);
    },
    onActivityLevelChange(value) {
      this.newActivityLevel = value;
    }
  },
  created() {
    this.newActivityLevel = this.activityLevels[0];
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

.btn {
  &.add {
    margin-right: 3px;
  }
}
</style>
