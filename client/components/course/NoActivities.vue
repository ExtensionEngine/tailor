<template>
  <div class="well">
    <div class="row">
      <div class="col-md-8">
        <span
          :class="{ 'has-error': vErrors.has('name') }"
          class="form-group">
          <input
            v-model="name"
            v-validate="{ rules: { required: true, min: 2, max: 250 } }"
            class="form-control"
            type="text"
            name="name"
            autofocus=""
            placeholder="Name">
          <span v-show="vErrors.has('name')" class="help-block">
            {{ vErrors.first('name') }}
          </span>
        </span>
      </div>
      <div class="col-md-2">
        <multiselect
          :value="level"
          :options="levels"
          :allow-empty="false"
          @input="onLevelSelected">
        </multiselect>
      </div>
      <div class="col-md-2">
        <button @click.stop="create" class="btn btn-block btn-primary">
          Add
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import filter from 'lodash/filter';
import { mapGetters, mapActions } from 'vuex-module';
import multiselect from '../common/Select';
import { OUTLINE_LEVELS } from 'shared/activities';

const TOP_LEVELS = filter(OUTLINE_LEVELS, { level: 1 });

export default {
  data() {
    return {
      name: '',
      level: TOP_LEVELS[0]
    };
  },
  computed: {
    ...mapGetters(['course'], 'course'),
    levels() {
      return TOP_LEVELS;
    }
  },
  methods: {
    ...mapActions(['save'], 'activities'),
    onLevelSelected(level) {
      if (!level) return;
      this.level = level;
    },
    create() {
      this.$validator.validateAll().then(result => {
        if (!result) return;
        this.save({
          name: this.name,
          type: this.level.type,
          courseId: this.course.id,
          position: 1
        });
      });
    }
  },
  components: { multiselect },
  inject: ['$validator']
};
</script>

<style lang="scss" scoped>
.well {
  background-color: white;
  border: 1px solid #ccc;

  input {
    padding-left: 5px;
  }
}
</style>
