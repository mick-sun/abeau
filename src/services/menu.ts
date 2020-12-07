import request from '@/utils/request'

export const createOrUpdateMenu = (data: any) => {
  return request.post('/boss/menu/saveOrUpdate', data)
}

export const getEditMenuInfo = (id = -1) => {
  return request.get(`/boss/menu/getEditMenuInfo?id=${id}`)
}

export const getAllMenus = () => {
  return request.get('/boss/menu/getAll')
}

export const deleteMenu = (id: number) => {
  return request.delete(`/boss/menu/${id}`)
}
