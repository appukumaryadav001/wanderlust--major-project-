import {ApiError} from "../utils/ApiError.js";
import {wrapAsync} from "../utils/wrapAsync.js";
import {User} from "../models/user.model.js";
import {uploadOncloudinary} from "../utils/cloudinary.js";
const getSignup = (req,res)=>{
   return  res.render("users/signup.ejs");
};

const signup = wrapAsync (async (req,res)=>{
      const {username,email,password} = req.body;

    if([username,email, password].some((field)=>{
        return field?.trim()==="";
    })){
        req.flash("error","All fields required");
        return res.redirect("/user/signup");
    }

    const existUser = await User.findOne({email});

    if(existUser){
         req.flash("error","User already exists");
       return res.redirect("/user/signup");
    }

    let avatarLocalPath;
    if(req.file){
        avatarLocalPath = req.file.path;
    }

    let avatarUrl;
    if(avatarLocalPath){
        const uploadedAvatar = await uploadOncloudinary(avatarLocalPath);
        avatarUrl = uploadedAvatar?.url;
    }

    const user = await User.create({
        username,
        email,
        password,
        avatar:avatarUrl || "/images/default-avatar.png",
    });
     if(!user){
    throw new ApiError(500, "User creation failed!");
    }
    
    req.session.userId = user._id;
    req.flash("success","Welcome " + user.username + "!")
    req.session.save((err) => {
        if (err) return res.redirect("/user/signup");
        return res.redirect("/listing");
    });
});

const getLogin = (req,res)=>{
   return res.render("users/login.ejs")
};

const login = wrapAsync( async (req,res)=>{
    const {email,password} = req.body;

    if([email,password].some((field)=>{
        return field?.trim()==="";
    })){
          req.flash("error", "All fields required");
        return res.redirect("/user/login");
    }

    const user = await User.findOne({email});
    if(!user){
         req.flash("error", "Invalid email or password");
        return res.redirect("/user/login");
    }

    const isCorrect = await user.isPasswordCorrect(password);
    if(!isCorrect){
         req.flash("error", "Invalid email or password");
        return res.redirect("/user/login");
    }
    req.session.userId = user._id;
     req.flash("success", "Welcome back " + user.username + "!");
     req.session.save((err) => {
        if (err) return res.redirect("/user/login");
        return res.redirect("/listing");
    });
});

const logout = (req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            req.flash("error", "Logout failed");
            return res.redirect("/listing");
        }

        res.clearCookie("connect.sid");
        return res.redirect("/listing");
    });
};

export {
    getSignup,
    signup,
    getLogin,
    login,
    logout
};