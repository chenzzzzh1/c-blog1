<template>
  <div class="register-container">
    <div class="register-wrapper">
      <div class="register-illustration">
        <div class="illustration-content">
          <div class="logo-circle">
            <el-icon class="logo-icon"><UserFilled /></el-icon>
          </div>
          <h1 class="welcome-text">加入我们</h1>
          <p class="subtitle">创建你的账户,开始分享你的故事</p>
          <div class="features">
            <div class="feature-item">
              <el-icon><EditPen /></el-icon>
              <span>自由创作</span>
            </div>
            <div class="feature-item">
              <el-icon><Connection /></el-icon>
              <span>连接世界</span>
            </div>
            <div class="feature-item">
              <el-icon><Trophy /></el-icon>
              <span>成就系统</span>
            </div>
          </div>
        </div>
      </div>

      <div class="register-form-container">
        <div class="form-header">
          <h2>创建账户</h2>
          <p class="form-subtitle">填写信息,开启你的博客之旅</p>
        </div>

        <el-form :model="form" :rules="rules" ref="formRef" class="register-form">
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              placeholder="请输入用户名"
              size="large"
              class="custom-input"
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>

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
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="请确认密码"
              size="large"
              show-password
              class="custom-input"
              @keyup.enter="handleRegister"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <div class="agreement">
            <el-checkbox v-model="agreeTerms">
              我已阅读并同意
              <router-link to="/terms" class="link">《用户协议》</router-link>
              和
              <router-link to="/privacy" class="link">《隐私政策》</router-link>
            </el-checkbox>
          </div>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              @click="handleRegister"
              class="register-btn"
              :disabled="!agreeTerms"
            >
              <span v-if="!loading">立即注册</span>
              <span v-else>注册中...</span>
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
          <p>已有账号? <router-link to="/login" class="login-link">立即登录</router-link></p>
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
  UserFilled,
  EditPen,
  Connection,
  Trophy,
  User,
  Message,
  Lock,
  Platform,
  ChatLineSquare
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref(null)
const loading = ref(false)
const agreeTerms = ref(false)

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3到20个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await userStore.register({
          username: form.username,
          email: form.email,
          password: form.password
        })
        ElMessage.success('注册成功')
        router.push('/')
      } catch (error) {
        console.error('注册失败:', error)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.register-container {
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  width: 100%;
  background-color: var(--bg-color);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.register-illustration {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.register-illustration::before {
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

.register-form-container {
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

.register-form {
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

.agreement {
  margin-bottom: 24px;
}

.agreement :deep(.el-checkbox__label) {
  font-size: 0.875rem;
  color: var(--text-regular);
}

.link {
  color: var(--primary-color);
  text-decoration: none;
  transition: var(--transition-base);
}

.link:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

.register-btn {
  width: 100%;
  padding: 14px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: var(--transition-base);
}

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.register-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.login-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition-base);
}

.login-link:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 900px) {
  .register-wrapper {
    grid-template-columns: 1fr;
    max-width: 500px;
  }

  .register-illustration {
    display: none;
  }

  .register-form-container {
    padding: 40px;
  }
}

@media (max-width: 576px) {
  .register-container {
    padding: 20px 10px;
  }

  .register-form-container {
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
