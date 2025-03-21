import { Router } from "express";
import { createListing, getListing, deleteListingById, getAllListing, getListingById, updateListingById } from "../controllers/listing.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/create")
  .post(verifyJWT, upload.fields(
    [
        {
            name: "images",
            maxCount: 5
        }
    ]
  ), createListing);

  router.route("/all").get(verifyJWT, getAllListing)
  router.route("/get/:listingId").get(verifyJWT, getListingById)
  router.route("/delete/:listingId").delete(verifyJWT, deleteListingById)
  router.route("/update/:listingId").put(verifyJWT, updateListingById)
  router.route("/get").get(getListing)

export default router;
