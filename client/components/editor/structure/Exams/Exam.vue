<template>
  <div class="exam">
    <div class="actions">
      <span
        @click="remove(exam)"
        class="btn btn-inverse btn-sm pull-right">
        Delete exam
        <span class="mdi mdi-delete"></span>
      </span>
    </div>
    <assessment-group
      v-for="it in groups"
      :key="it._cid"
      :group="it">
    </assessment-group>
    <button @click="createGroup" class="btn btn-primary create-group">
      <span class="mdi mdi-plus"></span>
      Create Question Group
    </button>
  </div>
</template>

<script>
import AssessmentGroup from './AssessmentGroup';
import filter from 'lodash/filter';
import { mapActions, mapGetters } from 'vuex-module';

export default {
  name: 'exam',
  props: ['exam'],
  computed: {
    ...mapGetters(['activities']),
    groups() {
      return filter(this.activities, { parentId: this.exam.id });
    }
  },
  methods: {
    ...mapActions(['save', 'remove'], 'activities'),
    createGroup() {
      this.save({
        type: 'ASSESSMENT_GROUP',
        parentId: this.exam.id,
        position: this.groups.length + 1
      });
    }
  },
  components: {
    AssessmentGroup
  }
};
</script>

<style lang="scss" scoped>
.exam {
  width: 100%;
  min-height: 245px;
  margin: 25px 0px;
  padding: 20px 40px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.30);
}

.actions {
  width: 100%;
  min-height: 50px;
  color: #555;
}

.create-group {
  min-width: 210px;
  margin: 40px 0;
}
</style>
