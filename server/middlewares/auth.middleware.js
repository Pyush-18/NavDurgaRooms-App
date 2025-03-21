import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken"


export const verifyJWT = asyncHandler(async(req, _ ,next) => {
    try {
        const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
        const decode = jwt.verify(token,  process.env.TOKEN_SECRET)
        const user = await User.findById(decode?._id)
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401,  error?.message || "Invalid token" )
    }
})