<template>
  <div class="exams">
    <h2>Exams</h2>
    <ul class="list-group">
      <exam v-for="it in exams" :key="it._cid" :exam="it"></exam>
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
  margin: 50px 0 20px 0;
  padding: 0;
  font-size: 18px;
  color: #444;
  text-align: left;
}

.exams {
  margin: 80px 0 200px 0;
}

.create-exam {
  min-width: 210px;
  margin: 40px 0;
}
</style>
