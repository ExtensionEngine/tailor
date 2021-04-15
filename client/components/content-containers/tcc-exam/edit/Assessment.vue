<template>
  <assessment-item
    @selected="expanded = !expanded"
    @save="save"
    @delete="$emit('delete')"
    :assessment="assessment"
    :expanded="expanded"
    :draggable="true">
    <template v-slot:header="{ isEditing }">
      <v-row v-if="objectives.length" justify="end" no-gutters class="mt-2">
        <v-col cols="5">
          <v-autocomplete
            v-model="objective"
            :items="objectives"
            item-text="data.name"
            :disabled="!isEditing"
            :placeholder="objectiveLabel"
            return-object />
        </v-col>
      </v-row>
    </template>
  </assessment-item>
</template>

<script>
import { AssessmentItem } from '@tailor/components';
import find from 'lodash/find';
import get from 'lodash/get';
import set from 'lodash/set';

export default {
  props: {
    assessment: { type: Object, required: true },
    objectives: { type: Array, required: true },
    objectiveLabel: { type: String, required: true }
  },
  data() {
    return {
      expanded: !this.assessment.id,
      objective: null
    };
  },
  methods: {
    getCustomLabel: ({ data }) => get(data, 'name', ''),
    save(assessment) {
      set(assessment, 'refs.objectiveId', get(this.objective, 'id', null));
      this.$emit('save', assessment);
    }
  },
  created() {
    const objectiveId = get(this.assessment, 'refs.objectiveId');
    if (!objectiveId) return;
    this.objective = find(this.objectives, { id: objectiveId });
  },
  components: {
    AssessmentItem
  }
};
</script>
