<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-illustration">
        <div class="illustration-content">
          <div class="logo-circle">
            <el-icon class="logo-icon"><Reading /></el-icon>
          </div>
          <h1 class="welcome-text">欢迎回来</h1>
          <p class="subtitle">登录你的账户,继续你的创作之旅</p>
          <div class="features">
            <div class="feature-item">
              <el-icon><Document /></el-icon>
              <span>发布文章</span>
            </div>
            <div class="feature-item">
              <el-icon><ChatDotRound /></el-icon>
              <span>互动评论</span>
            </div>
            <div class="feature-item">
              <el-icon><Star /></el-icon>
              <span>收藏喜欢</span>
            </div>
          </div>
        </div>
      </div>

      <div class="login-form-container">
        <div class="form-header">
          <h2>登录账户</h2>
          <p class="form-subtitle">请输入您的账户信息</p>
        </div>

        <el-form :model="form" :rules="rules" ref="formRef" class="login-form">
          <el-form-item prop="email">
            <el-input
              v-model="form.email"
              placeholder="请输入邮箱"
              size="large"
              class="custom-input"
            >
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              show-password
              class="custom-input"
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <div class="form-options">
            <el-checkbox v-model="rememberMe">记住我</el-checkbox>
            <router-link to="/forgot-password" class="forgot-link">忘记密码?</router-link>
          </div>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              @click="handleLogin"
              class="login-btn"
            >
              <span v-if="!loading">登录</span>
              <span v-else>登录中...</span>
            </el-button>
          </el-form-item>

          <div class="divider">
            <span>或</span>
          </div>

          <div class="social-login">
            <el-button class="social-btn github">
              <el-icon><Platform /></el-icon>
              GitHub
            </el-button>
            <el-button class="social-btn wechat">
              <el-icon><ChatLineSquare /></el-icon>
              微信
            </el-button>
          </div>
        </el-form>

        <div class="form-footer">
          <p>还没有账号? <router-link to="/register" class="register-link">立即注册</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { ElMessage } from 'element-plus'
import {
  Reading,
  Document,
  ChatDotRound,
  Star,
  Message,
  Lock,
  Platform,
  ChatLineSquare
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref(null)
const loading = ref(false)
const rememberMe = ref(false)

const form = reactive({
  email: '',
  password: ''
})

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await userStore.login(form)
        ElMessage.success('登录成功')
        router.push('/')
      } catch (error) {
        console.error('登录失败:', error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  width: 100%;
  background-color: var(--bg-color);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-illustration {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-illustration::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.illustration-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: #fff;
}

.logo-circle {
  width: 120px;
  height: 120px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30px;
  backdrop-filter: blur(10px);
}

.logo-icon {
  font-size: 60px;
  color: #fff;
}

.welcome-text {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 16px 0;
}

.subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
  margin: 0 0 40px 0;
  line-height: 1.6;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  backdrop-filter: blur(10px);
  transition: var(--transition-base);
}

.feature-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateX(10px);
}

.feature-item .el-icon {
  font-size: 24px;
}

.login-form-container {
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-header {
  margin-bottom: 40px;
}

.form-header h2 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.form-subtitle {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.9375rem;
}

.login-form {
  margin-bottom: 30px;
}

.custom-input :deep(.el-input__wrapper) {
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: var(--box-shadow);
  border: 1px solid var(--border-light);
  transition: var(--transition-base);
}

.custom-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.custom-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  border-color: var(--primary-color);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.forgot-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.875rem;
  transition: var(--transition-base);
}

.forgot-link:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  padding: 14px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: var(--transition-base);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.divider {
  display: flex;
  align-items: center;
  margin: 24px 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: var(--border-light);
}

.divider span {
  padding: 0 16px;
}

.social-login {
  display: flex;
  gap: 12px;
}

.social-btn {
  flex: 1;
  height: 44px;
  border-radius: 12px;
  font-weight: 500;
  transition: var(--transition-base);
}

.social-btn.github {
  background-color: #24292e;
  color: #fff;
  border: none;
}

.social-btn.github:hover {
  background-color: #1a1e21;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.social-btn.wechat {
  background-color: #07c160;
  color: #fff;
  border: none;
}

.social-btn.wechat:hover {
  background-color: #06ad56;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(7, 193, 96, 0.3);
}

.form-footer {
  text-align: center;
  margin-top: 20px;
}

.form-footer p {
  margin: 0;
  color: var(--text-regular);
  font-size: 0.9375rem;
}

.register-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition-base);
}

.register-link:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 900px) {
  .login-wrapper {
    grid-template-columns: 1fr;
    max-width: 500px;
  }

  .login-illustration {
    display: none;
  }

  .login-form-container {
    padding: 40px;
  }
}

@media (max-width: 576px) {
  .login-container {
    padding: 20px 10px;
  }

  .login-form-container {
    padding: 30px 20px;
  }

  .social-login {
    flex-direction: column;
  }

  .form-header h2 {
    font-size: 1.5rem;
  }
}
</style>
