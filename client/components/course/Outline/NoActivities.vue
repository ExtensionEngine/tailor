<template>
  <v-card min-height="128px">
    <v-container>
      <v-layout row ma-0>
        <v-flex mt-2 mr-2 class="name-container">
          <span
            :class="{ 'has-error': vErrors.has('name') }"
            class="form-group">
            <input
              v-validate="{ rules: { required: true, min: 2, max: 250 } }"
              v-model="name"
              class="form-control"
              type="text"
              name="name"
              autofocus=""
              placeholder="Name">
            <span v-show="vErrors.has('name')" class="help-block">
              {{ vErrors.first('name') }}
            </span>
          </span>
        </v-flex>
        <v-flex v-if="showLevelPicker">
          <multiselect
            :value="level"
            :options="levels"
            :allow-empty="false"
            @input="onLevelSelected"
            class="level-picker">
          </multiselect>
        </v-flex>
        <v-btn @click.stop="create">
          Add
        </v-btn>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import { withValidation } from 'utils/validation';
import filter from 'lodash/filter';
import first from 'lodash/first';
import multiselect from '../../common/Select';

export default {
  mixins: [withValidation()],
  data() {
    return {
      name: '',
      level: null
    };
  },
  computed: {
    ...mapGetters(['course', 'structure', 'activities'], 'course'),
    levels() {
      return filter(this.structure, { level: 1 });
    },
    showLevelPicker() {
      return this.levels.length > 1;
    }
  },
  methods: {
    ...mapActions(['save'], 'activities'),
    ...mapMutations(['focusActivity'], 'course'),
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
        })
        .then(() => {
          const activity = first(this.activities);
          if (activity) this.focusActivity(activity._cid);
        });
      });
    }
  },
  created() {
    this.level = first(this.levels);
  },
  components: { multiselect }
};
</script>

<style lang="scss" scoped>
.name-container {
  flex-grow: 4;
}

.level-picker {
  margin: 1px 8px 0;
}
</style>
