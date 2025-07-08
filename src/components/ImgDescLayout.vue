<template>
  <div class="img-desc-layout">
    <!-- 左侧图片区域 -->
    <div class="img-grid">
      <div class="img-cell" v-for="(img, idx) in images" :key="idx">
        <img :src="img" :alt="'desc-img-' + idx" />
      </div>
    </div>
    <!-- 右侧描述区域 -->
    <div class="desc-area">
      <h2 class="desc-title">{{ title }}</h2>
      <p class="desc-intro">{{ intro }}</p>
      <ul class="desc-list">
        <li v-for="(item, idx) in list" :key="idx">
          <span class="num">{{ idx + 1 }}</span>
          <span v-html="item"></span>
        </li>
      </ul>
      <slot name="action">
        <!-- 默认 Learn More 按钮，可通过插槽自定义 -->
        <button class="learn-more-btn">
          Learn More
          <span class="arrow">→</span>
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  images: {
    type: Array,
    required: true,
    validator: arr => arr.length === 3
  },
  title: {
    type: String,
    required: true
  },
  intro: {
    type: String,
    required: true
  },
  list: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.img-desc-layout {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 32px 0;
}

.img-grid {
  display: grid;
  grid-template-columns: 220px 220px;
  grid-template-rows: 220px 220px;
  gap: 16px;
}

.img-cell {
  background: #f6f6f6;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.img-cell:hover {
  transform: scale(1.05);
}

.img-cell:nth-child(1) {
  grid-row: 1 / 2;
  grid-column: 1 / 2;
}

.img-cell:nth-child(2) {
  grid-row: 1 / 2;
  grid-column: 2 / 3;
}

.img-cell:nth-child(3) {
  grid-row: 2 / 3;
  grid-column: 1 / 3;
}

.img-cell img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.desc-area {
  max-width: 480px;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.desc-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.desc-intro {
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.7;
}

.desc-list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.desc-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 1.05rem;
}

.num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ff7f2e;
  color: #fff;
  font-weight: bold;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  font-size: 1rem;
  margin-top: 2px;
  flex-shrink: 0;
}

.learn-more-btn {
  margin-top: 10px;
  background: #ff7f2e;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 28px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}

.learn-more-btn:hover {
  background: #ff9a4b;
}

.arrow {
  font-size: 1.2em;
  margin-left: 2px;
}

@media (max-width: 900px) {
  .img-desc-layout {
    flex-direction: column;
    gap: 32px;
  }

  .desc-area {
    min-width: 0;
    max-width: 100%;
  }
}

@media (max-width: 600px) {
  .img-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 120px 120px;
    gap: 8px;
  }

  .img-cell {
    border-radius: 12px;
  }

  .desc-title {
    font-size: 1.3rem;
  }
}
</style>