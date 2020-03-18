import * as crypto from 'crypto';
import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';
mongoose.Promise = require('bluebird');

const authTypes = ['github', 'twitter', 'facebook', 'google'];

let UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    lowercase: true,
    required: function () {
      if (authTypes.indexOf(this.provider) === -1) {
        return true;
      } else {
        return false;
      }
    }
  },
  phone: { type: String },
  role: { type: String, default: 'user' },
  password: {
    type: String,
    required: function () {
      if (authTypes.indexOf(this.provider) === -1) {
        return true;
      } else {
        return false;
      }
    }
  },
  verificationToken: String,
  gender: String,
  avatar: String,
  resetPasswordToken: String,
  resetPasswordExpires: String,
  provider: String,
  salt: String,
  facebook: {},
  twitter: {},
  google: {},
  github: {},
  active: { type: Boolean, default: true },
  verified: { type: Boolean, default: true },
  q: String
}, {
    versionKey: false,
    timestamps: true
  });
/**
 * Virtuals
 */

// Public profile information
UserSchema
  .virtual('profile')
  .get(function () {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function () {
    return {
      _id: this._id,
      role: this.role
    };
  });

/**
 * Validations
 */

// Validate empty phone
UserSchema
  .path('email')
  .validate(function (email) {
    if (authTypes.indexOf(this.provider) !== -1) {
      return true;
    }
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('password')
  .validate(function (password) {
    if (authTypes.indexOf(this.provider) !== -1) {
      return true;
    }
    return password.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function (value, respond) {
    if (authTypes.indexOf(this.provider) !== -1) {
      return respond(true);
    }

    return this.constructor.findOne({ email: value }).exec()
      .then(user => {
        if (user) {
          if (this.id === user.id) {
            return respond(true);
          }
          return respond(false);
        }
        return respond(true);
      })
      .catch(function (err) {
        throw err;
      });
  }, 'This email is already registered.');

let validatePresenceOf = function (value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function (next) {
    this.q = this.firstName ? this.firstName + ' ' : ''
    this.q += this.lastName ? this.lastName + ' ' : ''
    this.q += this.phone ? this.phone + ' ' : ''
    this.q += this.phone1 ? this.phone1 + ' ' : ''
    this.q += this.provider ? this.provider + ' ' : ''
    this.q += this.address ? this.address + ' ' : ''
    this.q += this.email ? this.email + ' ' : ''
    this.q += this.role ? this.role + ' ' : ''
    this.q += ' '
    if (!this.isModified('password')) {
      return next();
    }

    if (!validatePresenceOf(this.password)) {
      if (authTypes.indexOf(this.provider) === -1) {
        return next(new Error('Invalid password'));
      } else {
        return next();
      }
    }

    // Make salt with a callback
    this.makeSalt((saltErr, salt) => {
      if (saltErr) {
        return next(saltErr);
      }
      this.salt = salt;
      this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
        if (encryptErr) {
          return next(encryptErr);
        }
        this.password = hashedPassword;
        return next();
      });
    });
  });

UserSchema.methods = {
  authenticate(password, callback) {
    if (!callback) {
      return this.password === this.encryptPassword(password);
    }

    this.encryptPassword(password, (err, pwdGen) => {
      if (err) {
        return callback(err);
      }

      if (this.password === pwdGen) {
        return callback(null, true);
      } else {
        return callback(null, false);
      }
    });
  },

  makeSalt(byteSize, callback) {
    let defaultByteSize = 16;

    if (typeof arguments[0] === 'function') {
      callback = arguments[0];
      byteSize = defaultByteSize;
    } else if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    } else {
      throw new Error('Missing Callback');
    }

    if (!byteSize) {
      byteSize = defaultByteSize;
    }

    return crypto.randomBytes(byteSize, (err, salt) => {
      if (err) {
        return callback(err);
      } else {
        return callback(null, salt.toString('base64'));
      }
    });
  },

  encryptPassword(password, callback) {
    if (!password || !this.salt) {
      if (!callback) {
        return null;
      } else {
        return callback('Missing password or salt');
      }
    }

    let defaultIterations = 10000;
    let defaultKeyLength = 64;
    let salt = new Buffer(this.salt, 'base64');

    if (!callback) {
      return crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, 'sha512')
        .toString('base64');
    }

    return crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, 'sha512', (err, key) => {
      if (err) {
        return callback(err);
      } else {
        return callback(null, key.toString('base64'));
      }
    });
  }
};
export default mongoose.model('User', UserSchema);
