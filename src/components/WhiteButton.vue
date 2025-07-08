<template>
  <!-- From Uiverse.io by TCdesign-dev -->
  <button class="button-name" :class="buttonTypeClass" role="button">{{ content }}</button>

</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  content: String,
  type: {
    type: String,
    default: 'default'
  }
})

// 根据type计算按钮样式类
const buttonTypeClass = computed(() => {
  return `button-${props.type}`
})
</script>

<style scoped>
.button-name {
  align-items: center;
  appearance: none;
  background-color: #fcfcfd;
  border-radius: 4px;
  border-width: 0;

  box-sizing: border-box;
  color: #36395a;
  cursor: pointer;
  display: inline-flex;
  height: 28px;
  justify-content: center;
  line-height: 1;
  list-style: none;
  overflow: hidden;
  padding-left: 16px;
  padding-right: 16px;
  position: relative;
  text-align: left;
  text-decoration: none;
  transition:
    box-shadow 0.15s,
    transform 0.15s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  will-change: box-shadow, transform;
  font-size: 10px;
}


.button-name:hover {
  box-shadow:
    rgba(45, 35, 66, 0.3) 0 4px 8px,
    rgba(45, 35, 66, 0.2) 0 7px 13px -3px,
    #d6d6e7 0 -3px 0 inset;
  transform: translateY(-2px);
}

.button-name:active {
  transform: translateY(2px);
}

/* 不同type的按钮样式 */
.button-primary {
  background-color: #3b82f6;
  color: #ffffff;
  box-shadow:
    rgba(59, 130, 246, 0.2) 0 2px 4px,
    rgba(59, 130, 246, 0.15) 0 7px 13px -3px,
    #1d4ed8 0 -3px 0 inset;
}

.button-primary:hover {
  box-shadow:
    rgba(59, 130, 246, 0.3) 0 4px 8px,
    rgba(59, 130, 246, 0.2) 0 7px 13px -3px,
    #1d4ed8 0 -3px 0 inset;
}

.button-primary:active {
  box-shadow: #1d4ed8 0 3px 7px inset;
}

.button-success {
  background-color: #10b981;
  color: #ffffff;
  box-shadow:
    rgba(16, 185, 129, 0.2) 0 2px 4px,
    rgba(16, 185, 129, 0.15) 0 7px 13px -3px,
    #059669 0 -3px 0 inset;
}

.button-success:hover {
  box-shadow:
    rgba(16, 185, 129, 0.3) 0 4px 8px,
    rgba(16, 185, 129, 0.2) 0 7px 13px -3px,
    #059669 0 -3px 0 inset;
}

.button-success:active {
  box-shadow: #059669 0 3px 7px inset;
}

.button-warning {
  background-color: #f59e0b;
  color: #ffffff;
  box-shadow:
    rgba(245, 158, 11, 0.2) 0 2px 4px,
    rgba(245, 158, 11, 0.15) 0 7px 13px -3px,
    #d97706 0 -3px 0 inset;
}

.button-warning:hover {
  box-shadow:
    rgba(245, 158, 11, 0.3) 0 4px 8px,
    rgba(245, 158, 11, 0.2) 0 7px 13px -3px,
    #d97706 0 -3px 0 inset;
}

.button-warning:active {
  box-shadow: #d97706 0 3px 7px inset;
}

.button-danger {
  background-color: #ef4444;
  color: #ffffff;
  box-shadow:
    rgba(239, 68, 68, 0.2) 0 2px 4px,
    rgba(239, 68, 68, 0.15) 0 7px 13px -3px,
    #dc2626 0 -3px 0 inset;
}

.button-danger:hover {
  box-shadow:
    rgba(239, 68, 68, 0.3) 0 4px 8px,
    rgba(239, 68, 68, 0.2) 0 7px 13px -3px,
    #dc2626 0 -3px 0 inset;
}

.button-danger:active {
  box-shadow: #dc2626 0 3px 7px inset;
}

.button-info {
  background-color: #06b6d4;
  color: #ffffff;
  box-shadow:
    rgba(6, 182, 212, 0.2) 0 2px 4px,
    rgba(6, 182, 212, 0.15) 0 7px 13px -3px,
    #0891b2 0 -3px 0 inset;
}

.button-info:hover {
  box-shadow:
    rgba(6, 182, 212, 0.3) 0 4px 8px,
    rgba(6, 182, 212, 0.2) 0 7px 13px -3px,
    #0891b2 0 -3px 0 inset;
}

.button-info:active {
  background-color: #06b6d4;
  color: #ffffff;
  box-shadow:
    rgba(6, 182, 212, 0.2) 0 2px 4px,
    rgba(6, 182, 212, 0.15) 0 7px 13px -3px,
    #0891b2 0 -3px 0 inset;
}
</style>