<template>
  <div class="courses-card">
    <div class="header">
      <a href="#">
        Course Title
      </a>
    </div>

    <div class="content">
      It's just like the story of the grasshopper and the octopus.
      All year long, the grasshopper kept burying acorns for winter,
      while the octopus mooched off his girlfriend and watched TV.
      But then the winter came, and the grasshopper died, and the
      octopus ate all his acorns.
    </div>

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
    name: 'course-card'
  };
</script>

<style lang="scss">
  .courses-card {
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.74);
    min-height: 300px;
    padding: 30px;
    transition: box-shadow 0.2s ease;

    @media only screen and (max-width: 992px) {
      margin-top: 30px;
    }

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
