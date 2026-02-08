<template>
  <div class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>关于博客</h3>
        <p>C的博客 - 一个简洁、优雅的个人博客系统,分享技术、记录生活。</p>
      </div>

      <div class="footer-section">
        <h3>快速链接</h3>
        <ul class="footer-links">
          <li><router-link to="/">首页</router-link></li>
          <li><router-link to="/categories">分类</router-link></li>
          <li><router-link to="/tags">标签</router-link></li>
          <li><router-link to="/search">搜索</router-link></li>
        </ul>
      </div>

      <div class="footer-section">
        <h3>联系方式</h3>
        <div class="contact-info">
          <p><el-icon><Message /></el-icon> contact@example.com</p>
          <p><el-icon><Location /></el-icon> 中国·北京</p>
        </div>
      </div>

      <div class="footer-section">
        <h3>关注我们</h3>
        <div class="social-links">
          <a href="#" title="GitHub">
            <el-icon><Platform /></el-icon>
          </a>
          <a href="#" title="微博">
            <el-icon><ChatDotRound /></el-icon>
          </a>
          <a href="#" title="微信">
            <el-icon><ChatLineSquare /></el-icon>
          </a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2024 我的博客. 保留所有权利.</p>
      <p>用 ❤️ 和代码构建</p>
    </div>
  </div>
</template>

<script setup>
import { Message, Location, Platform, ChatDotRound, ChatLineSquare } from '@element-plus/icons-vue'
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: #ecf0f1;
  padding: 40px 0 20px;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 30px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.footer-section h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #fff;
  position: relative;
  padding-bottom: 10px;
}

.footer-section h3::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.footer-section p {
  color: #bdc3c7;
  line-height: 1.6;
  margin-bottom: 10px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: #bdc3c7;
  text-decoration: none;
  transition: var(--transition-base);
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-links a:hover {
  color: #667eea;
  padding-left: 5px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-info p {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.contact-info .el-icon {
  font-size: 18px;
  color: #667eea;
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 20px;
  transition: var(--transition-base);
}

.social-links a:hover {
  background-color: #667eea;
  transform: translateY(-3px) scale(1.1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.footer-bottom {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  color: #95a5a6;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.footer-bottom p {
  margin: 0;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    padding: 0 20px;
    gap: 30px;
  }

  .footer-section h3::after {
    width: 30px;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 10px;
    padding: 15px 20px;
  }
}
</style>
