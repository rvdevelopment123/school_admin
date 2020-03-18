const router = require('express').Router();
const passport = require('passport');
import AuthService from '../auth.service';

router
  .get('/', passport.authenticate('google', {
    scope: ['profile', 'email'],
    failureRedirect: '/account/login',
    session: false
  }))
  .get('/callback', passport.authenticate('google', {
    failureRedirect: '/account/login',
    session: false
  }), AuthService.setTokenCookie);

export default router;
