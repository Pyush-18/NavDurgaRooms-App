import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    regularPrice:{
        type: Number,
        required: true
    },
    discountPrice:{
        type: Number,
        required: true
    },
    noOfBathrooms:{
        type: Number,
        required: true
    },
    noOfBedrooms:{
        type: Number,
        required: true
    },
    furnished:{
        type: Boolean,
        required: true
    },
    parking:{
        type: Boolean,
        required: true,
    },
    type:{
        type: String,
        enum: ["rent", "sale"],
        required: true
    },
    offer:{
        type: Boolean,
        required: true,
    },
    images:[{
        type: String,
        required: true,
    }],
    userId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{timestamps: true})

export const Listing = mongoose.model("Listing", listingSchema)