<template>
  <v-container grid-list-md fluid py-3 class="item-container">
    <v-layout row align-center>
      <v-flex grow>
        <v-text-field
          v-validate="{ required: true, min: 2, max: 250 }"
          :error-messages="vErrors.collect('name')"
          :autofocus="true"
          :placeholder="namePlaceholder"
          v-model="name"
          name="name"/>
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
          color="primary lighten-1"
          class="px-5"
          depressed>
          Create
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
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
    },
    namePlaceholder() {
      return this.showLevelPicker ? 'Name' : `${this.levels[0].label} name`;
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
.item-container {
  background-color: white;
  border: 1px solid #ccc;
}
</style>
