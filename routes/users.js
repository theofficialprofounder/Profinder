const express = require('express');
const router = express.Router();
const userController = require('../controllers/users_controller');
const passport= require('passport');

router.get('/profile/:id',passport.checkAuthentication,userController.profile);
router.get('/sign-up',userController.signUp);
router.get('/verify/:id',userController.verify);
router.get('/sign-in',userController.signIn);
router.post('/update/:id',passport.checkAuthentication,userController.update);
router.get('/password/:id',passport.checkAuthentication,userController.showPass);
router.get('/update',passport.checkAuthentication,userController.updateDisplay);
router.post('/create',userController.create);
// router.post('/update/:id',userController.update);
// //Use passport as middleware to authenticate
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
) ,userController.createSession);
router.get('/sign-out',userController.destroySession);
router.post('/forgot-password',userController.forgotPassword);
router.get('/forgot-password/:id',userController.displayForgotPassword);
router.post('/forgot-password/:id',userController.handleForgotPassword);


module.exports = router;