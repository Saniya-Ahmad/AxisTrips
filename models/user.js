const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    
   email: {
        type: String,
        required: true,  
       
    },   
});
userSchema.plugin(passportLocalMongoose);//add USERNAME PASSWORD HASHING SALTING AUTOMATICALLY SOME METHODS ALSO 
module.exports= mongoose.model("User", userSchema);