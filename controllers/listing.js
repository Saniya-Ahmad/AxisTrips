const Listing= require('../models/listing');
const {listingSchema, reviewSchema} = require("../schema.js")
const Review = require('../models/review.js');
module.exports.index=async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index",{allListings});
}
module.exports.renderNewForm=(req,res)=>{
 
    res.render('listings/new.ejs')
}
module.exports.showListing=async (req, res) => {
    const { id } = req.params;
     const listing = await Listing.findById(id)
     .populate({
      path:"reviews",
      populate:{
        path:'author',
      },
     })
     .populate('owner');    //new added 
    console.log(id);
    
    console.log(await Listing.findById(id));  
    if(!listing){
      req.flash("error", "Listing requested doesnot exists!");
      return res.redirect('/listings');
    }
    console.log(listing);
  res.render('listings/show', { listing });
}
module.exports.createListing=async (req, res) => {
      let url= req.file.path;
      let filename= req.file.filename;
      console.log(url+".."+filename )
    const { listing } = req.body;

    if (!listing) {
        throw new ExpressError(400, 'Send valid data for listing');
    }

    const newListing = new Listing(listing);
    newListing.owner = req.user._id; //assosiate owner with new id 
    newListing.image= {url,filename};
    await newListing.save();
    console.log('Listing created:', newListing);
    req.flash('success', 'New listing created successfully!');
    res.redirect('/listings');
}
module.exports.editListing=async (req,res)=>{
    let{id}= req.params;
    const listing= await Listing.findById(id);
     if(!listing){
      req.flash("error", "Listing requested doesnot exists!");
      res.redirect('/listings');
    }
    let originalImageUrl= listing.image.url;
     originalImageUrl= originalImageUrl.replace('/upload',"/upload/w_250");

    res.render('listings/edit.ejs',{listing,originalImageUrl});
}
module.exports.updateListing=async(req,res)=>{
let{id}= req.params;
let listing = await Listing.findByIdAndUpdate(id,{ ...req.body.listing });

      if(typeof(req.file) !== "undefined"){
      let url= req.file.path;
      let filename= req.file.filename;
      listing.image= {url,filename};
      await listing.save();
      }

      
res.redirect(`/listings/${id}`);
}
module.exports.deleteListing=async (req, res) => {
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
}