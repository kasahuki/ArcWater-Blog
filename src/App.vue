<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <nav-bar />
    </el-header>

    <!-- 主要内容区域 -->
    <el-main class="main-content">
      <router-view />
    </el-main>

    <!-- 页脚 -->
    <el-footer class="footer">
      <footer-component />
    </el-footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from './components/NavBar.vue'
import FooterComponent from './components/FooterComponent.vue'

</script>

<style>
:root {
  --primary-gradient: linear-gradient(90deg, #f9d423 0%, #4cb8c4 100%);
  --text-color: #333;
  --light-text: #666;
  --lighter-text: #999;
  --border-color: #eaeaea;
  --card-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'PingFang SC', 'Helvetica Neue', Helvetica, 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  color: var(--text-color);
  background-color: #f5f7fa;
  line-height: 1.6;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #fff;
  padding: 0;
}

.main-content {
  flex: 1;

}


.footer {
  background-color: #fff;
  border-top: 1px solid var(--border-color);
  padding: 20px 0;
}

/* 全局卡片样式 */
.article-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* 全局渐变背景 */
.gradient-bg {
  background-image: var(--primary-gradient);
  color: white;
  border-radius: 8px;
}
</style>