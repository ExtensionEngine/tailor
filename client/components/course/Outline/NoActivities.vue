<template>
  <v-row class="align-center item-container">
    <v-col class="grow">
      <v-text-field
        v-model="name"
        v-validate="{ required: true, min: 2, max: 250 }"
        :error-messages="vErrors.collect('name')"
        :autofocus="true"
        :placeholder="namePlaceholder"
        name="name" />
    </v-col>
    <v-col class="col-3 type-select">
      <v-select
        v-if="showLevelPicker"
        v-model="levelType"
        v-validate="{ required: true }"
        :error-messages="vErrors.collect('type')"
        :items="levels"
        item-text="label"
        item-value="type"
        name="type"
        placeholder="Type" />
    </v-col>
    <v-col class="shrink">
      <v-btn
        @click.stop="create"
        :disabled="vErrors.any()"
        color="primary lighten-1"
        class="px-5"
        depressed>
        Create
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import filter from 'lodash/filter';
import first from 'lodash/first';
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
  }
};
</script>

<style lang="scss" scoped>
.item-container {
  min-width: 100%;
  padding: 12px 50px;
  background-color: white;
  border: 1px solid #ccc;
}

.type-select {
  min-width: 200px;
}
</style>
