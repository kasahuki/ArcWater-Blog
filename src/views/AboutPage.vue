<template>

  <div class="WaterTitle">My Resume</div>
  <div class="resume-container" :class="{ 'dark-theme': isDarkMode }">
    <div class="resume-header">
      <div class="header-left">
        <h1 class="name">姓名：senjay</h1>
        <div class="title">本科在读</div>
        <div class="slogan">2005-06-21</div>
      </div>
      <div class="header-right">
        <div class="avatar-container">
          <img class="avatar"
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ff7de4323d2c8b5b54884f35cc64982-Pm6QTeQIpny9dfWxEXHJo72IEm6NRD.png"
            alt="个人照片">
        </div>
      </div>
    </div>

    <div class="resume-section">
      <div class="section-title">
        <el-icon>
          <User />
        </el-icon>
        <h2>个人信息</h2>
      </div>
      <div class="basic-info">
        <div class="info-item">
          <el-icon>
            <School />
          </el-icon>
          <span>福建农林大学 | 软件工程 </span>
        </div>
        <div class="info-item">
          <el-icon>
            <Calendar />
          </el-icon>
          <span>2027年毕业 | 大二在读</span>
        </div>
        <div class="info-item">
          <el-icon>
            <Phone />
          </el-icon>
          <span>187****7579</span>
        </div>
        <div class="info-item">
          <el-icon>
            <Message />
          </el-icon>
          <span>3381335358@qq.com</span>
        </div>
        <div class="info-item">
          <el-icon>
            <Location />
          </el-icon>
          <span>福建省福州市仓山区</span>
        </div>
      </div>
    </div>

    <div class="resume-section">
      <div class="section-title">
        <el-icon>
          <Collection />
        </el-icon>
        <h2>教育背景</h2>
      </div>
      <div class="education-item">
        <div class="edu-header">
          <div class="edu-school">福建农林大学</div>
          <div class="edu-time">2023.09 - </div>
        </div>
        <div class="edu-details" style="color: white;">
          <div>专业：软件工程</div>
          <div>学历：本科</div>
          <div>主修课程：数据结构、计算机系统基础、操作系统、计算机网络、JavaWeb应用开发、数据库系统概论、软件工程导论</div>
          <div>GPA：3.8/4.0（专业前10%）</div>
        </div>
      </div>
    </div>

    <!-- 实习经历 -->
    <!-- <div class="resume-section">
      <div class="section-title">
        <el-icon>
          <Suitcase />
        </el-icon>
        <h2>实习经历</h2>
      </div>
      <div class="experience-item">
        <div class="exp-header">
          <div class="exp-company">腾讯科技（广州）有限公司</div>
          <div class="exp-time">2023.07 - 2023.09</div>
        </div>
        <div class="exp-position">前端开发实习生</div>
        <div class="exp-desc">
          <ul>
            <li>参与企业内部管理系统的前端开发，使用Vue3+ElementPlus构建高效的用户界面</li>
            <li>负责实现复杂的数据可视化模块，使用ECharts完成多种图表展示，提升数据分析效率</li>
            <li>优化前端性能，减少首屏加载时间30%，提升用户体验</li>
            <li>参与代码评审，规范团队开发流程，确保代码质量</li>
          </ul>
        </div>
      </div>
      <div class="experience-item">
        <div class="exp-header">
          <div class="exp-company">广州信息科技有限公司</div>
          <div class="exp-time">2023.01 - 2023.03</div>
        </div>
        <div class="exp-position">Web前端开发实习生</div>
        <div class="exp-desc">
          <ul>
            <li>参与公司官方网站改版项目，负责响应式布局和交互效果的实现</li>
            <li>使用HTML5、CSS3和JavaScript开发多个交互组件，提升用户体验</li>
            <li>协助进行页面适配测试，确保在不同设备上的兼容性</li>
          </ul>
        </div>
      </div>
    </div> -->

    <!-- 项目经历 -->
    <div class="resume-section">
      <div class="section-title">
        <el-icon>
          <Connection />
        </el-icon>
        <h2>项目经验</h2>
      </div>
      <div class="project-item">
        <div class="proj-header">
          <div class="proj-name">校园社交平台</div>
          <div class="proj-time">2023.03 - 2023.06</div>
        </div>
        <div class="proj-desc">
          <ul>
            <li>使用Vue3+Vite框架构建前端，Node.js+Express搭建后端服务</li>
            <li>实现用户认证、社交动态、即时通讯等核心功能</li>
            <li>设计并实现响应式UI界面，确保在移动端和PC端的良好体验</li>
            <li>使用Socket.io实现实时聊天功能，MongoDB存储用户数据</li>
            <li>项目在校内测试阶段获得500+活跃用户，反馈良好</li>
          </ul>
        </div>
      </div>
      <div class="project-item">
        <div class="proj-header">
          <div class="proj-name">个人技术博客</div>
          <div class="proj-time">2022.10 - 至今</div>
        </div>
        <div class="proj-desc">
          <ul>
            <li>基于Vue和ElementPlus框架开发的个人博客网站</li>
            <li>实现文章展示、分类筛选、评论互动等功能</li>
            <li>使用Markdown渲染引擎支持代码高亮和数学公式</li>
            <li>接入第三方评论系统，提升用户互动体验</li>
            <li>博客累计发布30+技术文章，月访问量2000+</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 技术栈 -->
    <div class="resume-section" style="color: white;">

      <div class="section-title">
        <el-icon>
          <Operation />
        </el-icon>
        <h2>技术栈</h2>
      </div>

      <div class="tech-stack">
        <p class="tech-line">
          <span class="tech-category">前端技术：</span>
          <span class="tech-content">HTML5/CSS3、JavaScript、Vue.js</span>
        </p>
        <p class="tech-line">
          <span class="tech-category">后端技术：</span>
          <span class="tech-content">SSM框架、SpringBoot、SpringCloud、MySQL</span>
        </p>
        <p class="tech-line">
          <span class="tech-category">中间件与运维：</span>
          <span class="tech-content">Redis、RabbitMQ、Docker、Linux</span>
        </p>
      </div>
    </div>

    <!-- 获奖情況 -->
    <div class="resume-section">
      <div class="section-title">
        <el-icon>
          <Trophy />
        </el-icon>
        <h2>获奖情况</h2>
      </div>
      <div class="award-list">
        <div class="award-item">
          <div class="award-time">2023.05</div>
          <div class="award-name">福建省蓝桥杯B组 - 三等奖</div>
        </div>

      </div>
    </div>
    <!-- 个人优势 -->
    <div class="resume-section">
      <div class="section-title">
        <el-icon>
          <StarFilled />
        </el-icon>
        <h2>兴趣爱好&个人优势</h2>
      </div>
      <div class="self-evaluation" style="color: white;">
        看书、听音乐，喜欢学习新鲜事物
      </div>
    </div>


  </div>
  <div class="GlodenTitle" style="text-align: end;">
    To be Continue……
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  User, School, Calendar, Phone, Message, Location,
  Collection, Suitcase, Connection, Operation,
  Trophy, StarFilled
} from '@element-plus/icons-vue'

