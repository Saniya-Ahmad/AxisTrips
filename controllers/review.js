const Listing= require('../models/listing');
const {listingSchema, reviewSchema} = require("../schema.js")
const Review = require('../models/review.js');
module.exports.createReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review); /// extracting from form body 
    newReview= new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview); //pushing in review array of listing model

    await newReview.save();
    await listing.save();
    console.log("new Review saved");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview=async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`)
}