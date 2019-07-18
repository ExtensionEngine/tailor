<template>
  <assessment-item
    :assessment="assessment"
    :expanded="expanded"
    :draggable="true"
    @selected="expanded = !expanded"
    @save="save"
    @delete="$emit('delete')">
    <template slot="header" slot-scope="{ isEditing }">
      <v-container v-if="objectives.length" class="pa-0 mt-2">
        <v-layout justify-end>
          <v-flex xs4>
            <multiselect
              v-model="objective"
              :options="objectives"
              :searchable="true"
              :disabled="!isEditing"
              :trackBy="'id'"
              :customLabel="it => it.data ? it.data.name : ''"
              :placeholder="objectiveLabel"/>
          </v-flex>
        </v-layout>
      </v-container>
    </template>
  </assessment-item>
</template>

<script>
import AssessmentItem from '@/components/editor/structure/AssessmentItem';
import find from 'lodash/find';
import get from 'lodash/get';
import Multiselect from '@/components/common/Select';
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
    save(assessment) {
      set(assessment, 'refs.objectiveId', get(this.objective, 'id', null));
      this.$emit('save', assessment);
    }
  },
  mounted() {
    const objectiveId = get(this.assessment, 'refs.objectiveId');
    if (!objectiveId) return;
    this.objective = find(this.objectives, { id: objectiveId });
  },
  components: {
    AssessmentItem,
    Multiselect
  }
};
</script>
