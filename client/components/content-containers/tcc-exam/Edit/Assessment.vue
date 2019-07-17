<template>
  <assessment-item
    :assessment="assessment"
    :expanded="expanded"
    :draggable="true"
    @selected="$emit('selected')"
    @save="save"
    @delete="$emit('delete')">
    <template slot="header" slot-scope="{ isEditing }">
      <div v-if="objectives.length" class="select-leaf">
        <multiselect
          v-model="objective"
          :options="objectives"
          :searchable="true"
          :disabled="!isEditing"
          :trackBy="'id'"
          :customLabel="it => it.data ? it.data.name : ''"
          :placeholder="objectiveLabel"/>
      </div>
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
    objectiveLabel: { type: String, required: true },
    expanded: { type: Boolean, required: true }
  },
  data() {
    return { objective: null };
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

<style lang="scss" scoped>
.select-leaf {
  clear: both;

  > div {
    width: 400px;
    float: right;
  }
}
</style>
