<template>
  <div
    id="quillToolbar"
    class="quill-toolbar">
    <select class="ql-font"></select>
    <select class="ql-header"></select>
    <button class="ql-bold"></button>
    <button class="ql-italic"></button>
    <button class="ql-underline"></button>
    <button class="ql-strike"></button>
    <button class="ql-blockquote"></button>
    <button class="ql-code-block"></button>
    <button class="ql-script" value="sub"></button>
    <button class="ql-script" value="super"></button>
    <select class="ql-color">
      <option value="rgb(0, 0, 0)"/>
      <option value="rgb(230, 0, 0)"/>
      <option value="rgb(255, 153, 0)"/>
      <option value="rgb(255, 255, 0)"/>
      <option value="rgb(0, 138, 0)"/>
      <option value="rgb(0, 102, 204)"/>
      <option value="rgb(153, 51, 255)"/>
      <option value="rgb(255, 255, 255)"/>
      <option value="rgb(250, 204, 204)"/>
      <option value="rgb(255, 235, 204)"/>
      <option value="rgb(204, 224, 245)"/>
      <option value="rgb(235, 214, 255)"/>
      <option value="rgb(187, 187, 187)"/>
      <option value="rgb(102, 185, 102)"/>
    </select>
    <select class="ql-background">
      <option value="rgb(0, 0, 0)"/>
      <option value="rgb(230, 0, 0)"/>
      <option value="rgb(255, 153, 0)"/>
      <option value="rgb(255, 255, 0)"/>
      <option value="rgb(0, 138, 0)"/>
      <option value="rgb(0, 102, 204)"/>
      <option value="rgb(153, 51, 255)"/>
      <option value="rgb(255, 255, 255)"/>
      <option value="rgb(250, 204, 204)"/>
      <option value="rgb(255, 235, 204)"/>
      <option value="rgb(204, 224, 245)"/>
      <option value="rgb(235, 214, 255)"/>
      <option value="rgb(187, 187, 187)"/>
      <option value="rgb(102, 185, 102)"/>
    </select>
  </div>
</template>

<script>
export default {
  name: 'quill-toolbar'
};
</script>

<style lang="scss">
.quill-toolbar {
  display: none;
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 45px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.34);
}

.quill-toolbar.ql-toolbar {
  display: block;
}
</style>
