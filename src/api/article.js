import request from '@/request/request.js'

export const articleListService = (params) => {
  return request.get('article', { params })
}

// 获取文章详情
export const articleDetailService = (id) => {
  return request.get(`article/${id}`)
}



export const hotArticleService = (count)=>{
  return request.get('/article/hot?count='+count)
}

export const relatedArticleService = (params)=>{
  return request.get('/article/related',{params:params})
}
