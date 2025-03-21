import axios from "axios";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { LISTING_API_ENDPOINT } from "../Api/api_endpoint";
import { useDispatch, useSelector } from "react-redux";
import { setSingleListing } from "../redux/user/listingSlice";
import toast from "react-hot-toast";
import { MapPin } from "lucide-react";
import Contact from "./Contact";

function SingleListing() {
  const { listingId } = useParams();
  const dispatch = useDispatch();
  const { singleListing } = useSelector((store) => store.listing);
  const {authUser} = useSelector((store) => store.user)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(
          `${LISTING_API_ENDPOINT}/get/${listingId}`,
          { withCredentials: true }
        );
        if (response?.data?.success) {
          dispatch(setSingleListing(response?.data?.info));
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    };
    fetchListing();
  }, []);
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold">{singleListing?.name}</h1>
      <div className="flex mt-2 gap-2 text-gray-600">
        <MapPin className="text-green-400" size={24} />
        <p>{singleListing?.address}</p>
      </div>

      
      <div className="carousel mt-4">
        {singleListing?.images?.length > 0 &&
          singleListing?.images?.map((image, id) => (
            <div id={`slide${id}`} key={id} className="carousel-item relative w-full">
              <img
                className="w-full h-[400px] object-cover rounded-lg"
                src={image || "/default_hotel_img.png"}
                alt="images"
              />
              <div className="absolute left-3 right-3 top-1/2 flex -translate-y-1/2 transform justify-between ">
                <a href={`#slide${id === 0 ? singleListing?.images?.length - 1 : id -1}`} className="btn btn-circle">❮</a>
                <a href={`#slide${id === singleListing?.images?.length-1 ? 0 : id + 1}`} className="btn btn-circle">❯</a>
              </div>
            </div>
          ))}
      </div>

        <p className="mt-3">
          <strong>description : </strong>
          {singleListing?.description}
        </p>
      <div className="mt-6 flex flex-wrap gap-4 items-center  text-gray-300">
        <p className="badge badge-secondary p-4">
          <strong>Price:</strong> ₹{' '}
          {singleListing?.discountPrice || singleListing?.regularPrice}
        </p>
        <p className="badge badge-primary p-4">
          <strong>Type:</strong>{" "}
          {singleListing?.type === "rent" ? "For Rent" : "For Sale"}
        </p>
        <p className="badge badge-primary p-4">
          <strong>Bedrooms:</strong> {singleListing?.noOfBedrooms}
        </p>
        <p className="badge badge-primary p-4">
          <strong>Bathrooms:</strong> {singleListing?.noOfBathrooms}
        </p>
        <p className="badge badge-success p-4">
          <strong>Furnished:</strong> {singleListing?.furnished ? "Yes" : "No"}
        </p>
        <p className="badge badge-info p-4">
          <strong>Parking:</strong>{" "}
          {singleListing?.parking ? "Available" : "Not Available"}
        </p>
      </div>
      
      {
        authUser?._id !== singleListing?.userId &&
        <Contact listing={singleListing}/>
      }
    </div>
  );
}

export default SingleListing;
