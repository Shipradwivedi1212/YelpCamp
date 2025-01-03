const User = require('../models/user');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
module.exports.renderRegister =(req,res)=>{
    res.render('users/register')
}
module.exports.register = async (req,res)=>{
    try{
    const {email,username,password} = req.body;
    const user = new User({email,username});
    const registeredUser = await User.register(user,password);
    req.login(registeredUser,(err)=>{
        if(err) next(err);
        console.log(registeredUser);
    req.flash('success','welcome to YelpCamp');
    res.redirect('/campgrounds');
    })
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
    
};
module.exports.renderlogin = (req,res)=>{
    res.render('users/login');
};
module.exports.createlogin = (req,res)=>{
    req.flash('success','welcome');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
};
module.exports.logout = (req,res)=>{
    req.logout(function (err) {
        if (err) {
            return next(err);
        };
    req.flash('success','successfully logged out')
    res.redirect('/campgrounds');
});
};