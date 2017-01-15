<template>
  <div class="course-card">
    <div class="body">
      <div class="title">
        <router-link :to="{ name: 'course-details', params: { courseKey: id }}">
          {{ course.name }}
        </router-link>
      </div>
      <div class="description">{{ shortDescription }}</div>
    </div>
    <div class="footer">
      <div class="row">
        <span class="col-xs-4">stats #1</span>
        <span class="col-xs-4">stats #2</span>
        <span class="col-xs-4">stats #3</span>
      </div>
    </div>
  </div>
</template>

<script>
import truncate from 'truncate';

export default {
  name: 'course-card',
  props: ['course'],
  computed: {
    shortDescription() {
      return truncate(this.course.description, 180);
    }
  }
};
</script>

<style lang="scss">
.course-card {
  min-height: 300px;
  margin-top: 30px;
  padding: 30px;
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
    margin: 20px 0 5px 0;
    font-size: 20px;
    text-align: left;

    a {
      color: inherit;
      text-decoration: none;
    }
  }

  .description {
    max-height: 120px;
    padding-bottom: 10px;
    font-size: 15px;
    text-align: left;
  }

  .footer {
    border-top: 1px solid #e0e0e0;
    padding-top: 10px;
  }
}
</style>
