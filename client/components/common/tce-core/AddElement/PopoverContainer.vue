<template>
  <div :class="{ opened }" class="insert-element">
    <hr @click="$emit('toggle')"/>
    <v-menu
      v-model="opened"
      :close-on-click="false"
      :close-on-content-click="false"
      :lazy="true"
      :nudge-bottom="10"
      :offset-y="true"
      min-width="675"
      z-index="101"
      attach=""
      content-class="selection-menu">
      <template slot="activator">
        <slot name="toggle"/>
      </template>
      <slot name="selection"/>
    </v-menu>
    <hr @click="$emit('toggle')"/>
  </div>
</template>

<script>
export default {
  props: {
    opened: { type: Boolean, default: false }
  }
};
</script>

<style lang="scss" scoped>
.add-element.insert-element {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 0;
  opacity: 0;
  transition: opacity 0.8s ease-in-out, margin 0.2s ease-in-out;

  &:hover {
    opacity: 1;
  }

  &.opened {
    margin: 2px 0;
    opacity: 1;

    hr {
      height: 3px;
    }

    /deep/ .toggle-btn {
      font-size: 28px;
      line-height: 28px;
    }
  }

  hr {
    flex: 1;
    height: 2px;
    margin: 0;
    background-color: #42b983;
    cursor: pointer;
    transition: height 0.2s ease-in-out;
  }

  /deep/ .toggle-btn {
    flex-basis: 30px;
    margin: 0;
    color: #42b983;
    font-size: 24px;
    line-height: 24px;
    background-color: white;
  }
}
</style>

<style lang="scss">
.editor-wrapper .selection-menu {
  transform: translateX(-50%);
  border-radius: 20px;
  background-color: #ffffff;
}
</style>
