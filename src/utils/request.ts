import router from '@/router'
import store from '@/store'
import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'

const request = axios.create({})

// 请求拦截器

request.interceptors.request.use(
  config => {
    const { user } = store.state
    if (user && user.access_token) {
      config.headers.Authorization = user.access_token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

function redirectLogin () {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

function refreshToken () {
  return axios.create()({
    method: 'POST',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: store.state.user.refresh_token
    })
  })
}

// 响应拦截器
let isRefresh = false // 控制刷新Token的状态
let requests: any[] = [] // 存储 刷新 Token 期间过来的401请求
request.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    // 超出2xx状态码
    if (error.response) {
      const { status } = error.response
      // 请求发出去收到响应了，但是状态码超出2xx
      // 400
      if (status === 400) {
        Message.error('请求参数错误')
      } else if (status === 401) {
        if (!store.state.user) {
          redirectLogin()

          return Promise.reject(error)
        }

        // 刷新Token
        if (!isRefresh) {
          isRefresh = true
          // 尝试获取新的access_token
          return refreshToken()
            .then(res => {
              if (!res.data.success) {
                throw new Error('刷新Token失败')
              }
              // 刷新Token成功
              store.commit('setUser', res.data.content)
              // 把 requests 队列中的请求重新发送出去
              requests.forEach(cb => cb())
              // 重置 requests 数组
              requests = []
              return request(error.config)
            })
            .catch(err => {
              console.log(err)

              store.commit('setUser', null)
              redirectLogin()
              return Promise.reject(error)
            })
            .finally(() => (isRefresh = false))
        }

        // 刷新状态下，把请求挂起放到requests中
        return new Promise(resolve => {
          requests.push(() => {
            resolve(request(error.config))
          })
        })
      } else if (status === 403) {
        Message.error('没有权限，请联系管理员')
      } else if (status === 404) {
        Message.error('请求资源不存在')
      } else if (status >= 500) {
        Message.error('服务器错误')
      }
    } else if (error.request) {
      // 请求发出去，没有收到响应
      Message.error('请求超时，请刷新重试')
    } else {
      // 在设置请求是发生了一些事情，触发了错误
      Message.error(`请求失败${error.messsage}`)
    }
    return Promise.reject(error)
  }
)

export default request
