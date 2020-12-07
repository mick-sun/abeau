import request from '@/utils/request'
import { AxiosResponse } from 'axios'
import qs from 'qs'

interface LoginRequest {
  phone: string
  password: string
}

export interface UserInfo {
  isUpdatedPassword: boolean
  portrait: string
  userName: string
  weixinNickName: string
}

interface Response<T> extends AxiosResponse {
  content: T
  message: string
  state: number
  success: boolean
}

export const login = (
  data: LoginRequest
): Promise<Response<string>> => {
  return request.post('/front/user/login', qs.stringify(data))
}

export const getUserInfo = (): Promise<Response<UserInfo>> => {
  return request.get('/front/user/getInfo')
}
