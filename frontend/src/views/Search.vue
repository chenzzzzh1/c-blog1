<template>
  <div class="search">
    <h2>搜索结果: "{{ query }}"</h2>
    <div v-loading="loading" class="articles-list">
      <div v-if="articles.length === 0 && !loading" class="no-results">
        没有找到相关文章
      </div>
      <ArticleCard v-else v-for="article in articles" :key="article._id" :article="article" />
    </div>
    <el-pagination
      v-if="pagination.total > 0"
      v-model:current-page="pagination.current"
      v-model:page-size="pagination.pageSize"
      :total="pagination.total"
      :page-sizes="[10, 20, 30, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handlePageChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { searchAPI } from '../api'
import ArticleCard from '../components/ArticleCard.vue'

const route = useRoute()

const loading = ref(false)
const articles = ref([])
const query = ref('')

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0
})

const searchArticles = async () => {
  loading.value = true
  try {
    const response = await searchAPI.searchArticles({
      q: query.value,
      page: pagination.value.current,
      limit: pagination.value.pageSize
    })
    articles.value = response.articles
    pagination.value.total = response.pagination.total
  } catch (error) {
    console.error('搜索失败:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  pagination.value.current = page
  searchArticles()
}

const handleSizeChange = (size) => {
  pagination.value.pageSize = size
  pagination.value.current = 1
  searchArticles()
}

watch(() => route.query.q, (newQuery) => {
  if (newQuery) {
    query.value = newQuery
    pagination.value.current = 1
    searchArticles()
  }
}, { immediate: true })
</script>

<style scoped>
.search h2 {
  margin: 0 0 20px 0;
  color: #333;
}

.articles-list {
  min-height: 200px;
  margin-bottom: 20px;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #999;
}

.el-pagination {
  text-align: center;
}
</style>
