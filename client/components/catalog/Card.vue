<template>
  <div class="courses-card">
    <div class="header">
      <img :src="placeholder" alt="Responsive image"  />
    </div>
    <div class="body">
      <div class="title">
        <router-link :to="{ name: 'course', params: { id }}">
          {{ title }}
        </router-link>
      </div>
      <div class="content">{{ preview }}</div>
    </div>
    <div class="footer">
      <div class="row">
        <span class="col-xs-4">stats #1</span>
        <span class="col-xs-4">stats #2</span>
        <span class="col-xs-4">stats #3</span>
      </ul>
    </div>
  </div>
</template>

<script>
import truncate from 'truncate';

export default {
  name: 'course-card',
  props: ['id', 'title', 'description', 'image'],
  computed: {
    placeholder() {
      return require(`../../assets/img/${this.image}`);
    },
    preview() {
      return truncate(this.description, 180);
    }
  }
};
</script>

<style lang="scss">
.courses-card {
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

  .header {
    max-height: 180px;
    overflow: hidden;

    img {
      max-width: 100%;
      max-height: 100%;
    }
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

  .content {
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
