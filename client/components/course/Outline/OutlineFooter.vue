<template>
  <v-row>
    <v-col class="text-left py-1">
      <v-alert v-if="!anchor" type="info" color="primary" prominent class="mb-5">
        Click on the button bellow in order to create your first item!
      </v-alert>
      <create-dialog
        :repository-id="course.id"
        :levels="levels"
        :anchor="anchor"
        show-activator
        class="pull-left" />
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import CreateDialog from './InsertActivity/CreateDialog';
import filter from 'lodash/filter';
import last from 'lodash/last';

export default {
  computed: {
    ...mapGetters('course', ['course', 'structure', 'activities']),
    levels: vm => filter(vm.structure, { level: 1 }),
    anchor: vm => last(vm.activities)
  },
  methods: {
    ...mapMutations('course', ['focusActivity'])
  },
  components: { CreateDialog }
};
</script>
