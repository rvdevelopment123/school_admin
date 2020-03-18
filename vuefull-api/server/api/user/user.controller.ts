import User from './user.model';
import BaseCtrl from './../base';
import * as async from 'async';
import * as crypto from 'crypto';
import AuthService from './../../auth/auth.service';
import Settings from './../../api/settings/model';
import { toJson, exportCSV } from './../lib';
import { email } from './../lib/email';
const { STORE_FRONT_URL } = process.env
export default class UsersCtrl extends BaseCtrl {
    model = User;
    export = async (req, res) => {
        const name = 'books'
        const sort = req.query.sort || '-updatedAt';
        const skip = parseInt(req.query.skip || 0);
        const limit = parseInt(req.query.limit || 30);
        const where = toJson(req.query.where) || {};
        if (req.query.search)
            where.q = { $regex: new RegExp(req.query.search, "ig") }
        try {
            let filePath = await exportCSV({
                name, model: User, skip, limit, where,
                fields: ['firstName', 'lastName', 'email', 'role', 'phone', 'gender', 'avatar', 'active', 'verified', 'city']
            })
            res.download(filePath);
        } catch (e) {
            return res.status(500).send(e.toString());
        }
    }
    search = async (req, res) => {
        console.log("Search")
        let limit: number = 18
        let skip: number = 0
        let where: any = {};
        let sort: string = null
        let search: string = req.params.search
        let query = toJson(req.query);
        if (query) { // Other filters than search
            if (toJson(query.where)) where = toJson(query.where);
            limit = parseInt(query.limit) || 18
            skip = parseInt(query.skip) || 0
            sort = query.sort || { score: { $meta: "textScore" } }
        }
        where.active = true; where.approved = true;
        where['variants.stock'] = { $gt: 0 }
        try {
            let searchString = where
            if (search != 'null')
                searchString = { ...where, $text: { $search: search } }
            const data = await this.model.find(searchString, { score: { $meta: "textScore" } }).select('_id name slug img imgUrls new hot sale brand brandName brandSlug variants._id variants.size  variants.img variants.price variants.mrp variants.offer').sort(sort).limit(limit).skip(skip).exec()
            const count = await this.model.count(searchString)
            return res.status(200).json({ data, count });
        } catch (e) {
            return res.status(400).send(e);
        }
    }
    validationError = (res, statusCode) => {
        statusCode = statusCode || 422;
        return function (err) {
            if (err.errors && err.errors.email.message) {
                err = err.errors.email;
            }
            return res.status(statusCode).json(err);
        };
    }
    handleError = (res, statusCode) => {
        statusCode = statusCode || 500;
        return function (err) {
            return res.status(statusCode).send(err);
        };
    }
    // Reset password route
    verify = async (req, res, next) => {
        let vm = this
        const settings = await Settings.findOne()
        const user = await User.findOne({ verificationToken: req.params.token })
        if (!user) {
            return res.status(422).json('Verification token is invalid or has expired.');
        }
        user.verified = true;
        try {
            await user.save()
            if (req.body.email) {
                email({
                    to: req.body.email,
                    subject: settings.websiteName + ' Account Verification',
                    template: 'user/verify',
                    context: { Url: STORE_FRONT_URL, name: user.firstName + ' ' + user.lastName }
                })
            }
            return res.status(200).json('Success! Your account has been verified.');
        }
        catch (err) {
            return res.status(422).json(err);
        }
    }
    // Reset password route
    reset = async (req, res, next) => {
        const settings = await Settings.findOne()
        let vm = this
        async.waterfall([
            function (done) {
                User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                    if (!user) {
                        return res.status(422).json('Password reset email is invalid or has expired.');
                    }

                    user.password = req.body.password;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
                    req.body.to = user.email
                    user.save()
                        .then(function () {
                            email({
                                to: user.email,
                                subject: settings.websiteName + ' Password Changed',
                                template: 'user/change-password-success',
                                context: { Url: STORE_FRONT_URL, name: user.firstName + ' ' + user.lastName }
                            })
                            return res.status(200).json('Success! Your password has been changed.');
                        })
                        .catch(function (err) {
                            let statusCode = 422;
                            return function (err) {
                                if (err.errors && err.errors.email.message) {
                                    err = err.errors.email;
                                }
                                return res.status(statusCode).json(err);
                            }
                        });
                });
            }
        ], function (err) {
            if (err) return next(err);
        });
    }
    // Forgot password route
    forgot = async (req, res, next) => {
        const settings = await Settings.findOne()
        let vm = this
        async.waterfall([
            function (done) {
                crypto.randomBytes(20, function (err, buf) {
                    let token = buf.toString('hex');
                    done(err, token);
                });
            },
            function (token, done) {
                User.findOne({ email: req.body.email })
                    .then(user => {
                        if (!user) {
                            return res.status(422).json('No account with that email address exists.');
                        }
                        user.resetPasswordToken = token;
                        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                        user.save(function (err) {
                            done(err, token, user);
                        });
                    });
            },
            function (token, user, done) {
                // req.body.headers =  req.headers
                req.body.to = user.email;
                req.body.host = req.headers.host;
                req.body.token = token;
                email({
                    to: user.email,
                    subject: settings.websiteName + ' Password Reset Request',
                    template: 'user/reset-password',
                    context: { Url: STORE_FRONT_URL, token, name: user.firstName + ' ' + user.lastName }
                })
                return res.status(200).json('An e-mail has been sent to ' + user.email + ' with instructions.');
            }
        ], function (err) {
            if (err) return next(err);
        });
    }

    getAll = (req, res) => {
        let q = {};
        let query = toJson(req.query);
        let select, sort, skip, limit;
        if (query) {
            if (toJson(query.where)) q = toJson(query.where);
            select = toJson(query.select) || '_id firstName lastName email role avatar city active';
            sort = query.sort;
            skip = parseInt(query.skip);
            limit = parseInt(query.limit);
        }
        return User.find(q).limit(limit).skip(skip).sort(sort).select(select).exec()
            .then(users => {
                return res.status(200).json(users);
            })
            .catch(this.handleError);
    }

    /**
     * Creates a new user
     */
    create = async (req, res) => {
        const settings = await Settings.findOne()
        req.body.role = req.body.role || 'user';
        let newUser = new User(req.body);
        newUser.provider = newUser.provider || 'local';
        try {
            const verificationToken = await crypto.randomBytes(20).toString('hex');
            newUser.verificationToken = verificationToken
            let user = await newUser.save()
            let token = await AuthService.signToken(user, req);
            // Gets shop email from settings and send email to user with from=shopEmail
            if (newUser.email) {
                if (!settings.shopEmail) {
                    res.status(422).send('Administrator: Plese setup shop email address under settings')
                    return
                }
                // email({
                //     to: newUser.email,
                //     subject: websiteName + ' Account Verification',
                //     template: 'user/verify',
                //     context: newUser
                // })
                return res.status(201).json({ token, user: { _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, dob: user.dob, gender: user.gender, role: user.role, provider: user.provider, token: token } });
            } else {
                // res.status(201).send('Email address not found') // This should not be an error shown at Signup page
            }
        }
        catch (e) {
            // if (err.errors && err.errors.email && err.errors.email.message) {
            //     err = err.errors.email.message;
            // }
            res.status(422).send(e.toString());
        }
    }
    /**
     * Change a users password
     */
    changePassword = async (req, res) => {
        const settings = await Settings.findOne()
        let userId = req.user._id;
        let oldPass = String(req.body.oldPassword);
        let newPass = String(req.body.newPassword);
        return User.findById(userId)
            .then(user => {
                if (user.authenticate(oldPass)) {
                    user.password = newPass;
                    return user.save()
                        .then(() => {
                            email({
                                to: user.email,
                                subject: settings.websiteName + ' Password Changed',
                                template: 'user/change-password',
                                context: { Url: STORE_FRONT_URL, name: user.firstName + ' ' + user.lastName }
                            })
                            return res.status(200).send({ message: 'Password changed successfully' });
                        })
                        .catch(this.validationError);
                } else {
                    return res.status(403).send('Incorrect old Password');
                }
            });
    }
    updateProfile = async (req, res) => {
        if (req.body._id) {
            delete req.body._id;
        }
        try {
            let result = await this.model.update({ _id: req.user._id }, { $set: req.body }).exec()
            if (result.nModified == 0) {
                res.status(202).json('No changes to modify');
                return null;
            }
            else {
                let oneUser = await this.model.findById(req.user._id).exec()
                let token = AuthService.signToken(oneUser, req) // To update the token 
                req.body.token = token
                res.status(200).json(req.body);
            }
        } catch (e) {
            // console.log('update profile error at server.........', e);
            res.status(500).send(e);
        }
    };
    /**
     * Get my info
     */
    me = async (req, res, next) => {
        try {
            const user = await User.findById(req.user._id).select('_id firstName lastName email role avatar state city state phone zip gender active dob language')
            if (!user)
                return res.status(401).end();
            return res.status(200).json(user);
        }
        catch (err) { next(err) }
    }

    /**
     * Authentication callback
     */
    authCallback = (req, res) => {
        res.redirect('/');
    }
}
