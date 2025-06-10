if(process.env.NODE_ENV !='production'){
require('dotenv').config();
}

console.log(process.env.SECRET)

const express = require("express");
const app= express();
const mongoose = require("mongoose");
const Listing= require('./models/listing.js');
 //const MONGO_URL= "mongodb://127.0.0.1:27017/axistrips";
const dbUrl= process.env.ATLASDB_URL;
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const {listingSchema, reviewSchema} = require("./schema.js");
const Review= require('./models/review.js');
const listings = require('./routes/listing.js');
const reviews = require('./routes/review.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash= require('connect-flash');
const passport= require('passport');
const LocalStrategy= require('passport-local')
const User = require('./models/user.js');
const userRouter = require('./routes/user.js');
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})
const path = require("path");
const review = require("./models/review.js");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

async function main(){
    await mongoose.connect(dbUrl);
     
}

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*60*60,
})
store.on('error',()=>{
    console.log('Error in Mongo Session Store',err)
})
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000, //aaj se ek hafte baad tk 
        maxAge:7*24*60*60*1000,
        httpOnly:true  //to avoid cross scripting attacks
    }

}

app.use(session(sessionOptions))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session()); //baar baar login na krna pade
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());       // to store user id in session
passport.deserializeUser(User.deserializeUser());   // to get user details from id stored in session

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user; // cannot directly use it in navbar.ejs
    next();
})

// app.get("/demoUser", async(req,res)=>{
//     let fakeUser = new User({
//         email:"st@gmail.com",
//         username:"st",
//     })
//    let regUser= await User.register(fakeUser, 'helloWorld')
// //    console.log(regUser);
//     res.send(regUser);
// });




//express Router
app.use('/listings', listings)
app.use('/listings/:id/reviews', reviews)
app.use('/', userRouter);

// app.get('/', (req,res)=>{
//     res.send("root directory");
// })

////////////////////////////////


///////////////////////////////////////
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



