let express = require('express');
let passport = require('passport');
import AuthService from '../auth.service';
let router = express.Router();
router.post('/logout', function (req, res, next) {
  AuthService.logout(req, res)
});
router.post('/', function (req, res, next) {
  passport.authenticate('local', async function (err, user, info) {
    let error = err || info;
    if (error) {
      if (error == 'Missing password or salt') error = 'Your password has expired. Please reset it.'
      return res.status(error.status || 405).json(error.message || error);
    }
    if (!user) {
      return res.status(404).json({ message: 'Something went wrong, please try again.' });
    } else if (!user.active) {
      return res.status(401).send('User is Inactive');
    }
    let token = await AuthService.signToken(user, req);
    user.token = token;
    res.status(200).json({ token, user });
  })(req, res, next);
});
router.get('/me', async (req, res, next) => {
  let user;
  try {
    user = await AuthService.getUser(req, res, next)
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).send('user not found');
    }
  } catch (err) {
    return res.status(401).send('unauthorized');
  }
})
module.exports = router;