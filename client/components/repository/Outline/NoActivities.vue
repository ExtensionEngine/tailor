<template>
  <div class="well">
    <div class="row">
      <div :class="`col-md-${showLevelPicker ? 8 : 10}`">
        <span
          :class="{ 'has-error': vErrors.has('name') }"
          class="form-group">
          <input
            v-model="name"
            v-validate="{ required: true, min: 2, max: 250 }"
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
      <div v-if="showLevelPicker" class="col-md-2">
        <multiselect
          @input="onLevelSelected"
          :value="level"
          :options="levels"
          :allow-empty="false" />
      </div>
      <div class="col-md-2">
        <v-btn @click.stop="create" color="blue-grey" outline>Add</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import filter from 'lodash/filter';
import first from 'lodash/first';
import multiselect from '../../common/Select';
import { withValidation } from 'utils/validation';

export default {
  mixins: [withValidation()],
  data() {
    return {
      name: '',
      level: null
    };
  },
  computed: {
    ...mapGetters('repository', ['repository', 'structure', 'activities']),
    levels() {
      return filter(this.structure, { level: 1 });
    },
    showLevelPicker() {
      return this.levels.length > 1;
    }
  },
  methods: {
    ...mapActions('activities', ['save']),
    ...mapMutations('repository', ['focusActivity']),
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
          repositoryId: this.repository.id,
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
.well {
  background-color: white;
  border: 1px solid #ccc;

  input {
    margin: 6px;
    padding-left: 5px;
  }
}
</style>
