<template>
  <v-row class="item-container grey lighten-5 align-center">
    <v-col class="grow">
      <v-text-field
        v-model="name"
        v-validate="{ required: true, min: 2, max: 250 }"
        :error-messages="vErrors.collect('name')"
        :autofocus="true"
        :placeholder="namePlaceholder"
        name="name" />
    </v-col>
    <v-col v-if="showTypeSelect" class="col-3 type-container">
      <v-select
        v-model="type"
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
        color="secondary lighten-1"
        depressed
        class="px-5">
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
      type: null
    };
  },
  computed: {
    ...mapGetters('course', ['course', 'structure', 'activities']),
    levels: vm => filter(vm.structure, { level: 1 }),
    showTypeSelect: vm => vm.levels.length > 1,
    namePlaceholder: vm => vm.showTypeSelect ? 'Name' : `${vm.levels[0].label} name`
  },
  methods: {
    ...mapActions('activities', ['save']),
    ...mapMutations('course', ['focusActivity']),
    async create() {
      const isValid = await this.$validator.validateAll();
      if (!isValid) return;
      await this.save({
        type: this.type,
        data: { name: this.name },
        courseId: this.course.id,
        position: 1
      });
      const activity = first(this.activities);
      if (activity) this.focusActivity(activity._cid);
    }
  },
  created() {
    if (!this.showTypeSelect) this.type = first(this.levels).type;
  }
};
</script>

<style lang="scss" scoped>
.item-container {
  min-width: 100%;
  padding: 0.75rem 2.5rem;
}

.type-container {
  min-width: 12.5rem;
}
</style>
