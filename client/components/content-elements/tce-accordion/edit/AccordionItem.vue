<template>
  <v-expansion-panel>
    <v-expansion-panel-header color="primary lighten-4">
      <v-text-field
        v-if="isEditingHeader"
        v-model="header"
        @click.stop
        @keyup.space.prevent
        hide-details filled dense />
      <div v-else class="pl-3 text-truncate">{{ item.header }}</div>
      <template v-if="!isDisabled">
        <div v-if="isEditingHeader" class="actions">
          <v-btn @click.stop="saveHeader" color="green darken-2" icon>
            <v-icon>mdi-check</v-icon>
          </v-btn>
          <v-btn @click.stop="isEditingHeader = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <div v-else class="actions">
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-btn v-on="on" @click.stop="editHeader" icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Edit heading</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-btn v-on="on" @click.stop="deleteItem" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Delete item</span>
          </v-tooltip>
        </div>
      </template>
    </v-expansion-panel-header>
    <v-expansion-panel-content color="primary lighten-5" eager>
      <v-alert
        v-if="!hasElements && !isDisabled"
        color="primary darken-2"
        icon="mdi-information-variant"
        text prominent
        class="mt-6">
        Click the button below to add content element.
      </v-alert>
      <embedded-container
        @save="({ embeds }) => save(item, embeds)"
        @delete="deleteEmbed($event)"
        :container="{ embeds }"
        :is-disabled="isDisabled" />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { EmbeddedContainer } from '@tailor-cms/core-components';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import { mapRequests } from '@extensionengine/vue-radio';

export default {
  name: 'accordion-item',
  props: {
    item: { type: Object, required: true },
    embeds: { type: Object, default: () => ({}) },
    isDisabled: { type: Boolean, default: false }
  },
  data() {
    return {
      header: this.item.header,
      isEditingHeader: false
    };
  },
  computed: {
    hasElements: vm => !isEmpty(vm.embeds)
  },
  methods: {
    ...mapRequests('app', ['showConfirmationModal']),
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
      this.showConfirmationModal({
        title: 'Delete accordion item',
        message: 'Are you sure you want to delete selected item?',
        action: () => this.$emit('delete', this.item.id)
      });
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

<style lang="scss" scoped>
.actions {
  width: 6rem;
  max-width: 6rem;
  padding-left: 0.5rem;
}
</style>
