import React, { useEffect, useState } from "react";
import axios from "axios";
import ListingItem from "../components/ListingItem";
import { LISTING_API_ENDPOINT } from "../Api/api_endpoint";
import { Link } from "react-router-dom";
function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const response = await axios.get(
          `${LISTING_API_ENDPOINT}/get?offer=true&limit=4`
        );
        setOfferListings(response?.data?.info);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSaleListings = async () => {
      try {
        const response = await axios.get(
          `${LISTING_API_ENDPOINT}/get?type=sale&limit=4`
        );
        setSaleListings(response?.data?.info);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const response = await axios.get(
          `${LISTING_API_ENDPOINT}/get?type=rent&limit=4`
        );
        setRentListings(response?.data?.info);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);
  return (
    <div>
      {/* top side */}
      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl lg:text-6xl font-bold bg-gradient-to-r from-orange-700 to-white text-transparent bg-clip-text">
          Find your next perfect
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Navdurga Rooms is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          className="text-xs sm:text-sm text-blue-600 font-bold hover:underline"
          to="/search"
        >
          Let's get started...
        </Link>
      </div>
 

      {/* lsitings */}
      <div className="max-w-6xl flex flex-col mx-auto p-3 gap-8 my-10">
        {offerListings && offerListings?.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold lg:text-4xl bg-gradient-to-br from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Recent Offers
              </h2>
              <Link
                className="text-blue-600 hover:underline font-medium text-sm"
                to="/search?offer=true"
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-col lg:flex-row lg:max-w-[300px] gap-4">
              {offerListings?.map((listing) => (
                <ListingItem key={listing?._id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {saleListings && saleListings?.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold lg:text-4xl bg-gradient-to-br from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Recent places for sale
              </h2>
              <Link
                className="text-blue-600 hover:underline font-medium text-sm"
                to="/search?type=sale"
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-col lg:flex-row lg:max-w-[300px] gap-4">
              {saleListings?.map((listing) => (
                <ListingItem key={listing?._id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {rentListings && rentListings?.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold lg:text-4xl bg-gradient-to-br from-purple-500 to-pink-500 text-transparent bg-clip-text">
                Recent places for rent
              </h2>
              <Link
                className="text-blue-600 hover:underline font-medium text-sm"
                to="/search?type=rent"
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 lg:max-w-[300px]">
              {rentListings?.map((listing) => (
                <ListingItem key={listing?._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
