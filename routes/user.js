const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const User = require('../models/user.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

const userController = require('../controllers/user.js');
const user = require('../models/user.js');

router.get('/signup'  ,(req,res)=>{
    res.render('users/signup.ejs');
})

router.post('/signup',wrapAsync(userController.signup));


router.get('/login',(req,res)=>{
    res.render('users/login.ejs');
});


//middleware used passport.authenticate
router.post('/login',
    saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}), 
    userController.login)

router.get('/logout',userController.logout);
module.exports = router;