import UserCtrl from './user.controller';
const controller = new UserCtrl();
let express = require('express');
import AuthService from '../../auth/auth.service';
const auth = new AuthService();
let router = express.Router();

router.get('/', auth.hasRoles(['vendor', 'manager', 'admin']), controller.index);
router.get('/export', controller.export);
router.get('/updateAllQ', controller.updateAllQ);
router.get('/users', auth.hasRole('manager'), controller.index);
router.get('/count', auth.hasRole('vendor'), controller.count);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/export', controller.export);
router.get('/:id', auth.isAuthenticated(), controller.get);
router.get('/search/:search', controller.search);
router.put('/password', auth.isAuthenticated(), controller.changePassword);
router.put('/profile', auth.isAuthenticated(), controller.updateProfile);
router.put('/:id', auth.isAuthenticated(), controller.patch);
router.post('/', auth.attachRegisterUserInfo(), controller.create);
router.post('/forgot', controller.forgot);
router.post('/reset/:token', controller.reset);
router.post('/verify/:token', controller.verify);
router.delete('/:id', auth.hasRole('admin'), controller.delete);

module.exports = router;
