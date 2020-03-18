import MediaController from './controller';
const controller = new MediaController();
import AuthService from '../../auth/auth.service';
const auth = new AuthService();
const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');
import { uploadDir } from './../../config'
const multipartyMiddleware = multipart({ uploadDir: uploadDir + 'tmp' });

router.post('/nocrunch/:name', auth.hasRole('user'), multipartyMiddleware, controller.saveNoCrunchedImages);
router.delete('/single', auth.hasRole('user'), controller.deleteSingle);

module.exports = router;
