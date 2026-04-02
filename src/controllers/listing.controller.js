import {ApiError} from "../utils/ApiError.js";
import {wrapAsync} from "../utils/wrapAsync.js";
import {isValidObjectId} from "mongoose";
import {uploadOncloudinary} from "../utils/cloudinary.js";

import {Listing} from "../models/listing.model.js";


const getAllListings = wrapAsync (async (req,res)=>{

    const page = parseInt(req.query.page) || 1;
    const limit = 9 ;
    const skip = (page-1)*limit;

    const totalListings = await Listing.countDocuments();
    const totalPages = Math.ceil(totalListings/limit);
    const allListings = await Listing.find({}).skip(skip).limit(limit);
    return res.render("listings/index.ejs",{
        allListings,
        currentPage:page,
        totalPages,
        totalListings
    });
});

const renderNewListingForm = (req,res)=>{
    return res.render("listings/new.ejs");
};

const createListing = wrapAsync (async (req,res)=>{

    const {title,description ,price,location,country} = req.body;

    if([title,description,price,location,country].some((field)=>{
        return field.trim() ==="";
    })){
        req.flash("error","All fields required");
        return res.redirect("/listing/new-listing");
    };


    if(!price || isNaN(price)){
         req.flash("error", "Valid price required");
       return res.redirect("/listing/new-listing");
    }
    let imageUrlLocalPath;
    if(req.file){
        imageUrlLocalPath = req.file.path;
    }

    let imageUrl;
    if(imageUrlLocalPath){
        const uploadedImage = await uploadOncloudinary(imageUrlLocalPath);

        imageUrl = uploadedImage?.url;
    }

const listing = await Listing.create({
    title,
    description,
    price,
    location,
    country,
    image:imageUrl || "/images/unsplash-default-1.jpg",
    owner:req.user._id,
});

if(!listing){
    throw new ApiError(500,"listing creation failed!");
}

req.flash("success","Listing created successfully!")
  return res.redirect("/listing")

});

const showListing = wrapAsync (async (req,res)=>{
    const {listingId} = req.params;

    if(!isValidObjectId(listingId)){
        req.flash("error","invalid listingId");
        return res.redirect("/listing")
    }

    const listing = await Listing.findById(listingId).populate({path:"reviews",
        populate:{path:"owner"}
    })
    .populate("owner");

    if(!listing){
         req.flash("error","Listing you requested for does not exist!");
      return  res.redirect("/listing")
    }else{
        return res.render("listings/show.ejs",{listing});
    }


});

const renderUpdateListingForm = wrapAsync (async (req,res)=>{
    const {listingId} = req.params;
    if(!isValidObjectId(listingId)){
        req.flash("error","Invalid listingId");
        return res.redirect("/listing")
    }

    const listing = await Listing.findById(listingId);

    if(!listing){
        req.flash("error","Listing you reqursted for does not exist!");
        return res.redirect("/listing")
    }else{
        return res.render("listings/edit.ejs",{listing})
    }
});

const updateListing = wrapAsync (async (req,res)=>{
    const {listingId} = req.params;
    if(!isValidObjectId(listingId)){
           req.flash("error","Invalid listingId");
        return res.redirect("/listing")
    }

    
    const listing = await Listing.findById(listingId);
    if(!listing){
        req.flash("error","Listing not found!");
        return res.redirect("/listing");
    }

    if(!listing.owner.equals(req.user._id)){
        req.flash("error","Unauthrozied request");
        return res.redirect(`/listing/${listingId}`);
    }

    const {title,description,price,location,country} = req.body;

    if([title,description,location,country].some((field)=>{
        return field?.trim()==="";
    })){
        req.flash("error","All fields required");
        return res.redirect(`/listing/${listingId}/edit`);
    }

    if(!price || isNaN(price)){
         req.flash("error", "Valid price required");
        return res.redirect(`/listing/${listingId}/edit`);
    }


    let imageLocalPath;
    if(req.file){
        imageLocalPath = req.file.path;
    }
  let imageUrl;
  if(imageLocalPath){
    const uploadedImage = await uploadOncloudinary(imageLocalPath);
    imageUrl = uploadedImage?.url;
  }

  const updatedListing = await Listing.findByIdAndUpdate(listingId,{
    title,
    description,
    price,
    location,
    country,
    ...(imageUrl && {image:imageUrl}),
  },{
    new:true,runValidators:true
  });


  req.flash("success","Listing updated successfully!");
  return res.redirect(`/listing/${updatedListing._id}`);
});

const deleteListing = wrapAsync (async (req,res)=>{
    const {listingId} = req.params;
    if(!isValidObjectId(listingId)){
        req.flash("error", "Invalid listingId");
        return res.redirect("/listing");
    }

    const  listing = await Listing.findById(listingId);
    if(!listing){
        req.flash("error", "Listing not found!");
        return res.redirect("/listing");
    }

    if(!listing.owner.equals(req.user._id)){
        req.flash("error", "Unauthorized request");
        return res.redirect(`/listing/${listingId}`);

    }

    await Listing.findByIdAndDelete(listingId);

    req.flash("success", "Listing deleted successfully!");
    return res.redirect("/listing");
});
export {
    getAllListings,
    renderNewListingForm,
    createListing,
     showListing,
renderUpdateListingForm,
updateListing,
deleteListing
}