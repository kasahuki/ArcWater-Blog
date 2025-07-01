<template>
  <button class="more-button" @click="$emit('click')">
    <slot>More</slot>
    <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  </button>
</template>

<script setup>
// 无需额外逻辑，事件透传
</script>

<style scoped>
.more-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #007aff;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.75rem 1.5rem;
  border: 2px solid #007aff;
  border-radius: 8px;
  background: rgba(0, 122, 255, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.more-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 122, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.more-button:hover {
  background: rgba(0, 122, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.2);
}

.more-button:hover::before {
  left: 100%;
}

.more-button:hover .arrow-icon {
  transform: translateX(4px);
}

.arrow-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}
</style>