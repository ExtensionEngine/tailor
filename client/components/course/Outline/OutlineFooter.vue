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
  computed: {
    ...mapGetters('course', ['course', 'structure', 'activities']),
    levels: vm => filter(vm.structure, { level: 1 }),
    anchor: vm => last(vm.activities)
  },
  components: { CreateDialog }
};
</script>
