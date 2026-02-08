<template>
  <div class="admin">
    <el-container>
      <el-aside width="200px">
        <el-menu
          :default-active="activeMenu"
          @select="handleMenuSelect"
          style="height: 100%"
        >
          <el-menu-item index="articles">
            <el-icon><Document /></el-icon>
            <span>文章管理</span>
          </el-menu-item>
          <el-menu-item index="categories">
            <el-icon><Folder /></el-icon>
            <span>分类管理</span>
          </el-menu-item>
          <el-menu-item index="tags">
            <el-icon><PriceTag /></el-icon>
            <span>标签管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 文章管理 -->
        <div v-if="activeMenu === 'articles'" class="admin-section">
          <div class="section-header">
            <h2>文章管理</h2>
            <el-button type="primary" @click="showArticleDialog = true">
              <el-icon><Plus /></el-icon>
              新建文章
            </el-button>
          </div>
          <el-table :data="articles" v-loading="loading" stripe>
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag :type="row.status === 'published' ? 'success' : 'info'">
                  {{ row.status === 'published' ? '已发布' : '草稿' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="views" label="浏览量" />
            <el-table-column prop="createdAt" label="创建时间">
              <template #default="{ row }">
                {{ formatDate(row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button text @click="handleEditArticle(row)">编辑</el-button>
                <el-button text type="danger" @click="handleDeleteArticle(row._id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 分类管理 -->
        <div v-if="activeMenu === 'categories'" class="admin-section">
          <div class="section-header">
            <h2>分类管理</h2>
            <el-button type="primary" @click="showCategoryDialog = true">
              <el-icon><Plus /></el-icon>
              新建分类
            </el-button>
          </div>
          <el-table :data="categories" v-loading="loading" stripe>
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="slug" label="别名" />
            <el-table-column prop="description" label="描述" />
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button text @click="handleEditCategory(row)">编辑</el-button>
                <el-button text type="danger" @click="handleDeleteCategory(row._id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 标签管理 -->
        <div v-if="activeMenu === 'tags'" class="admin-section">
          <div class="section-header">
            <h2>标签管理</h2>
            <el-button type="primary" @click="showTagDialog = true">
              <el-icon><Plus /></el-icon>
              新建标签
            </el-button>
          </div>
          <el-table :data="tags" v-loading="loading" stripe>
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="slug" label="别名" />
            <el-table-column prop="description" label="描述" />
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button text @click="handleEditTag(row)">编辑</el-button>
                <el-button text type="danger" @click="handleDeleteTag(row._id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
    </el-container>

    <!-- 文章对话框 -->
    <el-dialog
      v-model="showArticleDialog"
      :title="editingArticle ? '编辑文章' : '新建文章'"
      width="800px"
    >
      <el-form :model="articleForm" label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="articleForm.title" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="articleForm.category" placeholder="选择分类">
            <el-option
              v-for="cat in categories"
              :key="cat._id"
              :label="cat.name"
              :value="cat._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-select v-model="articleForm.tags" multiple placeholder="选择标签">
            <el-option
              v-for="tag in tags"
              :key="tag._id"
              :label="tag.name"
              :value="tag._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="摘要">
          <el-input v-model="articleForm.excerpt" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="articleForm.content" type="textarea" :rows="10" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="articleForm.status">
            <el-radio label="draft">草稿</el-radio>
            <el-radio label="published">发布</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showArticleDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSaveArticle">保存</el-button>
      </template>
    </el-dialog>

    <!-- 分类对话框 -->
    <el-dialog
      v-model="showCategoryDialog"
      :title="editingCategory ? '编辑分类' : '新建分类'"
      width="500px"
    >
      <el-form :model="categoryForm" label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="categoryForm.name" />
        </el-form-item>
        <el-form-item label="别名">
          <el-input v-model="categoryForm.slug" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="categoryForm.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCategoryDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSaveCategory">保存</el-button>
      </template>
    </el-dialog>

    <!-- 标签对话框 -->
    <el-dialog
      v-model="showTagDialog"
      :title="editingTag ? '编辑标签' : '新建标签'"
      width="500px"
    >
      <el-form :model="tagForm" label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="tagForm.name" />
        </el-form-item>
        <el-form-item label="别名">
          <el-input v-model="tagForm.slug" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="tagForm.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showTagDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSaveTag">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { articleAPI, categoryAPI, tagAPI } from '../api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, Folder, PriceTag, Plus } from '@element-plus/icons-vue'

const activeMenu = ref('articles')
const loading = ref(false)

const articles = ref([])
const categories = ref([])
const tags = ref([])

// 文章相关
const showArticleDialog = ref(false)
const editingArticle = ref(null)
const articleForm = reactive({
  title: '',
  content: '',
  excerpt: '',
  category: '',
  tags: [],
  status: 'draft'
})

// 分类相关
const showCategoryDialog = ref(false)
const editingCategory = ref(null)
const categoryForm = reactive({
  name: '',
  slug: '',
  description: ''
})

// 标签相关
const showTagDialog = ref(false)
const editingTag = ref(null)
const tagForm = reactive({
  name: '',
  slug: '',
  description: ''
})

const handleMenuSelect = (index) => {
  activeMenu.value = index
}

const fetchArticles = async () => {
  loading.value = true
  try {
    const response = await articleAPI.getArticles({ page: 1, limit: 100 })
    articles.value = response.articles
  } catch (error) {
    console.error('获取文章失败:', error)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  loading.value = true
  try {
    const response = await categoryAPI.getCategories()
    categories.value = response
  } catch (error) {
    console.error('获取分类失败:', error)
  } finally {
    loading.value = false
  }
}

const fetchTags = async () => {
  loading.value = true
  try {
    const response = await tagAPI.getTags()
    tags.value = response
  } catch (error) {
    console.error('获取标签失败:', error)
  } finally {
    loading.value = false
  }
}

// 文章操作
const handleEditArticle = (article) => {
  editingArticle.value = article
  articleForm.title = article.title
  articleForm.content = article.content
  articleForm.excerpt = article.excerpt
  articleForm.category = article.category._id
  articleForm.tags = article.tags.map(t => t._id)
  articleForm.status = article.status
  showArticleDialog.value = true
}

const handleSaveArticle = async () => {
  try {
    if (editingArticle.value) {
      await articleAPI.updateArticle(editingArticle.value._id, articleForm)
      ElMessage.success('文章更新成功')
    } else {
      await articleAPI.createArticle(articleForm)
      ElMessage.success('文章创建成功')
    }
    showArticleDialog.value = false
    editingArticle.value = null
    resetArticleForm()
    fetchArticles()
  } catch (error) {
    console.error('保存文章失败:', error)

    // 显示详细的错误信息
    if (error.response && error.response.data) {
      const errorData = error.response.data

      if (errorData.message === '缺少必填字段') {
        ElMessage.error(`缺少必填字段: ${errorData.required.join(', ')}`)
      } else if (errorData.message === '数据验证失败') {
        const validationErrors = errorData.errors.map(e => `${e.field}: ${e.message}`).join('\n')
        ElMessage.error(`数据验证失败:\n${validationErrors}`)
      } else {
        ElMessage.error(errorData.message || errorData.error || '保存文章失败')
      }
    } else {
      ElMessage.error('保存文章失败,请检查必填字段')
    }
  }
}

const handleDeleteArticle = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await articleAPI.deleteArticle(id)
    ElMessage.success('文章删除成功')
    fetchArticles()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除文章失败:', error)
    }
  }
}

const resetArticleForm = () => {
  articleForm.title = ''
  articleForm.content = ''
  articleForm.excerpt = ''
  articleForm.category = ''
  articleForm.tags = []
  articleForm.status = 'draft'
}

// 分类操作
const handleEditCategory = (category) => {
  editingCategory.value = category
  categoryForm.name = category.name
  categoryForm.slug = category.slug
  categoryForm.description = category.description
  showCategoryDialog.value = true
}

const handleSaveCategory = async () => {
  try {
    if (editingCategory.value) {
      await categoryAPI.updateCategory(editingCategory.value._id, categoryForm)
      ElMessage.success('分类更新成功')
    } else {
      await categoryAPI.createCategory(categoryForm)
      ElMessage.success('分类创建成功')
    }
    showCategoryDialog.value = false
    editingCategory.value = null
    resetCategoryForm()
    fetchCategories()
  } catch (error) {
    console.error('保存分类失败:', error)
    ElMessage.error('保存分类失败')
  }
}

const handleDeleteCategory = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个分类吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await categoryAPI.deleteCategory(id)
    ElMessage.success('分类删除成功')
    fetchCategories()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除分类失败:', error)
    }
  }
}

