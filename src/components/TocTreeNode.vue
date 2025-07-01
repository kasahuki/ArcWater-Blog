<template>
  <li class="toc-tree-node">
    <div class="toc-tree-row" :class="{ active: node.isActive }" @click.stop="onClick">
      <span v-if="node.children && node.children.length" class="toc-tree-toggle" @click.stop="toggle">
        <svg v-if="!node.isCollapsed" width="14" height="14" viewBox="0 0 24 24">
          <path d="M8 10l4 4 4-4" stroke="#888" stroke-width="2" fill="none" stroke-linecap="round" />
        </svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24">
          <path d="M6 8l6 6 6-6" stroke="#888" stroke-width="2" fill="none" stroke-linecap="round" />
        </svg>
      </span>
      <a :href="'#' + node.id" v-html="node.htmlTitle" @click.prevent="emitClick" />
    </div>
    <ul v-if="node.children && node.children.length && !node.isCollapsed" class="toc-tree-children">
      <TocTreeNode v-for="child in node.children" :key="child.id" :node="child"
        @toc-click="$emit('toc-click', $event)" />
    </ul>
  </li>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
const props = defineProps({ node: Object })
const emit = defineEmits(['toc-click'])
const toggle = () => { props.node.isCollapsed = !props.node.isCollapsed }
const emitClick = () => emit('toc-click', props.node.id)
const onClick = (e) => {
  // 只高亮，不跳转
  emit('toc-click', props.node.id)
}
</script>

<style scoped>
.toc-tree-node {
  list-style: none;
  margin: 0;
  padding: 0;
}

.toc-tree-row {
  display: flex;
  align-items: center;
  padding: 2px 0 2px 4px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s;
  position: relative;
  user-select: none;
}

.toc-tree-row.active {
  background: linear-gradient(90deg, #e3f0ff 0%, #f6fbff 100%);
  color: #1976d2;
}

.toc-tree-row:hover {
  background: #f0f4fa;
}

.toc-tree-toggle {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 2px;
  cursor: pointer;
  transition: transform 0.18s;
}

.toc-tree-row a {
  color: inherit;
  text-decoration: none;
  font-size: 1rem;
  flex: 1;
  padding: 2px 0 2px 2px;
  transition: color 0.18s;
  white-space: pre-line;
}

.toc-tree-children {
  margin-left: 1.1em;
  padding-left: 0.5em;
  border-left: 1.5px dashed #e0e6ef;
}
</style>