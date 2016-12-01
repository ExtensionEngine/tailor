<template>
  <div class="courses-card">
    <div class="header">
      <a href="#">{{title}}</a>
    </div>

    <div class="content">{{preview}}</div>

    <div class="footer">
      <ul class="row">
        <li class="col-md-4 col-sm-4">stats #1</li>
        <li class="col-md-4 col-sm-4">stats #2</li>
        <li class="col-md-4 col-sm-4">stats #3</li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'course-card',

    props: ['title', 'description'],

    computed: {
      preview() {
        const MAX_CHARS = 180;
        return this.description.length > MAX_CHARS
          ? `${this.description.slice(0, MAX_CHARS)} ...`
          : this.description;
      }
    }
  };
</script>

<style lang="scss">
  .courses-card {
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.74);
    margin-top: 30px;
    min-height: 300px;
    padding: 30px;
    transition: box-shadow 0.2s ease;

    &:hover {
      box-shadow: 0 3px 9px rgba(0, 0, 0, 0.74);
    }

    .header {
      font-weight: 500;
      font-size: 22px;
      min-height: 80px;
      text-align: left;

      a {
        color: inherit;
        text-decoration: none;
      }
    }

    .content {
      font-size: 15px;
      font-weight: 400;
      min-height: 120px;
      padding-bottom: 10px;
      text-align: left;
    }

    .footer {
      border-top: 1px solid #e0e0e0;
      min-height: 40px;
      padding-top: 10px;

      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        width: 100%;

        li {
          display: inline;
          padding: 0;
          text-align: center;

          &:first-child {
            text-align: left;
          }

          &:last-child {
            text-align: right;
          }
        }
      }
    }
  }

</style>
