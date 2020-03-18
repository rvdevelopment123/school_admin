let passport = require('passport');
import { Strategy as FacebookStrategy } from 'passport-facebook';

export async function setup(User) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID || 'YOUR_FACEBOOK_APP_ID',
    clientSecret: process.env.FACEBOOK_SECRET || '',
    callbackURL: `${process.env.STORE_FRONT_URL || 'http://localhost:3000'}/api/auth/facebook/callback`,
    profileFields: ['name', 'displayName', 'emails', 'photos']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const currentUser = await User.findOne({ email: profile.emails[0].value })
      if (currentUser) {
        console.log('already have this user: ', currentUser.email);
        return done(null, currentUser);
      } else {
        const newUser = new User({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          gender: profile._json.gender,
          role: 'user',
          username: profile.displayName,
          avatar: profile.photos[0].value,
          provider: 'facebook',
          facebook: profile._json
        });
        console.log('created new user: ', newUser);
        try {
          const savedUser = await newUser.save()
          done(null, savedUser)
        }
        catch (err) {
          console.log('create new user error ', err);
          done(err);
        }
      }
    }
    catch (err) { console.log('error at find user ', err); done(err) };
  }));
}
