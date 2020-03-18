import { tokenExpiry, userRoles } from '~/config'
export const state = () => ({
    user: null,
    roles: userRoles || []
})

// getters
export const getters = {
    hasRole: state => (role) => {
        return state.user ? state.roles.indexOf(state.user.role) >= state.roles.indexOf(role) : false;
    }
}

// mutations
export const mutations = {
    setUser(state, data) {
        state.user = data
    },
    clearUser(state) {
        state.user = null
    },
}

export const actions = {
    async fetch({ commit }) {
        try {
            const data = await this.$axios.$get('/users/me')
            commit('setUser', data)
            return data
        }
        catch (err) {
            commit('clearUser')
        }
    },
    async login({ commit }, payload) {
        try {
            const { status, data } = await this.$axios.post('auth/local', payload)
            if (status == 200 || status == 201) {
                this.$axios.setToken(data.token, 'Bearer')
                commit('setUser', data.user)
                this.$cookies.set('Authorization', data.token, { path: '/', maxAge: tokenExpiry })
                return status
            }
        } catch (e) {
            commit('setErr', e, { root: true })
        }
    },
    async signup({ commit }, payload) {
        try {
            let data = await this.$axios.$post('users', payload)
            if (data) {
                commit('setUser', data.user)
                this.$axios.setToken(data.token, 'Bearer')
                this.$cookies.set('Authorization', data.token, { path: '/', maxAge: tokenExpiry })
                return data
            }
        } catch (e) {
            commit('setErr', e, { root: true })
        }
    },
    async forgotPassword({ commit }, payload) {
        try {
            let data = await this.$axios.$post('/users/forgot', payload)
            commit('setSuccess', { msg: data, timeout: 15000 }, { root: true })
            $nuxt.$router.push('/account/login')
            return data
        } catch (e) {
            commit('setErr', e, { root: true })
        }
    },
    async changePassword({ commit }, payload) {
        commit('demo', 'unable to change password', { root: true })
        try {
            const data = await this.$axios.$put('/users/password', payload)
            commit('setSuccess', { msg: data.message }, { root: true })
            $nuxt.$router.push('/')
            return data
        } catch (e) {
            commit('setErr', e, { root: true })
            throw e
        }
    },
    async resetPassword({ commit }, payload) {
        try {
            const data = await this.$axios.$post('/users/reset/' + payload.id, payload)
            commit('setSuccess', { msg: data, timeout: 10000 }, { root: true })
            $nuxt.$router.push('/account/login')
            return data
        } catch (e) {
            commit('setErr', e, { root: true })
        }
    },
    async updateProfile({ commit }, { firstName, lastName, phone, city, zip, avatar, gender, dob, language }) {
        commit('demo', 'unable to update profile', { root: true })
        try {
            const { data } = await this.$axios.put('/users/profile', { firstName, lastName, phone, city, zip, avatar, gender, dob, language })
            if (data) {
                commit('setUser', { email: data.email, firstName: data.firstName, lastName: data.lastName, phone: data.phone, avatar: data.avatar, dob: data.dob, gender: data.gender, language: data.language })
                try {
                    const userdata = await this.$axios.$get('/users/me')
                    commit('setUser', userdata)
                }
                catch (err) {
                    commit('clearUser')
                }
            }
            commit('setSuccess', { msg: 'Profile updated successfully.' }, { root: true })
        } catch (e) {
            commit('setErr', e, { root: true })
            return 500
        }
    },
    logout({ commit }) {
        commit('clearUser') // Removes user from Store
        this.$cookies.remove('Authorization')
    }
}