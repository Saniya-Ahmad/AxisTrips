const mongoose = require("mongoose");
let {Schema }= mongoose;
const Review = require('./review.js');
const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
    },
    // image:{
    //     type:String,
    //     default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGZjYKPjVrCS_uKmuUXIkYNXPA3x0q_Y-hYQ&s"
    //       ,  //not given in backend
    //     set :(v)=> v===""?
    //     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGZjYKPjVrCS_uKmuUXIkYNXPA3x0q_Y-hYQ&s" 
    //     // not available in frontend
    //     : v,
    // },

    desc:String,
    image: {
  filename: String,
  url: {
    type: String,
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGZjYKPjVrCS_uKmuUXIkYNXPA3x0q_Y-hYQ&s"
  }
}
,


    price:Number,
    location:String,
    country:String,
    reviews:[{
      type:Schema.Types.ObjectId,
      ref : "Review"
    }]

})
//middleware
listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
 await Review.deleteMany({_id : {reviews:{ $in: listing.reviews}}})
  }
 
})
const Listing = mongoose.model('Listing',listingSchema);
module.exports =Listing;