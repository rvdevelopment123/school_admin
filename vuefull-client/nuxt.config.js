require('dotenv').config()
const { API_URL, head } = require("./config");
const PROXY = API_URL
export default {
    mode: 'spa',
    head,
    loading: '~/components/Loading.vue',
    css: ['~assets/transitions.css'],
    plugins: [
        { src: '~/plugins/validate.js' },
        { src: '~/plugins/i18n.js', ssr: false },
        { src: '~/plugins/sweetalert2.js', ssr: false },
        { src: '~/plugins/nuxt-client-init.js', ssr: false }
    ],
    modules: ['@nuxtjs/axios', 'cookie-universal-nuxt'],
    devModules: ['@nuxtjs/vuetify'],
    axios: {
        baseURL: PROXY + '/api/',
        browserBaseURL: '/api/',
        proxy: true,
        credentials: true
    },
    proxy: {
        '/api': PROXY,
        '/auth': PROXY,
        '/images': PROXY
    },
    workbox: {
        runtimeCaching: [
            {
                urlPattern: 'https://fonts.googleapis.com/.*',
                handler: 'cacheFirst',
                method: 'GET',
                strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
            },
            {
                urlPattern: 'https://fonts.gstatic.com/.*',
                handler: 'cacheFirst',
                method: 'GET',
                strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
            }
        ]
    },
    env: { PROXY: PROXY }
}
