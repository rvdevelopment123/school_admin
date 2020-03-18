# Vue Fullstack Generator

Navigate inside `generator-vuefull` directory and run the following

## Run Once
```
yarn link
```

This will enable us to run the following command

## Run
```
yo vuefull book
```

Here `book` is the database model to be generated. This will also generate a api endpoint named `books`

## Navigate inside `generator-vuefull/crud-api` and run the following

```
yarn
yarn dev 
```

This will start api at http://localhost:9000

## Navigate inside `generator-vuefull/crud-client` and run the following

```
yarn
yarn dev
```

Open http://localhost:3000 using web browser

## The following will be auto generated
### Server (API)
- book/config.ts ` The file is user configurable. It has 2 variables : ModelName and Fields`
- book/controller.ts `Here all the controller functions are defined`
- book/index.ts `Entry point for API. All sub routes are defined here e.g. /api/books/export`
- book/model.ts `Binds database structure to the API`
- Will add the api to the server router

### Client
 - Will add the route to config/menu.json `It contains the Website menu for navigation which is displayed at website home page and Left side menu`

- books/_id.vue `The detail page for editing / adding new book`
- books/index.vue `List of all books`
- books/config.js `Contains confugiration for ModelName, API, Page Heading, fields`


## Features

  - Generate Create, Update, Delete, Read, Search, Sort, Pagination with `1 command`.
  - All operations(Create, Update, Delete, Read, Search, Sort) are through API hence consumes less client memory
  - Integrated authentication module `Login, Signup, Change Password, Forgot Password, Reset Password, Edit Profile`
  - User Roles module with level of separation
  - Best user experience with Single Page Application
  - Modular coding structure
  - Auto deploy to production server
  - Better and cleaner JavaScript code
  - Simplified installation and configuration
  - Reliable: Load fast and provide offline experience
  - Fast: Respond quickly to user actions
  - Engaging: Feel like a native app on mobile devices
  - Industry best practices
  - Accessibility support out of the box
  - All configurations at 1 place
  - Highly customizable 
  - Separate API and Client, hence highly flexible
  - Created using the latest technology stack `MongoDB ExpressJS VueJS NodeJS (MEVN)`
  - Auto generate minified files for deployment to production server
  - Modular Emails with integrated templating feature
  - Multilingual support