const resetCategoryForm = () => {
  categoryForm.name = ''
  categoryForm.slug = ''
  categoryForm.description = ''
}

// 标签操作
const handleEditTag = (tag) => {
  editingTag.value = tag
  tagForm.name = tag.name
  tagForm.slug = tag.slug
  tagForm.description = tag.description
  showTagDialog.value = true
}

const handleSaveTag = async () => {
  try {
    if (editingTag.value) {
      await tagAPI.updateTag(editingTag.value._id, tagForm)
      ElMessage.success('标签更新成功')
    } else {
      await tagAPI.createTag(tagForm)
      ElMessage.success('标签创建成功')
    }
    showTagDialog.value = false
    editingTag.value = null
    resetTagForm()
    fetchTags()
  } catch (error) {
    console.error('保存标签失败:', error)
    ElMessage.error('保存标签失败')
  }
}

const handleDeleteTag = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个标签吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await tagAPI.deleteTag(id)
    ElMessage.success('标签删除成功')
    fetchTags()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除标签失败:', error)
    }
  }
}

const resetTagForm = () => {
  tagForm.name = ''
  tagForm.slug = ''
  tagForm.description = ''
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchArticles()
  fetchCategories()
  fetchTags()
})
</script>

<style scoped>
.admin {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.el-aside {
  background-color: #f5f7fa;
  border-right: 1px solid #e6e6e6;
}

.admin-section {
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  color: #333;
}
</style>
