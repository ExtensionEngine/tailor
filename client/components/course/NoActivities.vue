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
        <button
          @click.stop="create"
          class="btn btn-block btn-primary btn-material">
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

export default {
  data() {
    return {
      name: '',
      level: null
    };
  },
  computed: {
    ...mapGetters(['course', 'structure'], 'course'),
    levels() {
      return filter(this.structure, { level: 1 });
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
          type: this.level.type,
          data: { name: this.name },
          courseId: this.course.id,
          position: 1
        });
      });
    }
  },
  mounted() {
    this.level = this.levels[0];
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
    margin: 6px;
    padding-left: 5px;
  }
}
</style>
