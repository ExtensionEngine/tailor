<template>
  <v-row>
    <v-col class="text-left py-1">
      <v-alert v-if="!anchor" type="info" color="blue-grey darken-3" prominent class="mb-5">
        Click on the button bellow in order to create your first item!
      </v-alert>
      <create-dialog
        :repository-id="course.id"
        :levels="levels"
        :anchor="anchor"
        show-activator />
    </v-col>
  </v-row>
</template>

<script>
import CreateDialog from './InsertActivity/CreateDialog';
import filter from 'lodash/filter';
import last from 'lodash/last';
import { mapGetters } from 'vuex';

export default {
  props: {
    rootActivities: { type: Array, required: true }
  },
  computed: {
    ...mapGetters('course', ['course', 'structure']),
    levels: vm => filter(vm.structure, { level: 1 }),
    anchor: vm => last(vm.rootActivities)
  },
  components: { CreateDialog }
};
</script>
