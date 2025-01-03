const Joi = require('joi');
const Campground = require('./models/campground');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/reviews');
const {campgroundSchema,reviewSchema} = require('./Schemas');
module.exports.isLoggedIn  = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error',"You must be logged in!")
        return res.redirect('/login');
    }
    next();
}
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
module.exports.validateCampground = (req,res,next)=>{
    // const campgroundSchema = Joi.object({
    //     title: Joi.string(),
    //     price: Joi.number().min(0),
    //     image:Joi.string(),
    //     location: Joi.string(),
    //     description : Joi.string(),
    //     deleteImages:Joi.array()
    // });
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(e=>e.message).join(',')
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
};
module.exports.isAuthor = async(req,res,next)=>{
    const {id} = req.params;
    const campground= await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error',"you are not permitted!"); 
       return res.redirect(`/campgrounds/${id}`) ;
    }
    next();
}
module.exports.validateReview = (req,res,next)=>{
    // const reviewSchema = Joi.object({
    //     review : Joi.object({
    //         body: Joi.string().required(),
    //         rating:Joi.number().required()
    //     }).required()
    // });
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(e=>e.message).join(',')
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
};
module.exports.RAuthor = async(req,res,next)=>{
    const {id,reviewId} = req.params;
    const review= await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error',"you are not permitted!"); 
       return res.redirect(`/campgrounds/${id}`) ;
    }
    next();
}