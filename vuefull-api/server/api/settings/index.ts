let express = require('express');
import Ctrl from './controller';
let controller = new Ctrl();
let router = express.Router();
import AuthService from '../../auth/auth.service';
let auth = new AuthService();

router.get('/', controller.public);
router.get('/admin', auth.hasRole('admin'), controller.admin);
router.get('/my', auth.isAuthenticated(), controller.my);
router.get('/:id', controller.get);
router.put('/:id', auth.hasRole('manager'), controller.update);
router.patch('/:id', auth.hasRole('manager'), controller.update);

module.exports = router;
