import { categoryListService } from "@/api/category"


export const getCategories = async () => {
  let res = await categoryListService()
  res = res.data
  return res
}