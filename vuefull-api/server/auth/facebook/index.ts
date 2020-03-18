let router = require('express').Router();
let passport = require('passport');
import AuthService from '../auth.service';

router
  .get('/', passport.authenticate('facebook', {
    scope: ['email'],
    failureRedirect: '/account/login',
    session: false
  }))
  .get('/callback', passport.authenticate('facebook', {
    failureRedirect: '/account/login',
    session: false
  }), AuthService.setTokenCookie);

export default router;