// 获取暗黑模式状态
const isDarkMode = computed(() => {
  return document.documentElement.classList.contains('dark-mode')
})
</script>

<style scoped>
.resume-container {
  max-width: 1000px;
  margin: 0 auto 50px;
  padding: 30px;
  background: rgba(2, 49, 77, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  position: relative;
  overflow: hidden;
}

/* 添加渐变背景 */
.resume-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.1) 100%);
  z-index: -1;
}

.resume-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.header-left {
  flex: 1;
}

.name {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #ffffff;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.5px;
}

.title {
  font-size: 1.5rem;
  color: #4d99ff;
  margin-bottom: 10px;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.3px;
}

.slogan {
  color: rgba(255, 255, 255, 0.95);
  font-size: 1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.header-right {
  margin-left: 30px;
}

.avatar-container {
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.resume-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.section-title .el-icon {
  font-size: 1.5rem;
  margin-right: 10px;
  color: #4d99ff;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.section-title h2 {
  font-size: 1.5rem;
  color: #ffffff;
  margin: 0;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.3px;
}

.basic-info {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.info-item {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.info-item .el-icon {
  margin-right: 10px;
  color: #4d99ff;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.education-item,
.experience-item,
.project-item {
  margin-bottom: 20px;
}

.edu-header,
.exp-header,
.proj-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.edu-school,
.exp-company,
.proj-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.2px;
}

.edu-time,
.exp-time,
.proj-time {
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.exp-position {
  font-size: 1.1rem;
  color: #4d99ff;
  margin-bottom: 10px;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.exp-desc ul,
.proj-desc ul {
  padding-left: 20px;
}

.exp-desc li,
.proj-desc li {
  margin-bottom: 5px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.skills-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 30px;
}

.skill-category h3 {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: #333;
}

.skill-list {
  display: grid;
  gap: 15px;
}

.skill-item {
  display: flex;
  align-items: center;
}

.skill-name {
  width: 160px;
  margin-right: 15px;
}

.skill-level {
  width: 40px;
  margin-left: 10px;
  text-align: right;
  color: #409eff;
  font-weight: 500;
}

.award-list {
  display: grid;
  gap: 15px;
}

.award-item {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.award-time {
  width: 70px;
  margin-right: 20px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.award-name {
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.self-evaluation p {
  margin-bottom: 10px;
  line-height: 1.8;
  text-align: justify;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 暗黑模式适配 */
.resume-container.dark-theme {
  background-color: #2a2a2a;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.resume-container.dark-theme .name,
.resume-container.dark-theme .section-title h2,
.resume-container.dark-theme .edu-school,
.resume-container.dark-theme .exp-company,
.resume-container.dark-theme .proj-name,
.resume-container.dark-theme .skill-category h3 {
  color: #ffffff;
}

.resume-container.dark-theme .title,
.resume-container.dark-theme .exp-position,
.resume-container.dark-theme .skill-level,
.resume-container.dark-theme .section-title .el-icon {
  color: #4d99ff;
}

.resume-container.dark-theme .slogan,
.resume-container.dark-theme .info-item,
.resume-container.dark-theme .edu-time,
.resume-container.dark-theme .exp-time,
.resume-container.dark-theme .proj-time,
.resume-container.dark-theme .exp-desc li,
.resume-container.dark-theme .proj-desc li,
.resume-container.dark-theme .skill-name,
.resume-container.dark-theme .award-name,
.resume-container.dark-theme .self-evaluation p {
  color: #cccccc;
}

.resume-container.dark-theme .award-time {
  color: #aaaaaa;
}

.resume-container.dark-theme .section-title,
.resume-container.dark-theme .resume-header {
  border-bottom-color: #3a3a3a;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .resume-container {
    padding: 20px;
    margin: 20px;
  }

  .resume-header {
    flex-direction: column;
    text-align: center;
  }

  .header-left {
    margin-bottom: 20px;
  }

  .header-right {
    margin-left: 0;
  }

  .name {
    font-size: 2rem;
  }

  .title {
    font-size: 1.2rem;
  }

  .avatar-container {
    width: 120px;
    height: 120px;
  }

  .skills-container,
  .basic-info {
    grid-template-columns: 1fr;
  }

  .skill-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .skill-name {
    width: 100%;
    margin-bottom: 5px;
  }

  .skill-level {
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .resume-container {
    padding: 15px;
    margin: 15px;
  }

  .name {
    font-size: 1.8rem;
  }

  .title {
    font-size: 1.1rem;
  }

  .avatar-container {
    width: 100px;
    height: 100px;
  }

  .section-title h2 {
    font-size: 1.3rem;
  }
}

/* 添加滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style>