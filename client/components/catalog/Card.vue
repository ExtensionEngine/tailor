<template>
  <div class="col-lg-4">
    <div class="course-card" @click="navigateTo">
      <div class="body">
        <div class="title">{{ name }}</div>
        <div class="description">{{ description }}</div>
      </div>
      <div class="footer">
        <div class="row">
          <span class="col-xs-4">stats #1</span>
          <span class="col-xs-4">stats #2</span>
          <span class="col-xs-4">stats #3</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import truncate from 'truncate';

export default {
  props: ['course'],
  computed: {
    name() {
      return truncate(this.course.name, 100);
    },
    description() {
      return truncate(this.course.description, 180);
    }
  },
  methods: {
    navigateTo() {
      if (window.getSelection().toString()) return;
      this.$router.push({
        name: 'course',
        params: { courseKey: this.course.id }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.course-card {
  min-height: 300px;
  margin-top: 30px;
  padding: 30px 30px 20px 30px;
  font-family: Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.54);
  transition: box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.54);
  }

  .body {
    height: 220px;
    overflow: hidden;
  }

  .title {
    margin: 20px 0 10px 0;
    height: 100px;
    font-size: 18px;
    text-align: left;

    a {
      color: inherit;
      text-decoration: none;
    }
  }

  .description {
    max-height: 130px;
    font-size: 14px;
    text-align: left;
  }

  .footer {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #ddd;
  }
}
</style>
