<template>
  <div class="loader">
    <div class="loading-content">
      <div class="book-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 126 75" class="book">
          <rect stroke-width="5" stroke="#e05452" rx="7.5" height="70" width="121" y="2.5" x="2.5"></rect>
          <line stroke-width="5" stroke="#e05452" y2="75" x2="63.5" x1="63.5"></line>
          <path stroke-linecap="round" stroke-width="4" stroke="#c18949" d="M25 20H50"></path>
          <path stroke-linecap="round" stroke-width="4" stroke="#c18949" d="M101 20H76"></path>
          <path stroke-linecap="round" stroke-width="4" stroke="#c18949" d="M16 30L50 30"></path>
          <path stroke-linecap="round" stroke-width="4" stroke="#c18949" d="M110 30L76 30"></path>
        </svg>

        <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff74" viewBox="0 0 65 75" class="book-page">
          <path stroke-linecap="round" stroke-width="4" stroke="#c18949" d="M40 20H15"></path>
          <path stroke-linecap="round" stroke-width="4" stroke="#c18949" d="M49 30L15 30"></path>
          <path stroke-width="5" stroke="#e05452"
            d="M2.5 2.5H55C59.1421 2.5 62.5 5.85786 62.5 10V65C62.5 69.1421 59.1421 72.5 55 72.5H2.5V2.5Z"></path>
        </svg>
      </div>

      <div class="loading-text">
        <h2 class="loading-title">正在加载文章...</h2>
        <p class="loading-subtitle">请稍候，我们正在为您准备精彩内容</p>
        <div class="loading-dots">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>
<style scoped>
.loader {
  height: 100vh;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.book-wrapper {
  width: 300px;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
}

.book {
  width: 100%;
  height: auto;
  filter: drop-shadow(10px 10px 5px rgba(0, 0, 0, 0.137));
}

.book-wrapper .book-page {
  width: 50%;
  height: auto;
  position: absolute;
  animation: paging 0.15s linear infinite;
  transform-origin: left;
}

@keyframes paging {
  0% {
    transform: rotateY(0deg) skewY(0deg);
  }

  50% {
    transform: rotateY(90deg) skewY(-20deg);
  }

  100% {
    transform: rotateY(180deg) skewY(0deg);
  }
}

/* 文字样式 */
.loading-text {
  text-align: center;
  color: #333;
}

.loading-title {
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 10px 0;
  color: #bb8718;
  letter-spacing: 0.5px;
}

.loading-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0 0 20px 0;
  font-weight: 400;
}

/* 加载点动画 */
.loading-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  background-color: #1634e2;
  border-radius: 50%;
  animation: dotPulse 1.4s ease-in-out infinite both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

.dot:nth-child(3) {
  animation-delay: 0s;
}

@keyframes dotPulse {

  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }

  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .loading-title {
    font-size: 1.5rem;
  }

  .loading-subtitle {
    font-size: 1rem;
  }

  .book-wrapper {
    width: 200px;
  }
}

@media (max-width: 480px) {
  .loading-title {
    font-size: 1.3rem;
  }

  .loading-subtitle {
    font-size: 0.9rem;
  }

  .book-wrapper {
    width: 150px;
  }

  .loading-content {
    gap: 30px;
  }
}
</style>