import { userRoles } from './../config';
import * as jwt from 'jsonwebtoken';
import * as expressJwt from 'express-jwt';
import * as compose from 'composable-middleware';
import User from '../api/user/user.model';

import * as dotenv from 'dotenv';
dotenv.config()
let uRole = userRoles;
const SESSION_SECRET = process.env.SESSION_SECRET || 'arialshop-secret';
let validateJwt = expressJwt({
  secret: SESSION_SECRET
});

let jwtUserInfo = expressJwt({
  secret: SESSION_SECRET,
  credentialsRequired: false
});

export default class AuthService {
  model = User;

  isAuth = () => {
    return compose()
      // Validate jwt
      .use(function (req, res, next) {

        // IE11 forgets to set Authorization header sometimes. Pull from cookie instead.
        if (req.query && req.cookies && typeof req.headers.authorization === 'undefined') {
          req.headers.authorization = `Bearer ${req.cookies.token}`;
        }
        // console.log('Auth Token... ', req.headers.authorization);
        // console.log(chalk.red(req.headers.authorization));
        jwtUserInfo(req, res, next);
      })
      // Attach user to request
      .use(async function (req, res, next) {
        // console.log('isAuthenticated', req.user);
        if (!req.user) { next(); return null }
        let user = await User.findById(req.user._id).exec() //.select('_id email name role avatar active provider')
        try {
          if (!user) {
            return res.status(401).send('User does not exist');
          } else if (!user.active) {
            return res.status(401).send('User is Inactive');
          }
          req.user = user;
          next();
          return null;
        }
        catch (err) { next(err) }
      });
  }
  /**
  * Attaches the user object to the request if authenticated
  * Otherwise returns 403
  */
  isAuthenticated = () => {
    return compose()
      // Validate jwt
      .use(function (req, res, next) {
        if (!req.query.hasOwnProperty('token') && !req.headers.authorization) {
          res.status(401).send('Request is not authorized');
          return;
        }
        // console.log('req.query, req.cookies', req.query, req.cookies);
        // allow token to be passed through query parameter as well
        if (req.query && req.query.hasOwnProperty('token')) {
          req.headers.authorization = `Bearer ${req.query.token}`;
        }
        // IE11 forgets to set Authorization header sometimes. Pull from cookie instead.
        if (req.query && req.cookies && typeof req.headers.authorization === 'undefined') {
          req.headers.authorization = `Bearer ${req.cookies.token}`;
        }
        // console.log('Auth Token... ', req.headers.authorization);
        // console.log(chalk.red(req.headers.authorization));
        validateJwt(req, res, next);
      })
      // Attach user to request
      .use(async function (req, res, next) {
        // console.log('isAuthenticated', req.user);
        let user = await User.findById(req.user._id).exec() //.select('_id email name role avatar active provider')
        try {
          if (!user) {
            return res.status(401).send('User does not exist');
          } else if (!user.active) {
            return res.status(401).send('User is Inactive');
          }
          req.user = user;
          next();
          return null;
        }
        catch (err) { next(err) }
      });
  }

  /**
   * Attaches the user object to the request if authenticated
   * Otherwise blank
   */
  attachRegisterUserInfo = () => {
    return compose()
      .use(function (req, res, next) {
        if (req.user) {
          User.findById(req.user._id).exec() //.select('_id email name role avatar active provider')
            .then(user => {
              if (!user) {
                return res.status(401).send('User does not exist');
              } else if (!user.active) {
                return res.status(401).send('User is Inactive');
              }
              req.user = user;
              next();
              return null;
            })
            .catch(err => next(err));
        } else {
          next();
        }
      });
  }
  attachUserInfo = () => {
    return compose()
      // Validate jwt providing access to unregistered users
      .use(function (req, res, next) {
        jwtUserInfo(req, res, next)
      })
      .use(function (req, res, next) {
        if (req.user) {
          User.findById(req.user._id).exec() //.select('_id email name role avatar active provider')
            .then(user => {
              req.user = user;
              next();
              return null;
            })
            .catch(err => next(err));
        } else {
          next();
        }
      });
  }

  /**
   * Checks if the user role meets the minimum requirements of the route
   */
  hasRole = (roleRequired) => {
    if (!roleRequired) {
      throw new Error('Required role needs to be set');
    }

    return compose()
      .use(this.isAuthenticated())
      .use(function meetsRequirements(req, res, next) {
        if (uRole.indexOf(req.user.role) >= uRole.indexOf(roleRequired)) {
          return next();
        } else {
          return res.status(403).send('You are not authorized.');
        }
      });
  }

  /**
   * Checks if the user role meets the minimum requirements of the route
   */
  hasRoles = (roleRequired) => {
    if (!roleRequired) {
      throw new Error('Required role needs to be set');
    }

    return compose()
      .use(this.isAuthenticated())
      .use(function meetsRequirements(req, res, next) {
        let authorized = false;
        for (let role of roleRequired) {
          authorized = uRole.indexOf(req.user.role) === uRole.indexOf(role) || authorized;
        }
        if (authorized) {
          return next();
        } else {
          return res.status(403).send('You are not authorized.');
        }
      });
  }
  static getUser = async (req, res, next) => {
    if (req.headers && req.headers.authorization) {
      let token = req.headers.authorization.replace('Bearer ', '');
      try {
        return jwt.verify(token, SESSION_SECRET)
      } catch (err) {
        console.log('[server:authservice] getuser err..............', err);
      }
    }
  }
  /**
   * Returns a jwt token signed by the app secret
   */
  static signToken = async (user, req) => {
    await User.update({ _id: user._id }, { $set: { sessionID: req.sessionID } }).exec()
    req.user = user
    return jwt.sign({ _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, avatar: user.avatar, city: user.city, state: user.state, phone: user.phone }, SESSION_SECRET, {
      expiresIn: 60 * 60 * 24 * 365
    });
  }

  /**
   * Set token cookie directly for oAuth strategies
   */
  static setTokenCookie = async (req, res) => {
    if (!req.user) {
      return res.status(404).send('It looks like you aren\'t logged in, please try again.');
    }
    let token = await AuthService.signToken(req.user, req);
    req.user.token = token;
    res.cookie('Authorization', token);
    res.redirect('/oauth/success?token=' + token);
  }
  static logout = async (req, res) => {
    AuthService.signToken({}, req);
    res.cookie('Authorization', null);
    await req.session.destroy();
    res.status(200).json({})
  }
}
