<template>
  <v-row>
    <v-col class="text-left">
      <v-alert
        v-if="!anchor"
        type="info"
        color="grey darken-3"
        prominent outlined
        class="mb-5">
        Click on the button bellow in order to create your first item!
      </v-alert>
      <create-dialog
        :repository-id="repository.id"
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
    ...mapGetters('repository', ['repository', 'structure']),
    levels: vm => filter(vm.structure, { level: 1 }),
    anchor: vm => last(vm.rootActivities)
  },
  components: { CreateDialog }
};
</script>
