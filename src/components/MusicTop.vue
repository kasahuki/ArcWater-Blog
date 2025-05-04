<template>
  <div class="carousel-container" ref="container">
    <!-- 背景装饰元素 -->
    <div class="background-gradient"></div>
    <div class="background-blur"></div>
    <div class="background-noise"></div>

    <!-- 标题区域 -->
    <div class="carousel-header">
      <h2>热门音乐</h2>
    </div>

    <!-- 轮播区域 -->
    <div class="carousel" ref="carousel">
      <div v-for="(item, index) in topMusics" :key="index" class="carousel-item" :class="{
        'active': currentIndex === index,
        'prev': index < currentIndex,
        'next': index > currentIndex
      }" :style="{
        backgroundColor: getBackgroundColor(index),
        transform: getTransform(index),
        zIndex: getZIndex(index),
        opacity: getOpacity(index),
        filter: getFilter(index)
      }" @click="setActive(index)">
        <div class="item-content">
          <div class="music-cover">
            <el-image :src="item.cover" fit="cover" class="cover-image">
              <template #error>
                <div class="cover-fallback">
                  <el-icon>
                    <Headset />
                  </el-icon>
                </div>
              </template>
            </el-image>
          </div>
          <div class="music-info">
            <div class="music-name">{{ item.musicName }}</div>
            <div class="play-count">播放次数: {{ item.listenTimes }}</div>
          </div>
        </div>

        <!-- 反光效果 -->
        <div class="reflection"></div>
      </div>

      <!-- 指示器 -->
      <div class="indicators">
        <div v-for="(item, index) in topMusics" :key="`indicator-${index}`" class="indicator"
          :class="{ 'active': currentIndex === index }" @click="setActive(index)"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { Headset } from '@element-plus/icons-vue';

// 定义props接收音乐数据
const props = defineProps({
  topMusics: {
    type: Array,
    default: () => []
  }
});

const currentIndex = ref(0);
const carousel = ref(null);
const container = ref(null);
const isDragging = ref(false);
const startX = ref(0);
const startScrollLeft = ref(0);

// 根据索引获取背景颜色
const getBackgroundColor = (index) => {
  const colors = [
    'rgba(255, 59, 48, 0.9)',  // 红色
    'rgba(0, 122, 255, 0.9)',  // 蓝色
    'rgba(255, 255, 255, 0.9)', // 白色
    'rgba(52, 199, 89, 0.9)',   // 绿色
    'rgba(175, 82, 222, 0.9)'   // 紫色
  ];
  return colors[index % colors.length];
};

// 计算每个卡片的变换样式
const getTransform = (index) => {
  const diff = index - currentIndex.value;
  const translateX = diff * 90; // 水平偏移量
  const scale = diff === 0 ? 1 : 0.8; // 缩放比例
  const translateZ = diff === 0 ? 0 : -100; // Z轴偏移，创建深度效果
  const rotateY = diff * -5; // 添加轻微的Y轴旋转，增强3D效果

  return `translateX(${translateX}px) scale(${scale}) translateZ(${translateZ}px) rotateY(${rotateY}deg)`;
};

// 计算每个卡片的z-index
const getZIndex = (index) => {
  return index === currentIndex.value ? 10 : 10 - Math.abs(index - currentIndex.value);
};

// 计算每个卡片的不透明度
const getOpacity = (index) => {
  const diff = Math.abs(index - currentIndex.value);
  return diff === 0 ? 1 : Math.max(0.6, 1 - diff * 0.2);
};

// 计算每个卡片的滤镜效果（毛玻璃效果）
const getFilter = (index) => {
  if (index === currentIndex.value) {
    return 'none';
  }
  return 'blur(2px) brightness(0.9)';
};

// 设置活动卡片
const setActive = (index) => {
  if (index >= 0 && index < props.topMusics.length) {
    currentIndex.value = index;
  }
};

// 上一个卡片
const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

// 下一个卡片
const next = () => {
  if (currentIndex.value < props.topMusics.length - 1) {
    currentIndex.value++;
  }
};

