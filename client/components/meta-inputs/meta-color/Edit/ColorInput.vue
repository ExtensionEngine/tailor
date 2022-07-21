<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false">
    <template #activator="{ on }">
      <div v-on="on" class="preview">
        <div :style="{ background: value }" class="selected">
          <span class="mdi mdi-eyedropper eyedropper"></span>
        </div>
      </div>
    </template>
    <v-card>
      <v-color-picker
        @input="color = $event"
        :value="value"
        flat
        mode="hexa"
        width="250" />
      <v-card-actions>
        <v-spacer />
        <v-btn @click="menu = false" small text>Cancel</v-btn>
        <v-btn @click="submit" small text color="primary darken-2">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  props: {
    value: { type: String, required: true }
  },
  data() {
    return {
      menu: false,
      color: this.value || '#ffffff'
    };
  },
  methods: {
    submit() {
      this.$emit('input', this.color);
      this.menu = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.preview {
  float: left;
  margin-right: 10px;
}

.selected {
  width: 40px;
  height: 40px;
  text-align: center;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.15);

  .eyedropper {
    color: #fff;
    font-size: 18px;
    line-height: 40px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover .eyedropper {
    opacity: 1;
  }
}

::v-deep .v-color-picker__edit {
  margin-top: 16px;

  input {
    font-size: 14px;
  }
}
</style>
