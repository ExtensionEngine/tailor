<template>
  <div class="well">
    <v-container grid-list-xl fluid>
      <v-layout row align-center>
        <v-flex grow>
          <v-text-field
            v-validate="{ required: true, min: 2, max: 250 }"
            :error-messages="vErrors.collect('name')"
            :autofocus="true"
            v-model="name"
            name="name"
            placeholder="Name"/>
        </v-flex>
        <v-flex shrink>
          <v-select
            v-validate="{ required: true }"
            v-if="showLevelPicker"
            :error-messages="vErrors.collect('type')"
            v-model="levelType"
            :items="levels"
            item-text="label"
            item-value="type"
            name="type"
            placeholder="Type"/>
        </v-flex>
        <v-flex shrink>
          <v-btn
            :disabled="vErrors.any()"
            @click.stop="create"
            color="primary"
            outline>
            Create
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
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
      levelType: null
    };
  },
  computed: {
    ...mapGetters('course', ['course', 'structure', 'activities']),
    levels() {
      return filter(this.structure, { level: 1 });
    },
    showLevelPicker() {
      return this.levels.length > 1;
    }
  },
  methods: {
    ...mapActions('activities', ['save']),
    ...mapMutations('course', ['focusActivity']),
    create() {
      this.$validator.validateAll().then(result => {
        if (!result) return;
        this.save({
          type: this.levelType,
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
    if (!this.showLevelPicker) this.levelType = first(this.levels).type;
  },
  components: { multiselect }
};
</script>

<style lang="scss" scoped>
.well {
  background-color: white;
  border: 1px solid #ccc;
}
</style>
