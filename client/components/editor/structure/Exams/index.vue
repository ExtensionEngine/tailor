<template>
  <div class="exams">
    <h2>Exams</h2>
    <ul class="list-group">
      <exam
        v-for="(exam, index) in exams"
        :key="exam._cid"
        :exam="exam"
        :position="index">
      </exam>
    </ul>
    <button @click="create" class="btn btn-primary create-exam">
      <span class="mdi mdi-plus"></span>
      Create Exam Version
    </button>
  </div>
</template>

<script>
import Exam from './Exam';
import filter from 'lodash/filter';
import { mapActions, mapGetters } from 'vuex-module';

export default {
  name: 'exams',
  computed: {
    ...mapGetters(['activity'], 'editor'),
    ...mapGetters(['activities']),
    exams() {
      const parentId = this.activity.id;
      return filter(this.activities, { parentId, type: 'EXAM' });
    }
  },
  methods: {
    ...mapActions(['save'], 'activities'),
    create() {
      this.save({
        type: 'EXAM',
        parentId: this.activity.id,
        position: this.exams.length + 1
      });
    }
  },
  components: {
    Exam
  }
};
</script>

<style lang="scss" scoped>
h2 {
  margin: 50px 0 20px;
  padding: 0;
  color: #444;
  font-size: 18px;
  text-align: left;
}

.exams {
  margin: 80px 0 200px;
}

.create-exam {
  min-width: 210px;
  margin: 40px 0;
}
</style>
