import { User } from "../models/user.model.js";
import { wrapAsync } from "../utils/wrapAsync.js";

const isLoggedIn = wrapAsync( async (req,res, next)=>{
    if(!req.session.userId){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","login please!");
        return res.redirect("/user/login");
    }


    const user = await User.findById(req.session.userId);
    if(!user){
        req.flash("error","user not found");
        return res.redirect("/user/login");
    }

    res.locals.currentUser = user;
    req.user = user;
    next();
});


const saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
}

export { isLoggedIn,saveRedirectUrl};