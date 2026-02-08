<template>
  <div class="header">
    <div class="header-content">
      <div class="logo">
        <router-link to="/">
          <el-icon class="logo-icon"><Reading /></el-icon>
          <span class="logo-text">C的博客</span>
        </router-link>
      </div>

      <nav class="nav">
        <router-link to="/" class="nav-link">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </router-link>
        <router-link to="/categories" class="nav-link">
          <el-icon><FolderOpened /></el-icon>
          <span>分类</span>
        </router-link>
        <router-link to="/tags" class="nav-link">
          <el-icon><PriceTag /></el-icon>
          <span>标签</span>
        </router-link>
      </nav>

      <div class="search-box">
        <el-input
          v-model="searchQuery"
          placeholder="搜索文章..."
          @keyup.enter="handleSearch"
          clearable
          class="search-input"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <div class="user-actions">
        <template v-if="userStore.user">
          <el-dropdown trigger="click">
            <div class="user-dropdown">
              <el-avatar :size="32" :src="userStore.user.avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="user-name">{{ userStore.user.username }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goToProfile">
                  <el-icon><User /></el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item v-if="userStore.user.role === 'admin'" @click="goToAdmin">
                  <el-icon><Setting /></el-icon>
                  管理后台
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <router-link to="/login" class="auth-link">
            <el-button type="primary" round>登录</el-button>
          </router-link>
          <router-link to="/register" class="auth-link">
            <el-button round>注册</el-button>
          </router-link>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { ElMessageBox } from 'element-plus'
import {
  Reading,
  HomeFilled,
  FolderOpened,
  PriceTag,
  Search,
  User,
  Setting,
  SwitchButton
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'Search', query: { q: searchQuery.value } })
  }
}

const goToProfile = () => {
  router.push('/profile')
}

const goToAdmin = () => {
  router.push('/admin')
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    userStore.logout()
    router.push('/')
  } catch {
    // 用户取消
  }
}
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.3);
}

.header-content {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 0 30px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}

.logo a {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  transition: var(--transition-base);
}

.logo:hover {
  transform: scale(1.05);
}

.logo-icon {
  font-size: 32px;
  color: #fff;
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1px;
}

.nav {
  display: flex;
  gap: 10px;
  align-items: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  border-radius: var(--border-radius);
  transition: var(--transition-base);
  font-weight: 500;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

.search-box {
  flex: 1;
  max-width: 400px;
}

.search-input {
  border-radius: 20px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.95);
  padding: 8px 16px;
}

.search-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.search-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.user-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  border-radius: var(--border-radius);
  background-color: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: var(--transition-base);
}

.user-dropdown:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.user-name {
  color: #fff;
  font-weight: 500;
  font-size: 14px;
}

.auth-link {
  text-decoration: none;
}

.auth-link .el-button {
  border-color: rgba(255, 255, 255, 0.5);
  color: #fff;
  background: transparent;
  transition: var(--transition-base);
}

.auth-link .el-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: #fff;
  transform: translateY(-2px);
}

.auth-link .el-button--primary {
  background-color: rgba(255, 255, 255, 0.9);
  color: #667eea;
  border-color: #fff;
}

.auth-link .el-button--primary:hover {
  background-color: #fff;
  color: #667eea;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .header-content {
    padding: 0 20px;
    gap: 20px;
  }

  .search-box {
    max-width: 300px;
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 15px;
    gap: 15px;
  }

  .logo-text {
    font-size: 20px;
  }

  .nav-link span {
    display: none;
  }

  .search-box {
    max-width: 200px;
  }

  .user-name {
    display: none;
  }
}
</style>
