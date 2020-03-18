import * as express from 'express';
const routes = require(process.cwd() + '/server/routes.json')
export default function (app) {

  app.use('/api/users', require('./api/user'));
  app.use('/api/auth', require('./auth'));
  app.use('/api/media', require('./api/media'));
  app.use('/api/settings', require('./api/settings'));
  for (let r of routes) {
    app.use(`/api/${r.api}`, require(`./api/${r.model}`));
  }
  app.use(express.static('public'));
  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.status(404).json('Page not found');
    });
  app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send('invalid token...');
    }
  });
}
