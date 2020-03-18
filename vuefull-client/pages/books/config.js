export const api = 'books'
export const heading = 'books'
export const fields = [
  { value: 'name', text: 'Title', type: 'text' },
  { value: 'author', text: 'Author', type: 'text' },
  { value: 'category', text: 'Category', type: 'select', options: ['Fiction', 'Non fiction', 'Inspirational', 'Novel', 'Science', 'Story'] },
  { value: 'price', text: 'Price', type: 'currency' },
  { value: 'releaseDate', text: 'Release Date', type: 'date' },
  { value: 'isbn', text: 'ISBN', type: 'text', noEdit: true },
  { value: 'active', text: 'Availability', type: 'boolean' }
]