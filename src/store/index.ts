import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

interface User {
  access_token: string
  expires_in: number
  jti: string
  organization: string
  refresh_token: string
  scope: string
  token_type: string
  user_id: string
}

const user: User = JSON.parse(window.localStorage.getItem('user') || 'null')
export default new Vuex.Store({
  state: {
    user
  },
  mutations: {
    setUser (state, payload) {
      state.user = JSON.parse(payload)

      window.localStorage.setItem('user', payload)
    }
  },
  actions: {},
  modules: {}
})
