import { IndianRupee, Locate } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

function ListingItem({ listing }) {
  const navigate = useNavigate();
  const handleNavigate = (id) => {
    navigate(`/listing/${id}`);
  };
  return (
    <div
      onClick={() => handleNavigate(listing?._id)}
      className="card bg-base-100 min-w-80 shadow-sm hover:shadow-purple-500"
    >
      <figure>
        <img
          className="md:w-[400px] object-cover md:h-[200px] w-full h-[200px] hover:scale-120 transition-all duration-200 delay-75"
          src={listing?.images[0] || "/default_hotel_img.png"}
          alt="image"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title truncate">{listing?.name}</h2>
        <div className="flex gap-3 items-center">
          <Locate size={20} className="text-green-500" />
          <p className="text-sm font-semibold truncate">{listing?.address}</p>
        </div>
        <p className="text-sm truncate">{listing?.description}</p>
        <div className="text-black font-semibold mt-2">
          <button className="badge badge-success flex items-center gap-1">
            Price : <IndianRupee size={15} />
            <span> {listing?.offer ? listing?.discountPrice?.toLocaleString("en-IN") : listing?.regularPrice.toLocaleString("en-IN")}
              {
                listing?.type === "rent" && " / month"
              } </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListingItem;
