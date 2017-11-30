<template>
  <ul class="thread">
    <li
      v-for="comment in thread"
      :key="comment.id"
      class="clearfix comment">
      <span v-if="avatars" class="pull-left avatar">
        <span class="icon mdi mdi-account-circle"></span>
      </span>
      <div class="content-wrapper">
        <span class="header">
          <span class="author">{{ comment.author.email }}</span>
          <timeago
            :since="comment.createdAt"
            :auto-update="60"
            class="pull-right time">
          </timeago>
        </span>
        <span class="content">{{ comment.content }}</span>
      </div>
    </li>
  </ul>
</template>

<script>
import includes from 'lodash/includes';
import orderBy from 'lodash/orderBy';
import toLower from 'lodash/toLower';

export default {
  name: 'comment-thread',
  props: {
    comments: { type: Array, required: true },
    avatars: { type: Boolean, default: true },
    sort: { ...enumOf('asc', 'desc'), default: 'desc' }
  },
  computed: {
    thread() {
      return orderBy(this.comments, ['createdAt'], [this.sort]);
    }
  }
};

function enumOf(...keys) {
  const values = keys.map(it => toLower(it).trim());
  return {
    type: String,
    validator: val => includes(values, val)
  };
}
</script>

<style lang="scss" scoped>
$color: #333;
$avatar-size: 40px;
$font-size: 16px;
$line-size: 20px;

.thread {
  margin: 0;
  padding: 0;
  list-style: none;
}

.comment {
  padding: 8px 0;

  .avatar {
    width: $avatar-size;
    height: $avatar-size;
    margin-top: 4px;
    margin-right: 10px;
    border-radius: 50%;
    line-height: $avatar-size;
    background: #e0e0e0;
    text-align: center;
    vertical-align: middle;

    .icon {
      color: #aaa;
      font-size: $avatar-size;
      background: #fff;
    }
  }

  .content {
    display: inline-block;
    font-size: $font-size;
    line-height: $line-size;
    white-space: pre;
  }

  .header {
    display: block;
    margin-bottom: 4px;
    color: lighten($color, 25%);
    font-size: 14px;
    font-weight: 500;

    .time {
      font-size: 12px;
    }
  }
}
</style>
