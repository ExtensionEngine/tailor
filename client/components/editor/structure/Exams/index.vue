<template>
  <div class="exams">
    <h2>Exams</h2>
    <ul class="list-group">
      <exam
        :key="exam._cid"
        :exam="exam"
        :position="index"
        v-for="(exam, index) in exams" />
    </ul>
    <v-btn @click.stop="create" color="primary" class="mt-4">
      <v-icon class="pr-2">mdi-plus</v-icon>
      Create Exam Version
    </v-btn>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Exam from './Exam';
import filter from 'lodash/filter';

export default {
  name: 'exams',
  computed: {
    ...mapGetters('editor', ['activity']),
    ...mapGetters(['activities']),
    exams() {
      const parentId = this.activity.id;
      return filter(this.activities, { parentId, type: 'EXAM' });
    }
  },
  methods: {
    ...mapActions('activities', ['save']),
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
</style>
