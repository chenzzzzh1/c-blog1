<template>
  <div class="home">
    <!-- 欢迎横幅 -->
    <div class="hero-banner">
      <div class="hero-content">
        <h1 class="hero-title">欢迎来到C的博客</h1>
        <p class="hero-subtitle">分享知识,记录生活,探索技术的无限可能</p>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">{{ articles.length }}</span>
            <span class="stat-label">篇文章</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ categories.length }}</span>
            <span class="stat-label">个分类</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ tags.length }}</span>
            <span class="stat-label">个标签</span>
          </div>
        </div>
      </div>
    </div>

    <div class="content-wrapper">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <div class="sidebar-card">
          <div class="card-header">
            <el-icon><FolderOpened /></el-icon>
            <h3>文章分类</h3>
          </div>
          <div class="category-list">
            <div
              :class="['category-item', { active: selectedCategory === 'all' }]"
              @click="handleCategorySelect('all')"
            >
              <el-icon><Grid /></el-icon>
              <span>全部文章</span>
              <span class="count">{{ pagination.total }}</span>
            </div>
            <div
              v-for="category in categories"
              :key="category._id"
              :class="['category-item', { active: selectedCategory === category._id }]"
              @click="handleCategorySelect(category._id)"
            >
              <el-icon><Folder /></el-icon>
              <span>{{ category.name }}</span>
              <span class="count">{{ category.articleCount || 0 }}</span>
            </div>
          </div>
        </div>

        <div class="sidebar-card">
          <div class="card-header">
            <el-icon><PriceTag /></el-icon>
            <h3>热门标签</h3>
          </div>
          <div class="tag-cloud">
            <router-link
              v-for="tag in tags"
              :key="tag._id"
              :to="`/tag/${tag._id}`"
              class="tag-item"
            >
              #{{ tag.name }}
            </router-link>
          </div>
        </div>
      </aside>

      <!-- 主要内容区 -->
      <main class="main-content">
        <div class="section-header">
          <h2>
            <el-icon><Document /></el-icon>
            最新文章
          </h2>
          <el-select
            v-model="selectedCategory"
            placeholder="选择分类"
            @change="handleCategorySelect"
            class="category-select"
          >
            <el-option label="全部" value="all" />
            <el-option
              v-for="category in categories"
              :key="category._id"
              :label="category.name"
              :value="category._id"
            />
          </el-select>
        </div>

        <div v-loading="loading" class="articles-list">
          <div v-if="articles.length === 0 && !loading" class="empty-state">
            <el-empty description="暂无文章">
              <el-button type="primary" @click="fetchArticles">刷新</el-button>
            </el-empty>
          </div>
          <ArticleCard
            v-else
            v-for="article in articles"
            :key="article._id"
            :article="article"
          />
        </div>

        <div v-if="pagination.total > 0" class="pagination-wrapper">
          <el-pagination
            v-model:current-page="pagination.current"
            v-model:page-size="pagination.pageSize"
            :total="pagination.total"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            background
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { articleAPI, categoryAPI, tagAPI } from '../api'
import ArticleCard from '../components/ArticleCard.vue'
import { FolderOpened, PriceTag, Grid, Folder, Document } from '@element-plus/icons-vue'

const loading = ref(false)
const articles = ref([])
const categories = ref([])
const tags = ref([])
const selectedCategory = ref('all')

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0
})

const fetchArticles = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.value.current,
      limit: pagination.value.pageSize
    }

    if (selectedCategory.value !== 'all') {
      params.category = selectedCategory.value
    }

    const response = await articleAPI.getArticles(params)
    articles.value = response.articles
    pagination.value.total = response.pagination.total
  } catch (error) {
    console.error('获取文章失败:', error)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const response = await categoryAPI.getCategories()
    categories.value = response
  } catch (error) {
    console.error('获取分类失败:', error)
  }
}

const fetchTags = async () => {
  try {
    const response = await tagAPI.getTags()
    tags.value = response
  } catch (error) {
    console.error('获取标签失败:', error)
  }
}

const handleCategorySelect = (index) => {
  selectedCategory.value = index
  pagination.value.current = 1
  fetchArticles()
}

const handlePageChange = (page) => {
  pagination.value.current = page
  fetchArticles()
}

const handleSizeChange = (size) => {
  pagination.value.pageSize = size
  pagination.value.current = 1
  fetchArticles()
}

onMounted(() => {
  fetchArticles()
  fetchCategories()
  fetchTags()
})
</script>

<style scoped>
.home {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 欢迎横幅 */
.hero-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 20px;
  margin-bottom: 40px;
  border-radius: var(--border-radius-large);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.hero-banner::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
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

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 40px;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 60px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #fff;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
}

/* 内容布局 */
.content-wrapper {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
  align-items: start;
}

/* 侧边栏 */
.sidebar {
  position: sticky;
  top: 100px;
}

.sidebar-card {
  background-color: var(--bg-color);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 20px;
  margin-bottom: 20px;
  transition: var(--transition-base);
}

.sidebar-card:hover {
  box-shadow: var(--box-shadow-dark);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--border-lighter);
}

.card-header .el-icon {
  font-size: 24px;
  color: var(--primary-color);
}

.card-header h3 {
  margin: 0;
  font-size: 1.125rem;
  color: var(--text-primary);
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition-base);
  color: var(--text-regular);
}

.category-item:hover {
  background-color: var(--bg-page);
  transform: translateX(5px);
}

.category-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.category-item .el-icon {
  font-size: 18px;
}

.category-item .count {
  margin-left: auto;
  padding: 2px 8px;
  background-color: var(--bg-page);
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
}

.category-item.active .count {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-item {
  padding: 6px 14px;
  background-color: var(--bg-page);
  border-radius: 20px;
  color: var(--text-regular);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: var(--transition-base);
  border: 1px solid var(--border-light);
}

.tag-item:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* 主要内容 */
.main-content {
  min-height: 600px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--border-lighter);
}

.section-header h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 1.75rem;
  color: var(--text-primary);
}

.section-header .el-icon {
  font-size: 28px;
  color: var(--primary-color);
}

.category-select {
  width: 200px;
}

.articles-list {
  min-height: 400px;
}

.empty-state {
  padding: 60px 20px;
}

.pagination-wrapper {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-wrapper {
    grid-template-columns: 240px 1fr;
    gap: 20px;
  }

  .sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-stats {
    gap: 30px;
  }

  .stat-number {
    font-size: 2rem;
  }

  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }

  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .category-select {
    width: 100%;
  }
}
</style>
