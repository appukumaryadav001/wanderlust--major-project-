import {Router} from "express";
const router = Router({mergeParams:true});
import {isLoggedIn} from "../middlewares/auth.middleware.js";
import {createReview,deleteReview} from "../controllers/review.controller.js";


router.route("/")
       .post(isLoggedIn,createReview)
 router.route("/:reviewId").delete(isLoggedIn,deleteReview);

export default router;