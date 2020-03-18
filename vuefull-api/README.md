
# Vue Fullstack Generator API

## Quick start
> Make sure you have **Node** version >= 11.x, **NPM** >= 6.x, **Yarn** version >= 1.x
> Clone the repo

### navigate inside the directory
```bash
cd generator-vuefull/vuefull-api
```
### install the dependencies with yarn
`yarn`

### Configure
Rename `sample.env -> .env` and replace with credentials

### serve with hot reload at localhost:9000
`yarn dev`

### Generate files for upload to server
`yarn prod`

### Start the app on server
`yarn start`

## There are 2 types of configuratons avaialble
### Application level
#### server/config.ts
```bash 
export const seedDatabase = false; // Seeds database with some demo data when the database is empty
export const staticPath = './../vuefull-images';
export const uploadDir = staticPath + '/images/';
export const userRoles: string[] = ['user', 'vendor', 'manager', 'admin']; // This should be in ascending order of authority. e.g. In this case guest will not have access to any other role, where as admin will have the role of user+vendor+manager+admin // Used at auth.service.ts
```
### API Level
#### server/api/book/config.ts
```bash export const modelName = 'Book'
export const fields = {
    name: 'string',
    author: 'string',
    active: 'boolean',
    price: 'number',
    category: 'string',
    image: 'string',
    isbn: 'string',
    weight: 'string',
    releaseDate: 'date'
}```