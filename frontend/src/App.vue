<template>
  <div id="app">
    <el-container class="app-container">
      <el-header class="app-header">
        <Header />
      </el-header>
      <el-main class="app-main">
        <div class="main-content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </el-main>
      <el-footer class="app-footer">
        <Footer />
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: var(--bg-page);
}

.app-header {
  background-color: var(--bg-color);
  box-shadow: var(--box-shadow-light);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-main {
  flex: 1;
  padding: 40px 20px;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

.main-content {
  min-height: calc(100vh - 200px);
}

.app-footer {
  background-color: #2c3e50;
  color: #fff;
  text-align: center;
  padding: 30px 20px;
  margin-top: auto;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-header {
    height: 60px;
  }

  .app-main {
    padding: 20px 15px;
  }

  .app-footer {
    padding: 20px 15px;
  }
}
</style>
