
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import path from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import {ApiError} from "./utils/ApiError.js";
import userRouter from "./routes/user.route.js";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.engine('ejs',ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname, "../views"));
app.use(express.static(path.resolve('../public')));
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    store:MongoStore.create({
        mongoUrl:process.env.MONGO_URL
    }),
    cookie:{
        maxAge:1000*60*60*24*2,
        httpOnly:true,
        secure:false
    }
}));
app.use(flash());
app.use(express.urlencoded({extended:false}));
app.use((req,res,next)=>{
    res.locals.messages ={
        error:req.flash("error"),
        success:req.flash("success")
    };
   next();
});
app.use(methodOverride('_method'));



app.get("/",(req,res)=>{
    res.send("HI")
});

app.use("/user",userRouter);



app.use((req, res, next) => {
  next(new ApiError(404, "Page not found!"));
});
app.use(errorMiddleware);
export {app};