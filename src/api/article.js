import request from '@/request/request.js'

export const articleListService = (params) => {
  return request.get('article', { params })
}


