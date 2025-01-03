const Campground = require('../models/campground');
const Review = require('../models/reviews');
module.exports.createReview = async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    await review.save();
    campground.reviews.push(review);
    await campground.save();
    req.flash('success',"success!");
    res.redirect(`/campgrounds/${campground.id}`);
}
module.exports.deleteReview = async(req,res)=>{
    const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews : reviewId }});
    await Review.findByIdAndDelete(req.reviewId);
    req.flash('success',"successfully deleted!");
    res.redirect(`/campgrounds/${id}`);
};