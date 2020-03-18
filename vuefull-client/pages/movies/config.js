export const api = 'movies'
export const heading = 'movies'
export const fields = [
  { value: 'name', text: 'Title', noEdit: true },
  { value: 'poster', text: 'Poster', type: 'image' },
  { value: 'production', text: 'Production' },
  { value: 'rating', text: 'Rating', type: 'number' },
  { value: 'genre', text: 'Genre', type: 'select', options: ['Action', 'Comedy', 'Drama', 'Romance', 'SiFi', 'Thriller'], noSort: true },
  { value: 'language', text: 'Language', type: 'select', options: ['English', 'Hindi', 'French'] },
  { value: 'tags', text: 'Tags', type: 'array', noList: true },
  { value: 'releaseDate', text: 'Release Date', type: 'date' },
  { value: 'active', text: 'Active', type: 'boolean' }
]