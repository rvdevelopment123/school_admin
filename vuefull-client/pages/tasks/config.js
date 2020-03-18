export const api = 'tasks'
export const heading = 'tasks'
export const fields = [
  { value: 'name', text: 'Title' },
  { value: 'category', text: 'Category', type: 'select', options: ['Shopping', 'Promotions', 'SEO', 'Developments'] },
  { value: 'active', text: 'Complete', type: 'boolean-checkbox' }
]