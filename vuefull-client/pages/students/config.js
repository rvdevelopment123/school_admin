import { levels } from '~/config'
export const api = 'students'
export const mylevel = levels
export const heading = 'students'
export const fields = [
  { value: 'first', text: 'First Name', type: 'text' },
  { value: 'last', text: 'Last Name', type: 'text' },
  { value: 'email', text: 'Email', type: 'text' },
  { value: 'level', text: 'Level', type: 'select',
options: levels
},
  { value: 'section', text: 'Section', type: 'select', options: ['Charity','Honesty', 'Faith'] },
  { value: 'parent_id', text: 'Parent', type: 'selectParent'},
  { value: 'active', text: 'Active', type: 'boolean' }
]