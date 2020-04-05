<template>
  <div>
    <v-expansion-panel-header>
      <v-row>
        <v-col cols="7">
          <v-text-field v-model="header" :disabled="!isEditingHeader" />
        </v-col>
        <v-col class="d-flex align-center">
          <div v-if="!isEditingHeader">
            <v-btn @click.stop="editHeader" icon small>
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
            <v-btn @click.stop="deleteItem" icon small>
              <v-icon small>mdi-delete</v-icon>
            </v-btn>
          </div>
          <div v-else>
            <v-btn @click.stop="saveHeader" icon small>
              <v-icon small>mdi-content-save</v-icon>
            </v-btn>
            <v-btn @click.stop="isEditingHeader = false" icon small>
              <v-icon small>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-alert v-if="!hasElements" color="grey lighten-3">
        Click the button below to Add your first content element.
      </v-alert>
      <embedded-container
        @save="({ embeds }) => save(item, embeds)"
        @delete="deleteEmbed($event)"
        :container="{ embeds }" />
    </v-expansion-panel-content>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { EmbeddedContainer } from 'tce-core';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';

export default {
  name: 'accordion-item',
  props: {
    item: { type: Object, required: true },
    embeds: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      header: this.item.header,
      isCollapsed: true,
      isEditingHeader: false
    };
  },
  computed: {
    hasElements() {
      return !isEmpty(this.embeds);
    }
  },
  methods: {
    toggle() {
      this.isCollapsed = !this.isCollapsed;
    },
    editHeader() {
      this.isEditingHeader = true;
      this.header = this.item.header;
    },
    saveHeader() {
      this.isEditingHeader = false;
      this.save({ ...this.item, header: this.header }, this.embeds);
    },
    save(item, embeds = {}) {
      item = cloneDeep(item);
      forEach(embeds, it => (item.body[it.id] = true));
      this.$emit('save', { item, embeds });
    },
    deleteItem() {
      this.$emit('delete', this.item.id);
    },
    deleteEmbed(embed) {
      const embeds = cloneDeep(this.embeds);
      const item = cloneDeep(this.item);
      delete embeds[embed.id];
      delete item.body[embed.id];
      this.$emit('save', { item, embeds });
    }
  },
  components: { EmbeddedContainer }
};
</script>
