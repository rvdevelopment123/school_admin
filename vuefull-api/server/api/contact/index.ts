import Ctrl from './controller';
const controller = new Ctrl();
let express = require('express');
import AuthService from '../../auth/auth.service';
let auth = new AuthService();
let router = express.Router();

router.get('/', controller.index);
router.get('/export', controller.export);
router.get('/updateAllQ', controller.updateAllQ);
router.get('/my', auth.isAuthenticated(), controller.my);
router.get('/:id', controller.get);
router.post('/', auth.hasRole('manager'), controller.insert);
router.put('/:id', auth.hasRole('manager'), controller.update);
router.patch('/:id', auth.hasRole('manager'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.delete);

module.exports = router;
