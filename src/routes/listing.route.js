import {Router} from "express";
import {
    getAllListings,
    renderNewListingForm,
    createListing,
    showListing,
    renderUpdateListingForm,
    updateListing,
    deleteListing
} from "../controllers/listing.controller.js";

import {upload} from "../middlewares/multer.middleware.js";
import {isLoggedIn} from "../middlewares/auth.middleware.js";


const router = Router();


router.route("/")
     .get(getAllListings)
     .post(isLoggedIn,upload.single("image"),createListing);


router.route("/new-listing")
      .get(isLoggedIn,renderNewListingForm)

router.route("/:listingId")
      .get(showListing)
      .put(isLoggedIn,upload.single("image"),updateListing)
      .delete(isLoggedIn,deleteListing);

router.route("/:listingId/edit")
      .get(isLoggedIn,renderUpdateListingForm)


export default router;
