const express = require("express");
const app= express();
const mongoose = require("mongoose");
const Listing= require('./models/listing.js')
const MONGO_URL= "mongodb://127.0.0.1:27017/axistrips";
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}


app.get('/testListing',async (req,res)=>{
    let sampleListing = new Listing({
        title:"New Villa",
        image: {filename: "listingimage",
      url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",},
        desc:"By the beach",
        price:12000,
        location:'Goa',
        country:"India",

    })
    await sampleListing.save();
    console.log(sampleListing);
    res.send("Successfull");

})


app.get('/', (req,res)=>{
    res.send("HI. i am root");
})

app.listen(8080,()=>{
console.log("server is listening to port 8080");
})
