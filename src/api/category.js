import request from '@/request/request.js'

export const categoryListService = () => {
  return request.get('category')
}

export const categoryGetService = (id) => {
  return request.get('category/'+ id)
}

