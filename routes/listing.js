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
const {isLoggedIn,isOwner}= require('../middleware.js')

const listingController = require('../controllers/listing.js')
const multer  = require('multer')

const {storage} = require('../cloudConfig.js')
const upload = multer({storage})



const validateListing = (req, res, next) => {
  let{error}= listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(', ');
    throw new ExpressError(400, error);
}else{next();
};
}
router
.route('/')
.get(wrapAsync(listingController.index))
.post(  isLoggedIn,
  
  upload.single("listing[image][url]"),
  validateListing,
  wrapAsync(listingController.createListing)
);
// .post(upload.single("listing[image][url]"),(req,res)=>{
//   res.send(req.file);
// })


// router.route('/:id')
// .get(isLoggedIn, wrapAsync(listingController.showListing))
// .put(isLoggedIn,isOwner,wrapAsync(listingController.updateListing))
// .delete
//index route
//router.get('/',wrapAsync(listingController.index));
//new route should be above the show route otherwise error 
router.get('/new',isLoggedIn,(listingController.renderNewForm));
router.get('/country',(listingController.searchListings));

router.get('/listings/country/:country',(listingController.showsearchListings))


//show route
router.get('/:id',isLoggedIn, wrapAsync(listingController.showListing));
//create route
//router.post('/', isLoggedIn,validateListing, wrapAsync(listingController.createListing));
//edit route
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.editListing));
//update route
router.put('/:id',
  isLoggedIn,
  isOwner,
  upload.single("listing[image][url]"),
  validateListing,
  wrapAsync(listingController.updateListing));
//delete route
router.delete('/:id',isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));
module.exports= router;