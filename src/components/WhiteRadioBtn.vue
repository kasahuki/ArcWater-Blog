<template>
  <!-- From Uiverse.io by elijahgummer -->
  <div class="btn-group">
    <button class="btn left" type="button">Left</button>
    <button class="btn middle" type="button">Middle</button> <button class="btn right" type="button">Right</button>
  </div>

</template>
<script>
</script>
<style scoped>
.btn {
  font: inherit;
  background-color: #f0f0f0;
  border: 0;
  color: #242424;
  font-size: 1.15rem;
  padding: 0.375em 1em;
  text-shadow: 0 0.0625em 0 #fff;
  box-shadow: inset 0 0.0625em 0 0 #f4f4f4, 0 0.0625em 0 0 #efefef,
    0 0.125em 0 0 #ececec, 0 0.25em 0 0 #e0e0e0, 0 0.3125em 0 0 #dedede,
    0 0.375em 0 0 #dcdcdc, 0 0.425em 0 0 #cacaca, 0 0.425em 0.5em 0 #cecece;
  transition: 0.23s ease;
  cursor: pointer;
  font-weight: bold;
  margin: -1px;
}

.middle {
  border-radius: 0px;
}

.right {
  border-top-right-radius: 0.5em;
  border-bottom-right-radius: 0.5em;
}

.left {
  border-top-left-radius: 0.5em;
  border-bottom-left-radius: 0.5em;
}

.btn:active {
  translate: 0 0.225em;
  box-shadow: inset 0 0.03em 0 0 #f4f4f4, 0 0.03em 0 0 #efefef,
    0 0.0625em 0 0 #ececec, 0 0.125em 0 0 #e0e0e0, 0 0.125em 0 0 #dedede,
    0 0.2em 0 0 #dcdcdc, 0 0.225em 0 0 #cacaca, 0 0.225em 0.375em 0 #cecece;
  letter-spacing: 0.1em;
  color: skyblue;
}

.btn:focus {
  color: skyblue;
}
</style>