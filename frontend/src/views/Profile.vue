<template>
  <div class="profile">
    <el-card>
      <h2>个人中心</h2>
      <el-alert
        v-if="userStore.user?.role === 'admin'"
        title="管理员特权: 您可以随时修改用户名,不受24小时限制"
        type="success"
        :closable="false"
        style="margin-bottom: 20px"
      />
      <el-alert
        v-if="usernameUpdateWarning && userStore.user?.role !== 'admin'"
        :title="usernameUpdateWarning"
        type="warning"
        :closable="false"
        style="margin-bottom: 20px"
      />
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="form.username" 
            placeholder="请输入用户名"
            :disabled="!canUpdateUsername && userStore.user?.role !== 'admin'"
          >
            <template #append v-if="!canUpdateUsername && userStore.user?.role !== 'admin'">
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
          <div v-if="!canUpdateUsername && userStore.user?.role !== 'admin'" class="form-tip">
            用户名修改过于频繁,请{{ remainingHours }}小时后再试
          </div>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" disabled />
        </el-form-item>
        <el-form-item label="个人简介" prop="bio">
          <el-input
            v-model="form.bio"
            type="textarea"
            :rows="4"
            placeholder="介绍一下自己..."
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            保存修改
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
      <h2>我的文章</h2>
      <ArticleCard v-for="article in myArticles" :key="article._id" :article="article" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '../store/user'
import { userAPI, articleAPI } from '../api'
import { ElMessage } from 'element-plus'
import { Lock } from '@element-plus/icons-vue'
import ArticleCard from '../components/ArticleCard.vue'

const userStore = useUserStore()
const formRef = ref(null)
const loading = ref(false)
const myArticles = ref([])
const canUpdateUsername = ref(true)
const remainingHours = ref(0)
const usernameUpdateWarning = ref('')

const form = reactive({
  username: '',
  email: '',
  bio: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3到20个字符', trigger: 'blur' }
  ],
  bio: [
    { max: 200, message: '个人简介最多200个字符', trigger: 'blur' }
  ]
}

const fetchUserInfo = () => {
  if (userStore.user) {
    form.username = userStore.user.username
    form.email = userStore.user.email
    form.bio = userStore.user.bio || ''
    
    // 检查用户名修改限制
    checkUsernameUpdateRestriction()
  }
}

const checkUsernameUpdateRestriction = () => {
  // 管理员不受限制
  if (userStore.user?.role === 'admin') {
    canUpdateUsername.value = true
    usernameUpdateWarning.value = ''
    return
  }
  
  if (!userStore.user.usernameUpdatedAt) {
    canUpdateUsername.value = true
    return
  }
  
  const now = new Date()
  const lastUpdate = new Date(userStore.user.usernameUpdatedAt)
  const diffInHours = (now - lastUpdate) / (1000 * 60 * 60)
  
  if (diffInHours >= 24) {
    canUpdateUsername.value = true
    usernameUpdateWarning.value = ''
  } else {
    canUpdateUsername.value = false
    remainingHours.value = Math.ceil(24 - diffInHours)
    usernameUpdateWarning.value = `用户名修改过于频繁,请${remainingHours.value}小时后再试`
  }
}

const fetchMyArticles = async () => {
  try {
    const response = await articleAPI.getArticles({
      author: userStore.user.id,
      page: 1,
      limit: 10
    })
    myArticles.value = response.articles
  } catch (error) {
    console.error('获取我的文章失败:', error)
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await userAPI.updateUser(userStore.user.id, {
          username: form.username,
          bio: form.bio
        })
        await userStore.fetchCurrentUser()
        ElMessage.success('保存成功')
        // 重新检查用户名修改限制
        checkUsernameUpdateRestriction()
      } catch (error) {
        console.error('保存失败:', error)
        if (error.response?.data?.message) {
          ElMessage.error(error.response.data.message)
        } else {
          ElMessage.error('保存失败')
        }
      } finally {
        loading.value = false
      }
    }
  })
}

onMounted(() => {
  fetchUserInfo()
  fetchMyArticles()
})
</script>

<style scoped>
.profile h2 {
  margin: 0 0 20px 0;
  color: #333;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>