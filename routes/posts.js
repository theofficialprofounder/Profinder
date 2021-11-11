const express = require('express');
const router = express.Router();
const postController = require('../controllers/posts_controller');
const passport= require('passport');

router.post('/create',passport.checkAuthentication,postController.create);
router.get('/delete/:id',passport.checkAuthentication,postController.delete);
router.get('/edit/:id',passport.checkAuthentication,postController.edit);
router.post('/edit/:id',passport.checkAuthentication,postController.editUtil);
router.get('/:id',passport.checkAuthentication,postController.send);
router.get('/',passport.checkAuthentication,postController.custom);

module.exports = router;