const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');
const passport = require('passport');

router.get('/',passport.checkAuthentication,homeController.home);
router.get('/admin',homeController.admin);
router.post('/admin',homeController.adminShow);
router.get('/forgot-password', homeController.forgotPassword);
router.use('/users',require('./users'));
router.use('/posts',require('./posts'));
router.use('/comments',require('./comments'));

module.exports = router;