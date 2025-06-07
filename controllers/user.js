const User= require('../models/user');
module.exports.signup=async(req,res)=>{
    try{
        let{username,email,password}= req.body;
        const newUser= new User({email,username});
        const regUser= await User.register(newUser,password)
        console.log(regUser);
        req.login(regUser,(err)=>{  //when signup automatically login no nedd to agin login
            if(err){
                return next(err);
            }
        req.flash('success','Welcome to AxisTrips');
        res.redirect('/listings');
     
        })
      
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/signup');
    }
}
module.exports.login=async (req,res)=>{
    req.flash("success",'Welcome to AxisTrips, You are logged in successfully!');
    let redirectUrl= res.locals.redirectUrl || '/listings'  // so that home page pr error naa aaye
    res.redirect(redirectUrl);
    //res.redirect('/listings');  //we want jis address pr jaane ke baad lpin page aaya if we login then fir usi page pr jaaye jese 
    //                      edit pr loggin req and when we login then we go to /listings/id/edit page only for this check middleware.js

}
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{ // by default given by passpot package
        if(err){
           return next(err);
        }
        req.flash('success','you are logged out!');
        res.redirect('/listings');
    })
}