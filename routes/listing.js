const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const {listingSchema, reviewSchema} = require("../schema.js")
const ExpressError = require('../utils/ExpressError.js');
const Listing= require('../models/listing.js')
const Review = require('../models/review.js');
const flash= require('connect-flash');
const passport= require('passport');
const LocalStrategy= require('passport-local')
const {isLoggedIn}= require('../middleware.js')


const validateListing = (req, res, next) => {
  let{error}= listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(', ');
    throw new ExpressError(400, error);
}else{next();
};
}


//index route
router.get('/',async (req,res)=>{
    const allListings= await Listing.find({});

    res.render("listings/index",{allListings});

});
//show route
// router.get('/listings/:id',async (req,res)=>{
//     let {id} = req.params;
//   //  const listing = await Listing.findById(id);
//     console.log(await Listing.findById(id));
//     //res.render('listings/show', {listing});
// });


//new route should be above the show route otherwise error 
router.get('/new',isLoggedIn,(req,res)=>{
 
    res.render('listings/new.ejs')
});

//show route
router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
     const listing = await Listing.findById(id).populate("reviews");
    console.log(id);
  
    console.log(await Listing.findById(id));  
    if(!listing){
      req.flash("error", "Listing requested doesnot exists!");
      return res.redirect('/listings');
    }

  res.render('listings/show', { listing });
})
)

router.post('/', validateListing, wrapAsync(async (req, res) => {
    const { listing } = req.body;

    if (!listing) {
        throw new ExpressError(400, 'Send valid data for listing');
    }

    const newListing = new Listing(listing);
    await newListing.save();
    console.log('Listing created:', newListing);
    req.flash('success', 'New listing created successfully!');
    res.redirect('/listings');
}));


//edit route
router.get('/:id/edit',isLoggedIn,wrapAsync(async (req,res)=>{
    let{id}= req.params;
    const listing= await Listing.findById(id);
     if(!listing){
      req.flash("error", "Listing requested doesnot exists!");
      res.redirect('/listings');
    }

    res.render('listings/edit.ejs',{listing});
})
)
//update route
router.put('/:id',isLoggedIn,wrapAsync(async(req,res)=>{
let{id}= req.params;
await Listing.findByIdAndUpdate(id,{ ...req.body.listing });
res.redirect(`/listings/${id}`);
})
)



router.delete('/:id',isLoggedIn, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    throw new ExpressError(404, 'Listing not found');
  }

  if (listing.reviews && listing.reviews.length > 0) {
   
    const reviewIds = listing.reviews.map(r => r._id ? r._id.toString() : r.toString());
    await Review.deleteMany({ _id: { $in: reviewIds } });
  }

  await Listing.findByIdAndDelete(id);
  req.flash('success', 'Listing Deleted!');
  res.redirect('/listings');
}));
module.exports= router;