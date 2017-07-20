<template>
  <div>
    <div v-if="showInput" class="activity-input">
      <div class="row">
        <div class="col-lg-7">
          <span :class="{ 'has-error': vErrors.has('name') }" class="form-group">
            <input
              v-model="activityName"
              v-focus.lazy="focusInput"
              v-validate="{ rules: { required: true, min: 2, max: 250 } }"
              class="form-control"
              name="name"
              type="text"
              placeholder="Title">
            <span class="help-block">{{ vErrors.first('name') }}</span>
          </span>
        </div>
        <div class="col-lg-3">
          <multiselect
            v-if="hasChildren"
            :value="activityType ? getActivityLevel(activityType) : levels[0]"
            :options="levels"
            :searchable="false"
            @input="onLevelSelected">
          </multiselect>
        </div>
        <div class="col-lg-2">
          <button
            @click.stop="hide"
            class="btn btn-default btn-sm delete pull-right">X
          </button>
          <button
            :disabled="vErrors.any()"
            @click.stop="add"
            class="btn btn-default btn-sm add pull-right">
            Add
          </button>
        </div>
      </div>
    </div>
    <div v-if="!showInput" @click="show" class="divider-wrapper">
      <div class="divider">
        <div class="action">
          <span class="mdi mdi-plus plus"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import calculatePosition from 'utils/calculatePosition';
import filter from 'lodash/filter';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import { focus } from 'vue-focus';
import { getLevel, OUTLINE_LEVELS } from 'shared/activities';
import { getChildren } from 'utils/activity';
import { mapActions, mapGetters } from 'vuex-module';
import multiselect from '../common/Select';

const noop = Function.prototype;

export default {
  props: ['parent', 'level'],
  data() {
    return {
      showInput: false,
      focusInput: true,
      activityName: '',
      activityType: ''
    };
  },
  computed: {
    ...mapGetters(['activities']),
    levels() {
      const nextLevel = this.level + 1;
      const cond = it => (it.level === nextLevel) || (it.level === this.level);
      let levels = filter(OUTLINE_LEVELS, cond);
      levels.forEach(it => (it.value = it.type));
      return levels;
    },
    hasChildren() {
      return this.level < OUTLINE_LEVELS.length;
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
        const OUTLINE_LEVEL = find(OUTLINE_LEVELS, { type: this.activityType });
        const sameLevel = OUTLINE_LEVEL.level === this.level;
        const parentId = sameLevel ? this.parent.parentId : this.parent.id;
        const courseId = this.parent.courseId;
        const items = getChildren(this.activities, parentId, courseId);
        const newPosition = findIndex(items, it => it.position === this.parent.position);
        const isFirstChild = !sameLevel || newPosition === -1;
        const context = { items, newPosition, isFirstChild, insert: true };

        this.save({
          name: this.activityName,
          type: this.activityType,
          courseId,
          parentId,
          position: calculatePosition(context)
        });

        this.hide();
        if (!sameLevel) this.$emit('expand');
      }, noop);
    },
    getActivityLevel(type) {
      return getLevel(type);
    },
    onLevelSelected(activity) {
      this.activityType = activity.type;
    }
  },
  mounted() {
    this.activityType = this.levels[0].type;
  },
  directives: { focus },
  components: { multiselect }
};
</script>

<style lang="scss" scoped>
.activity-input {
  padding: 20px 5px;

  input {
    background-color: #e0e0e0;
  }
}

.plus {
  padding: 0 5px;
  font-size: 20px;
  line-height: 20px;
}

.btn {
  &.add {
    margin-right: 3px;
  }
}

@media (min-width: 1600px) {
  .btn {
    min-width: 70px;
  }
}
</style>
