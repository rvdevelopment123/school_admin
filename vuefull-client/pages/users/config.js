import { userRoles } from '~/config'
export const api = 'users'
export const heading = 'users'
export const fields = [
    { text: 'First Name', value: 'firstName', type: 'text' },
    { text: 'Last Name', value: 'lastName', type: 'text' },
    { text: 'Role', value: 'role', type: 'select', options: userRoles },
    { text: 'Provider', value: 'provider', type: 'select', options: ['local', 'facebook', 'google', 'twitter'] },
    { text: 'Email', value: 'email', type: 'emailmask' },
    { text: 'Active', value: 'active', type: 'boolean' },
]