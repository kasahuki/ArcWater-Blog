<template>
  <h3 class="section-title">
    <span class="title-text">{{ title }}</span>
    <span class="title-decoration"></span>
  </h3>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.section-title {
  position: relative;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
}

.section-title .title-text {
  font-family: -apple-system, SF Pro Display, sans-serif;
  font-size: 28px;
  font-weight: 600;
  background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
  -webkit-background-clip: text;
  color: transparent;
  margin-right: 16px;
  text-transform: capitalize;
  letter-spacing: 0.05em;
}

.section-title .title-decoration {
  flex: 1;
  height: 2px;
  background: linear-gradient(to right,
      var(--el-color-primary-light-5),
      transparent);
}
</style>