const passport = require('passport');
const Strategy = require('passport-twitter').Strategy;

export async function setup(User) {
  passport.use(new Strategy({
    consumerKey: process.env.TWITTER_ID || 'YOUR_TWITTER_APP_ID',
    consumerSecret: process.env.TWITTER_SECRET || '',
    callbackURL: `${process.env.STORE_FRONT_URL || 'http://localhost:3000'}/api/auth/twitter/callback`
  }, async (token, tokenSecret, profile, done) => {
    console.log('twitter login', profile);
    try {
      const currentUser = await User.findOne({ email: profile.emails[0].value })
      if (currentUser) {
        // console.log('already have this user: ', currentUser.email);
        return done(null, currentUser);
      } else {
        // if not, create user in our db
        const newUser = await new User({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.emails[0].value,
          gender: profile._json.gender,
          role: 'user',
          username: profile.emails[0].value.split('@')[0],
          avatar: profile._json.image.url,
          provider: 'twitter',
          twitter: profile._json
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
  }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
      done(null, user);
    });
  });
}
