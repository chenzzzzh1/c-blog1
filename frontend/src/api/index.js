import request from '../utils/request'

// 认证相关
export const authAPI = {
  register: (data) => request.post('/auth/register', data),
  login: (data) => request.post('/auth/login', data),
  getCurrentUser: () => request.get('/auth/me')
}

// 用户相关
export const userAPI = {
  getUserById: (id) => request.get(`/users/${id}`),
  updateUser: (id, data) => request.put(`/users/${id}`, data)
}

// 文章相关
export const articleAPI = {
  getArticles: (params) => request.get('/articles', { params }),
  getArticleById: (id) => request.get(`/articles/${id}`),
  createArticle: (data) => request.post('/articles', data),
  updateArticle: (id, data) => request.put(`/articles/${id}`, data),
  deleteArticle: (id) => request.delete(`/articles/${id}`),
  likeArticle: (id) => request.post(`/articles/${id}/like`)
}

// 评论相关
export const commentAPI = {
  getCommentsByArticle: (articleId) => request.get(`/comments/article/${articleId}`),
  createComment: (data) => request.post('/comments', data),
  deleteComment: (id) => request.delete(`/comments/${id}`),
  likeComment: (id) => request.post(`/comments/${id}/like`)
}

// 分类相关
export const categoryAPI = {
  getCategories: () => request.get('/categories'),
  getCategoryById: (id) => request.get(`/categories/${id}`),
  createCategory: (data) => request.post('/categories', data),
  updateCategory: (id, data) => request.put(`/categories/${id}`, data),
  deleteCategory: (id) => request.delete(`/categories/${id}`)
}

// 标签相关
export const tagAPI = {
  getTags: () => request.get('/tags'),
  getTagById: (id) => request.get(`/tags/${id}`),
  createTag: (data) => request.post('/tags', data),
  updateTag: (id, data) => request.put(`/tags/${id}`, data),
  deleteTag: (id) => request.delete(`/tags/${id}`)
}

// 搜索相关
export const searchAPI = {
  searchArticles: (params) => request.get('/search', { params })
}
