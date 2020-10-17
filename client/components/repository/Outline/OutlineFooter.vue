<template>
  <v-row>
    <v-col class="text-left">
      <v-alert
        v-if="!anchor"
        color="blue-grey darken-2"
        icon="mdi-information-variant"
        prominent text
        class="mb-5">
        Click on the button below in order to create your first item!
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
import CreateDialog from '@/components/repository/common/CreateDialog';
import last from 'lodash/last';
import { mapGetters } from 'vuex';

export default {
  props: {
    rootActivities: { type: Array, required: true }
  },
  computed: {
    ...mapGetters('repository', ['repository', 'structure']),
    levels: vm => vm.structure.filter(it => it.rootLevel),
    anchor: vm => last(vm.rootActivities)
  },
  components: { CreateDialog }
};
</script>
