const mongoose = require("mongoose");
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
    image: {
  filename: String,
  url: {
    type: String,
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGZjYKPjVrCS_uKmuUXIkYNXPA3x0q_Y-hYQ&s"
  }
}
,

    desc:String,
    price:Number,
    location:String,
    country:String,

})
const Listing = mongoose.model('Listing',listingSchema);
module.exports =Listing;