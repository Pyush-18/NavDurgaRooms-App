import { Router } from "express";
import { getUserById, googleAuth, loginUser, logoutUser, registerUser, updateProfile } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get( verifyJWT ,logoutUser)
router.route("/google").post(googleAuth)
router.route("/update-profile").post( verifyJWT , upload.single("avatar")  ,updateProfile)
router.route("/:userId").get( verifyJWT , getUserById)
export default router