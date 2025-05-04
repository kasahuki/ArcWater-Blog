import { defineStore } from 'pinia'
// 唯一id category
// state 放数据
// action 放函数
export const useCategoryStore = defineStore('category',{
  state: () => ({
    categories: [],
  }),
  actions: {
    setCategories(categories) {
      this.categories = categories
    }
},
persist: true // 持久化
}
)