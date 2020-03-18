let passport = require('passport');
import { Strategy as LocalStrategy } from 'passport-local';

async function localAuthenticate(User, email, password, done) {
  try {
    let user = await User.findOne({ email: email.toLowerCase() }).exec()
    if (!user) {
      return done(null, false, { status: 403, message: 'This email is not registered.' });
    } else if (!user.active) {
      return done(null, false, { status: 403, message: 'This user is inactive.' });
    }
    user.authenticate(password, function (authError, authenticated) {
      if (authError) {
        return done(authError);
      }
      if (!authenticated) {
        return done(null, false, { status: 403, message: 'This password is incorrect.' });
      } else {
        let returnUser = { _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, avatar: user.avatar, city: user.city, dob: user.dob, gender: user.gender, language: user.language, active: user.active }
        return done(null, returnUser);
      }
    });
  }
  catch (err) { done(err) };
}

export function setup(User/*, config*/) {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  }, function (email, password, done) {
    return localAuthenticate(User, email, password, done);
  }));
}