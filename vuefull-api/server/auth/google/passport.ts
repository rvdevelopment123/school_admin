const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

export async function setup(User) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID || 'YOUR_GOOGLE_APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'YOUR_GOOGLE_APP_SECRET',
    callbackURL: `${process.env.STORE_FRONT_URL || 'http://localhost:3000'}/api/auth/google/callback`
  }, async (accessToken, refreshToken, profile, done) => {
    // check if user already exists in our own db
    try {
      const currentUser = await User.findOne({ email: profile.emails[0].value })
      if (currentUser) {
        // console.log('already have this user: ', currentUser.email);
        return done(null, currentUser);
      } else {
        // if not, create user in our db
        const newUser = await new User({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          gender: profile._json.gender,
          role: 'user',
          username: profile.emails[0].value.split('@')[0],
          avatar: profile._json.image.url,
          provider: 'google',
          google: profile._json
        })
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
  })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
      done(null, user);
    });
  });
}