// 触摸和鼠标事件处理
onMounted(async () => {
  await nextTick(); // 等待DOM更新完成

  const carouselEl = carousel.value;
  if (!carouselEl) return; // 确保元素存在

  // 鼠标按下事件
  const mouseDownHandler = (e) => {
    isDragging.value = true;
    startX.value = e.pageX;
    startScrollLeft.value = currentIndex.value;
    carouselEl.style.cursor = 'grabbing';
  };

  // 鼠标移动事件
  const mouseMoveHandler = (e) => {
    if (!isDragging.value) return;
    e.preventDefault();

    const x = e.pageX;
    const walk = (x - startX.value) / 100; // 滑动灵敏度调整

    // 计算新的索引位置
    const newIndex = Math.round(startScrollLeft.value - walk);

    // 限制在有效范围内
    if (newIndex >= 0 && newIndex < props.topMusics.length) {
      currentIndex.value = newIndex;
    }
  };

  // 鼠标释放事件
  const mouseUpHandler = () => {
    isDragging.value = false;
    carouselEl.style.cursor = 'grab';
  };

  // 添加事件监听器
  carouselEl.addEventListener('mousedown', mouseDownHandler);
  window.addEventListener('mousemove', mouseMoveHandler);
  window.addEventListener('mouseup', mouseUpHandler);

  // 触摸事件（移动设备）
  carouselEl.addEventListener('touchstart', (e) => {
    isDragging.value = true;
    startX.value = e.touches[0].pageX;
    startScrollLeft.value = currentIndex.value;
  });

  carouselEl.addEventListener('touchmove', (e) => {
    if (!isDragging.value) return;

    const x = e.touches[0].pageX;
    const walk = (x - startX.value) / 100;

    const newIndex = Math.round(startScrollLeft.value - walk);
    if (newIndex >= 0 && newIndex < props.topMusics.length) {
      currentIndex.value = newIndex;
    }
  });

  carouselEl.addEventListener('touchend', () => {
    isDragging.value = false;
  });

  // 清理事件监听器
  return () => {
    carouselEl.removeEventListener('mousedown', mouseDownHandler);
    window.removeEventListener('mousemove', mouseMoveHandler);
    window.removeEventListener('mouseup', mouseUpHandler);

    carouselEl.removeEventListener('touchstart', mouseDownHandler);
    window.removeEventListener('touchmove', mouseMoveHandler);
    window.removeEventListener('touchend', mouseUpHandler);
  };
});
</script>

<style scoped>
/* 基础样式 */
.carousel-container {
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  perspective: 1000px;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #fff;
  border-radius: 10px;
  margin-bottom: 80px;
}

/* 背景样式 */
.background-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  z-index: -3;
}

.background-blur {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(100, 100, 100, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
  z-index: -2;
  animation: rotate 20s linear infinite;
}

.background-noise {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
  opacity: 0.4;
  z-index: -1;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}


/* 轮播区域 */
.carousel {
  position: relative;
  width: 100%;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  user-select: none;
}

.carousel-item {
  position: absolute;
  width: 220px;
  height: 300px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.carousel-item.active {
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
  transform: scale(1.05) !important;
}

.carousel-item.prev {
  transform-origin: right center;
}

.carousel-item.next {
  transform-origin: left center;
}

.item-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
}

.music-cover {
  width: 160px;
  height: 160px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  font-size: 48px;
}

.music-info {
  text-align: center;
  color: white;
}

.music-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.play-count {
  font-size: 14px;
  opacity: 0.8;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 反光效果 */
.reflection {
  position: absolute;
  top: -100%;
  left: -100%;
  width: 300%;
  height: 300%;
  background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 60%);
  transform: rotate(45deg);
  pointer-events: none;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.carousel-item:hover .reflection {
  opacity: 1;
}

/* 指示器 */
.indicators {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background-color: rgba(255, 255, 255, 1);
  transform: scale(1.2);
}

/* 控制按钮 */
.controls {
  margin-top: 60px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  color: white;
  cursor: pointer;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.control-btn:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.control-btn:active:not(:disabled) {
  transform: translateY(0);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.current-indicator {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  min-width: 40px;
  text-align: center;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .carousel-item {
    width: 180px;
    height: 250px;
  }

  .music-cover {
    width: 140px;
    height: 140px;
  }

  .music-name {
    font-size: 18px;
  }

  .controls {
    margin-top: 50px;
  }
}

@media (max-width: 480px) {
  .carousel-item {
    width: 150px;
    height: 220px;
  }

  .music-cover {
    width: 120px;
    height: 120px;
  }

  .music-name {
    font-size: 16px;
  }

  .carousel-header h2 {
    font-size: 24px;
  }

  .carousel-subtitle {
    font-size: 14px;
  }

  .control-btn {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>