import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
export const strict = false
export const state = () => ({
  settings: {},
  leftMenu: false,
  
  loading: false,
  error: { is: false, time: null, msg: null, type: 'info' },
  isError: null // Only required to inform App.vue that an error is there hence initiate the snackbar
})
export const getters = {
  loading(state) {
    return state.loading
  },
  error(state) {
    return state.error
  },
  loggedIn(state) {
    let isLoggedIn = false;
    if (state.user && state.user.token != "undefined")
      isLoggedIn = true;
    else
      isLoggedIn = false
    return !!isLoggedIn;
  }
}
export const mutations = {
  showMenu(state, show) {
    state.leftMenu = show;
  },
  demo(state, msg) {
    // alert(state.settings.demo)
    // if (state.settings.demo) {
    //   state.error = { is: true, msg: 'Demo mode:: ' + msg, timeout: 3000, time: Date.now() }
    //   throw 'Demo mode'
    // }
  },
  settings(state, payload) {
    state.settings = payload
  },
  busy(state, payload) {
    state.loading = payload
  },
  setSuccess(state, { msg, timeout = 2000 }) {
    state.error = { is: true, msg, color: 'success', timeout, time: Date.now() }
  },
  setWarning(state, msg) {
    state.error = { is: true, msg, color: 'cyan', timeout: 3000, time: Date.now() }
  },
  setErr(state, msg) {
    if (msg && msg.response && msg.response.data) {
      msg = msg.response.data;
    } else if (msg && msg.response) {
      msg = msg.response;
    }
    state.error = { is: true, msg, color: 'error', timeout: 5000, time: Date.now() }
  },
  setInfo(state, msg) {
    state.error = { is: true, msg, color: 'info', timeout: 3000, time: Date.now() }
  },
  clearErr(state) {
    state.error = { is: false, msg: '', timeout: 10, time: Date.now() }
  }
}
export const actions = {
  async nuxtClientInit({ commit, dispatch }, context) {
    // Settings
    try {
      let settings = await this.$axios.$get('settings')
      commit('settings', settings)
    } catch (e) {
      commit('setErr', e)
    }
    // Authorization
    let auth = this.$cookies.get('Authorization')
    if (auth) {
      this.$axios.setToken(auth, 'Bearer')
      try {
        await dispatch('auth/fetch')
      }
      catch (error) {
        this.$axios.setToken(null)
      }
    } else {
      this.$axios.setToken(null)
    }
  }
}
