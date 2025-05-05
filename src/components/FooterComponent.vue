<template>
  <div class="footer-container">
    <div class="footer-content">
      <div class="footer-section about">
        <h3>This Site</h3>
        <p>A personal knowledge library including various of technical blogs, dev tools and practice experience </p>
        <div class="social-links">
          <a href="#" class="social-link"><el-icon>
              <Message />
            </el-icon></a>
          <a href="#" class="social-link"><el-icon>
              <Share />
            </el-icon></a>
          <a href="#" class="social-link"><el-icon>
              <Link />
            </el-icon></a>
        </div>
      </div>



      <div class="footer-section contact">
        <h3>Contact Me</h3>
        <p><el-icon>
            <Location />
          </el-icon> FAFU</p>
        <p><el-icon>
            <Message />
          </el-icon> 3381335358@qq.com</p>
        <p><el-icon>
            <Phone />
          </el-icon> This a secret number</p>
        <a href="https://github.com/kasahuki/ArcWater-Blog">
          <svg style="margin-right: 0.4rem;" t="1743854627096" class="icon" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="2607" width="25" height="25">
            <path
              d="M960 512c0 97.76-28.704 185.216-85.664 263.264-56.96 78.016-130.496 131.84-220.64 161.856-10.304 1.824-18.368 0.448-22.848-4.032a22.4 22.4 0 0 1-7.2-17.504v-122.88c0-37.632-10.304-65.44-30.464-82.912a409.856 409.856 0 0 0 59.616-10.368 222.752 222.752 0 0 0 54.72-22.816c18.848-10.784 34.528-23.36 47.104-38.592 12.544-15.232 22.848-35.904 30.912-61.44 8.096-25.568 12.128-54.688 12.128-87.904 0-47.072-15.232-86.976-46.208-120.16 14.368-35.456 13.024-74.912-4.48-118.848-10.752-3.616-26.432-1.344-47.072 6.272s-38.56 16.16-53.824 25.568l-21.984 13.888c-36.32-10.304-73.536-15.232-112.096-15.232s-75.776 4.928-112.096 15.232a444.48 444.48 0 0 0-24.672-15.68c-10.336-6.272-26.464-13.888-48.896-22.432-21.952-8.96-39.008-11.232-50.24-8.064-17.024 43.936-18.368 83.424-4.032 118.848-30.496 33.632-46.176 73.536-46.176 120.608 0 33.216 4.032 62.336 12.128 87.456 8.032 25.12 18.368 45.76 30.496 61.44 12.544 15.68 28.224 28.704 47.072 39.04 18.848 10.304 37.216 17.92 54.72 22.816a409.6 409.6 0 0 0 59.648 10.368c-15.712 13.856-25.12 34.048-28.704 60.064a99.744 99.744 0 0 1-26.464 8.512 178.208 178.208 0 0 1-33.184 2.688c-13.024 0-25.568-4.032-38.144-12.544-12.544-8.512-23.296-20.64-32.256-36.32a97.472 97.472 0 0 0-28.256-30.496c-11.232-8.064-21.088-12.576-28.704-13.92l-11.648-1.792c-8.096 0-13.92 0.928-17.056 2.688-3.136 1.792-4.032 4.032-2.688 6.72s3.136 5.408 5.376 8.096 4.928 4.928 7.616 7.168l4.032 2.688c8.544 4.032 17.056 11.232 25.568 21.984 8.544 10.752 14.368 20.64 18.4 29.6l5.824 13.44c4.928 14.816 13.44 26.912 25.568 35.872 12.096 8.992 25.088 14.816 39.008 17.504 13.888 2.688 27.36 4.032 40.352 4.032s23.776-0.448 32.288-2.24l13.472-2.24c0 14.784 0 32.288 0.416 52.032 0 19.744 0.48 30.496 0.48 31.392a22.624 22.624 0 0 1-7.648 17.472c-4.928 4.48-12.992 5.824-23.296 4.032-90.144-30.048-163.68-83.84-220.64-161.888C92.256 697.216 64 609.312 64 512c0-81.152 20.192-156.064 60.096-224.672s94.176-122.88 163.232-163.232C355.936 84.192 430.816 64 512 64s156.064 20.192 224.672 60.096 122.88 94.176 163.232 163.232C939.808 355.488 960 430.848 960 512"
              fill="#000000" p-id="2608"></path>
          </svg>
          <span style="vertical-align: top;">star on github</span>

        </a>
      </div>

      <div class="footer-section newsletter">
        <h3>Subscride Me</h3>
        <p>Subscride this blog to get the latest technicl articles and tutorials</p>
        <div class="newsletter-form">
          <el-input v-model="email" placeholder="您的邮箱地址" />
          <el-button type="primary">Subscride</el-button>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; {{ new Date().getFullYear() }} ArcWater by Senjay</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Message, Share, Link, Location, Phone } from '@element-plus/icons-vue'

const email = ref('')
</script>

<style scoped>
.footer-container {
  background: rgba(28, 35, 65, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  color: rgba(255, 255, 255, 0.9);
  position: relative;
  z-index: 1;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
}

.footer-section h3 {
  font-size: 1.2rem;
  margin-bottom: 15px;
  position: relative;
  padding-bottom: 10px;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.footer-section h3::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 50px;
  height: 2px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.about p {
  margin-bottom: 15px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.links ul {
  list-style: none;
  padding: 0;
}

.links li {
  margin-bottom: 10px;
}

.links a {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  transition: color 0.3s ease;
}

.links a:hover {
  color: #fff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.contact p {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.8);
}

.contact .el-icon {
  margin-right: 10px;
  color: rgba(255, 255, 255, 0.9);
}

.contact a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  margin-top: 10px;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.contact a:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.contact svg path {
  fill: rgba(255, 255, 255, 0.9);
}

.newsletter p {
  margin-bottom: 15px;
  color: rgba(255, 255, 255, 0.8);
}

.newsletter-form {
  display: flex;
  gap: 10px;
}

:deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

:deep(.el-input__wrapper:hover) {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

:deep(.el-input__inner) {
  color: rgba(255, 255, 255, 0.9);
}

:deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.6);
}

:deep(.el-button) {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

:deep(.el-button:hover) {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
}
</style>