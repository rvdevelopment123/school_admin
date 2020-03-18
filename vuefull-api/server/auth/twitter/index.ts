const router = require('express').Router();
const passport = require('passport');
import AuthService from '../auth.service';

router
  .get('/', passport.authenticate('twitter', {
    failureRedirect: '/account/login',
    session: false
  }))
  .get('/callback', passport.authenticate('twitter', {
    failureRedirect: '/account/login',
    session: false
  }), AuthService.setTokenCookie);

export default router;