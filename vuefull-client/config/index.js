export const API_URL = 'http://localhost:9090' // The port where API runs
export const tokenExpiry = 160 * 60 * 15 // Login validity (15 minutes  + 1 in the)
export const typingTimeout = 700 // After this delay the search api will be fired
export const loadingTimeout = 500 // Loading indicator will be shown after this delay
export const userRoles = ['user', 'vendor', 'manager', 'admin'] // This should be in ascending order of authority. e.g. In this case user will not have access to any other role, where as admin will have the role of user+vendor+manager+admin
export const levels = [
    'Pre-school',
    'Kinder',
    'Level 1',
    'Level 2',
    'Level 3',
    'Level 4',
    'Level 5',
    'Level 6',
    'Level 7',
    'Level 8',
    'Level 9',
    'Level 10',
    'Level 11',
    'Level 12',
    'First Year',
    'Second Year',
    'Third Year',
    'Fourth Year'
  ] // This should be in ascending order of authority. e.g. In this case user will not have access to any other role, where as admin will have the role of user+vendor+manager+admin
export const currency = { symbol: '₱', code: 'Php' }

export const head = {
    titleTemplate: '%s - SchoolApp',
    htmlAttrs: { lang: 'en' },
    meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' },
        { 'http-equiv': 'x-ua-compatible', content: 'ie=edge' }
    ],
    link: [
        { rel: 'icon', type: 'image/x-icon', href: 'favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Oswald:300,400,500,700|Material+Icons' }
    ]
}
