import {Review} from "../models/review.model.js";
import {Listing} from "../models/listing.model.js";
import { isValidObjectId } from "mongoose";
import { wrapAsync } from "../utils/wrapAsync.js";


const createReview = wrapAsync (async (req,res)=>{
    const {listingId} = req.params;
    const {comment,rating} = req.body;
if(!isValidObjectId(listingId)){
    req.flash("error","invalid listingId");
    return res.redirect("/listing");
}

const listing = await Listing.findById(listingId);
if(!listing){
    req.flash("error","listing not found");
    return res.redirect("/listing")
}

if(!comment.trim()){
    req.flash("error","comment required");
    return res.redirect(`/listing/${listingId}`);
}

if(!rating || isNaN(rating) || rating<1 || rating>5){
    req.flash("error", "Valid rating required (1-5)!");
        return res.redirect(`/listing/${listingId}`);
}

const review = await Review.create({
    comment,
    rating,
    owner:req.user._id,
});

listing.reviews.push(review._id);
await listing.save();
req.flash("success","Review added successfully");
return res.redirect(`/listing/${listingId}`);
});

const deleteReview = wrapAsync (async (req,res)=>{
    const {listingId,reviewId} = req.params;
    if(!isValidObjectId(listingId) || !isValidObjectId(reviewId)){
    req.flash("error","invalid listingId");
    return res.redirect("/listing");
}


const review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listing/${listingId}`);
    }

    if(!review.owner.equals(req.user._id)){
        req.flash("error", "Unauthorized request");
        return res.redirect(`/listing/${listingId}`);
    }
  await Listing.findByIdAndUpdate(listingId,{
    $pull:{reviews:reviewId}
  });

  await Review.findByIdAndDelete(reviewId);
req.flash("success", "Review deleted successfully!");
    return res.redirect(`/listing/${listingId}`);

});

export {
    createReview,
    deleteReview
}

