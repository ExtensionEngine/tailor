<template>
  <div class="toolbar">
    <element-toolbar
      v-if="selectedComposite"
      :key="selectedElement.id || selectedElement._cid"
      :element="selectedComposite"
      :embed="selectedElement">
      <slot>
        <element-toolbar :element="selectedElement"/>
      </slot>
    </element-toolbar>
    <element-toolbar
      v-else-if="selectedElement"
      :key="selectedElement.id || selectedElement._cid"
      :element="selectedElement"/>
    <div v-show="!selectedElement" class="toolbar-container editor-toolbar">
      <router-link
        :to="{ name: 'course', params: { courseId } }"
        class="toolbar-btn">
        <span class="mdi mdi-arrow-left"></span>
      </router-link>
      <a
        v-tooltip="'Preview in LMS'"
        v-if="previewUrl"
        :href="previewUrl"
        class="toolbar-btn btn-alt"
        target="_blank">
        <span class="mdi mdi-eye"></span>
      </a>
      <div
        v-tooltip="publishTooltip"
        :class="{ disabled: publishing }"
        @click="publishActivity"
        class="toolbar-btn btn-alt">
        <span class="mdi mdi-publish"></span>
      </div>
      <div v-if="activity" class="editor-heading">
        <h1 :style="{ 'margin-top': breadcrumbs.length ? '1px' : '9px' }">
          {{ activity.data.name }}
        </h1>
        <div class="breadcrumbs">
          <span v-for="(item, index) in breadcrumbs" :key="item.id">
            {{ truncate(item.data.name, breadcrumbs.length > 2 ? 40 : 80) }}
            <span v-if="index !== (breadcrumbs.length - 1)"> / </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
import drop from 'lodash/drop';
import ElementToolbar from '../teaching-elements/toolkit/ElementToolbar';
import EventBus from 'EventBus';
import fecha from 'fecha';
import find from 'lodash/find';
import format from 'string-template';
import get from 'lodash/get';
import truncate from 'truncate';

const { PREVIEW_URL } = process.env;

export default {
  name: 'toolbar',
  data() {
    return {
      selectedElement: null,
      selectedComposite: null,
      publishing: false
    };
  },
  computed: {
    ...mapGetters(['activity'], 'editor'),
    ...mapGetters(['activities']),
    courseId() {
      return get(this.activity, 'courseId');
    },
    publishTooltip() {
      if (!this.activity) return;
      const name = get(this.activity, 'data.name', '');
      const { publishedAt } = this.activity;
      const status = publishedAt
        ? `Published on ${fecha.format(new Date(publishedAt), 'M/D/YY HH:mm')}`
        : '';
      return `Publish '${truncate(name, 30)}'. ${status}`;
    },
    previewUrl() {
      if (!PREVIEW_URL) return;
      const { courseId, activityId } = this.$route.params;
      return format(PREVIEW_URL, { repositoryId: courseId, activityId });
    },
    breadcrumbs() {
      let items = [];
      let item = this.activity;
      while (item) {
        item = find(this.activities, { id: item.parentId });
        if (item) items.unshift(item);
      }
      return items.length > 3 ? drop(items, items.length - 3) : items;
    }
  },
  methods: {
    ...mapActions(['publish'], 'activities'),
    ...mapActions({ removeElement: 'remove' }, 'tes'),
    publishActivity() {
      this.publishing = true;
      this.publish(this.activity).then(() => (this.publishing = false));
    },
    truncate(str, len = 50) {
      return truncate(str, len);
    }
  },
  created() {
    EventBus.on('element:focus', (element, composite) => {
      this.selectedElement = element;
      this.selectedComposite = composite;
    });
  },
  components: { ElementToolbar }
};
</script>

<style lang="scss" scoped>
.toolbar-container {
  position: absolute;
  width: 100%;
  z-index: 999;
}

.editor-toolbar {
  display: flex;
  height: 52px;
  background-color: white;
  box-shadow:
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.2);

  .editor-heading {
    flex: 1;
    min-width: 0;
    padding: 10px 30px 0 20px;
  }

  h1 {
    width: 100%;
    margin: 0 0 1px;
    color: #555;
    font-size: 18px;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .breadcrumbs {
    display: inline-block;
    width: 100%;
    font-size: 12px;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}

.toolbar-btn {
  flex-basis: 0;
  color: white;
  background-color: #144acc;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  cursor: pointer;

  &:hover {
    background-color: darken(#144acc, 10%);
  }

  .mdi {
    display: inline-block;
    padding: 4px 20px 1px;
    font-size: 30px;
  }
}

.toolbar-btn.btn-alt {
  background-color: #2f73e9;

  &:hover {
    background-color: darken(#2f73e9, 10%);
  }
}

.toolbar-btn.disabled {
  pointer-events: none;
  opacity: 0.89;
}
</style>
