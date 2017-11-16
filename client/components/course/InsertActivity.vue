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
            class="btn btn-default btn-sm btn-material delete pull-right">X
          </button>
          <button
            :disabled="vErrors.any()"
            @click.stop="add"
            class="btn btn-default btn-sm btn-material add pull-right">
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
import { getChildren } from 'utils/activity';
import { getLevel } from 'shared/activities';
import map from 'lodash/map';
import { mapActions, mapGetters } from 'vuex-module';
import multiselect from '../common/Select';
import sortBy from 'lodash/sortBy';

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
    ...mapGetters(['structure'], 'course'),
    levels() {
      if (!this.parent) return filter(this.structure, { level: 1 });
      const parentType = find(this.structure, { type: this.parent.type });
      const { level, subLevels = [] } = parentType;
      const cond = it => subLevels.includes(it.type) || (it.level === level);
      let levels = filter(this.structure, cond);
      levels.forEach(it => (it.value = it.type));
      return levels;
    },
    hasChildren() {
      return this.level < this.structure.length;
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
      this.$validator.validateAll().then(result => {
        if (!result) return;

        const OUTLINE_LEVEL = find(this.structure, { type: this.activityType });
        const sameLevel = OUTLINE_LEVEL.level === this.level;
        const parentId = sameLevel ? this.parent.parentId : this.parent.id;
        const courseId = this.parent.courseId;
        const types = map(filter(this.structure, { level: OUTLINE_LEVEL.level }), 'type');
        const children = getChildren(this.activities, parentId, courseId);
        const items = sortBy(filter(children, it => types.includes(it.type)), 'position');
        const newPosition = findIndex(items, it => it.position === this.parent.position);
        const isFirstChild = !sameLevel || newPosition === -1;
        const context = { items, newPosition, isFirstChild, insert: true };

        this.save({
          type: this.activityType,
          data: { name: this.activityName },
          courseId,
          parentId,
          position: calculatePosition(context)
        });

        this.hide();
        if (!sameLevel) this.$emit('expand');
      });
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
  components: { multiselect },
  inject: ['$validator']
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
