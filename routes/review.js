const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const { listingSchema, reviewSchema } = require("../schema.js")
const ExpressError = require('../utils/ExpressError.js');
const Review = require('../models/review.js')
const Listing = require('../models/listing.js')
const mongoose = require('mongoose');
const {isLoggedIn,isreviewAuthor}=require('../middleware.js');
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(400, error);
    } else {
        next();

    }
}

//review post route
router.post('/',isLoggedIn, validateReview, wrapAsync(async (req, res) => {
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
}))
//delete review route
router.delete("/:reviewId",isLoggedIn,isreviewAuthor,wrapAsync(async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`)
}))


module.exports = router;