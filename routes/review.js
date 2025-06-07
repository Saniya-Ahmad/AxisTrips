const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const { listingSchema, reviewSchema } = require("../schema.js")
const ExpressError = require('../utils/ExpressError.js');
const Review = require('../models/review.js')
const Listing = require('../models/listing.js')
const mongoose = require('mongoose');
const {isLoggedIn,isreviewAuthor}=require('../middleware.js');
const reviewController = require('../controllers/review.js')
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
router.post('/',isLoggedIn, validateReview, wrapAsync(reviewController.createReview))
//delete review route
router.delete("/:reviewId",isLoggedIn,isreviewAuthor,wrapAsync(reviewController.deleteReview))


module.exports = router;