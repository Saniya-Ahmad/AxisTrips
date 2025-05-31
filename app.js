const express = require("express");
const app= express();
const mongoose = require("mongoose");
const Listing= require('./models/listing.js')
const MONGO_URL= "mongodb://127.0.0.1:27017/axistrips";
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const {listingSchema, reviewSchema} = require("./schema.js")
const Review= require('./models/review.js')
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));
async function main(){
    await mongoose.connect(MONGO_URL);
}


// app.get('/testListing',async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"New Villa",
//         image: {filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",},
//         desc:"By the beach",
//         price:12000,
//         location:'Goa',
//         country:"India",

//     })
//     await sampleListing.save();
//     console.log(sampleListing);
//     res.send("Successfull");

// })

const validateListing=(req,res,next)=>{
    let{error}= listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(', ');
    throw new ExpressError(400, error);
}else{next();

}
}
const validateReview=(req,res,next)=>{
    let{error}= reviewSchema.validate(req.body);
    if(error){
        let errMsg =  error.details.map(el => el.message).join(', ');
    throw new ExpressError(400, error);
}else{
    next();

}
}

//index route
app.get('/listings',async (req,res)=>{
    const allListings= await Listing.find({});

    res.render("listings/index",{allListings});

});
//show route
// app.get('/listings/:id',async (req,res)=>{
//     let {id} = req.params;
//   //  const listing = await Listing.findById(id);
//     console.log(await Listing.findById(id));
//     //res.render('listings/show', {listing});
// });


//new route should be above the show route otherwise error 
app.get('/listings/new',(req,res)=>{
    res.render('listings/new.ejs')
});

//show route
app.get('/listings/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
     const listing = await Listing.findById(id).populate("reviews");
    console.log(id);
    //console.log(await Listing.findById(id));  

  res.render('listings/show', { listing });
})
)

//create route after new route
app.post('/listings', wrapAsync(async(req,res)=>{
    //joi
let result=listingSchema.validate(req.body);
 console.log(result);
// if(result.error){
//     throw new ExpressError(400, result.error);
// }

//  let{title,desc,image,price,country,location} = req.body
//or make listing object
// if(!req.body.listing){
//     throw new ExpressError(400,'Send valid data for listing');
// }


const newListing= new Listing(req.body.listing);
// if(!newListing.title){
//     throw new ExpressError(400,'Title is missing');
// }
// if(!newListing.desc){
//     throw new ExpressError(400,'desc is missing');
// }
// if(!newListing.location){
//     throw new ExpressError(400,'Location is missing');
// }
await newListing.save();
res.redirect('/listings');

})
)
//edit route
app.get('/listings/:id/edit',wrapAsync(async (req,res)=>{
    let{id}= req.params;
    const listing= await Listing.findById(id);
    res.render('listings/edit.ejs',{listing});
})
)
//update route
app.put('/listings/:id',wrapAsync(async(req,res)=>{
let{id}= req.params;
await Listing.findByIdAndUpdate(id,{ ...req.body.listing });
res.redirect(`/listings/${id}`);
})
)

//delete route
app.delete('/listings/:id', wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing= await Listing.findByIdAndDelete(id);
    console.log(listing);
    res.redirect('/listings');
})
)

app.listen(8080,()=>{
console.log("server is listening to port 8080");
})

//* for all other pages except upper ones

// app.all('*', (req,res,next)=>{
//     next(new ExpressError(404,'Page not Found!'))
// })

//middle ware for server side error handling
app.use((err,req,res,next)=>{
   let{statusCode=500, message="Something went wrong"}= err;
  res.render('error.ejs',{message})
// res.send("something went wrong!")
});
// app.use((err, req, res, next) => {
//     const { statusCode = 500, message = "Something went wrong" } = err;
//     res.status(statusCode).send(message);
// });


//review post route
app.post('/listings/:id/reviews', validateReview,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review); /// extracting from form body 

    listing.reviews.push(newReview); //pushing in review array of listing model

    await newReview.save();
    await listing.save();
    console.log("new Review saved"); 
    res.redirect(`/listings/${listing._id}`);
}))

app.get('/', (req,res)=>{
    res.send("root directory");
})
