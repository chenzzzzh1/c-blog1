<template>
  <div class="tag">
    <h2>标签: {{ tag?.name }}</h2>
    <div v-loading="loading" class="articles-list">
      <ArticleCard v-for="article in articles" :key="article._id" :article="article" />
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { articleAPI, tagAPI } from '../api'
import ArticleCard from '../components/ArticleCard.vue'

const route = useRoute()

const loading = ref(false)
const articles = ref([])
const tag = ref(null)

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0
})

const fetchTag = async () => {
  try {
    const response = await tagAPI.getTagById(route.params.id)
    tag.value = response
  } catch (error) {
    console.error('获取标签失败:', error)
  }
}

const fetchArticles = async () => {
  loading.value = true
  try {
    const response = await articleAPI.getArticles({
      tag: route.params.id,
      page: pagination.value.current,
      limit: pagination.value.pageSize
    })
    articles.value = response.articles
    pagination.value.total = response.pagination.total
  } catch (error) {
    console.error('获取文章失败:', error)
  } finally {
    loading.value = false
  }
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
  fetchTag()
  fetchArticles()
})
</script>

<style scoped>
.tag h2 {
  margin: 0 0 20px 0;
  color: #333;
}

.articles-list {
  min-height: 200px;
}

.el-pagination {
  margin-top: 20px;
  text-align: center;
}
</style>
