import request from '@/request/request'

export const musicListService = async () => {
  return  request.get('/music')
}


// 直接从  list 中获取 当前点击的音乐即可 不需要按找id 查找


export const musicSearchService = async (params) => {
  return request.get('/music/search', { params })
}









