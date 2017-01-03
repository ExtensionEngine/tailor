<template>
  <div class="row course-list">
    <cube-spinner v-if="loader"></cube-spinner>
    <div v-else v-for="course in courses" class="col-lg-4">
      <card
        :id="course._cid"
        :name="course.name"
        :description="course.description">
      </card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
import Card from './Card';
import CubeSpinner from '../loaders/CubeSpinner';

export default {
  name: 'course-list',
  data() {
    return {
      loader: true
    };
  },
  computed: {
    ...mapGetters(['courses']),
    ...mapGetters(['search'], 'courses')
  },
  methods: mapActions(['fetch'], 'courses'),
  created() {
    this.loader = true;
    this.fetch().then(() => {
      this.loader = false;
    });
  },
  watch: {
    search(value, oldValue) {
      this.loader = true;
      this.fetch({ search: this.search }).then(() => {
        this.loader = false;
      });
    }
  },
  components: {
    Card,
    CubeSpinner
  }
};
</script>
