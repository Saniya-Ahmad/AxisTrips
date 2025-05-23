const express = require("express");
const app= express();
const mongoose = require("mongoose");
const Listing= require('./models/listing.js')
const MONGO_URL= "mongodb://127.0.0.1:27017/axistrips";
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
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
app.get('/listings/:id', async (req, res) => {
    const { id } = req.params;
     const listing = await Listing.findById(id);
    console.log(id);
    //console.log(await Listing.findById(id));  

  res.render('listings/show', { listing });
});


//create route after new route
app.post('/listings', async(req,res)=>{
//  let{title,desc,image,price,country,location} = req.body
//or make listing object
const newListing= new Listing(req.body.listing);
await newListing.save();
res.redirect('/listings');
})
//edit route
app.get('/listings/:id/edit',async (req,res)=>{
    let{id}= req.params;
    const listing= await Listing.findById(id);
    res.render('listings/edit.ejs',{listing});
})
//update route
app.put('/listings/:id',async(req,res)=>{
let{id}= req.params;
await Listing.findByIdAndUpdate(id,{ ...req.body.listing });
res.redirect(`/listings/${id}`);
});

//delete route
app.delete('/listings/:id', async (req,res)=>{
    let {id} = req.params;
    let listing= await Listing.findByIdAndDelete(id);
    console.log(listing);
    res.redirect('/listings');
});

app.listen(8080,()=>{
console.log("server is listening to port 8080");
})
app.get('/', (req,res)=>{
    res.send("root directory");
})