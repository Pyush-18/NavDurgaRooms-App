import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LISTING_API_ENDPOINT } from "../Api/api_endpoint";
import axios from "axios";
import ListingItem from "../components/ListingItem";
import { Loader2 } from "lucide-react";

function SearchPage() {
  const [input, setInput] = useState({
    searchTerm: "",
    type: "",
    offer: false,
    parking: false,
    furnished: false,
    sort: "createdAt",
    order: "desc",
  });
  const [listings, setListings] = useState([]);
  const [loader, setLoader] = useState(false);
  const [showMore, setShowMore] = useState(false)

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const offerFromUrl = urlParams.get("offer");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      offerFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setInput({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "",
        offer: offerFromUrl === "true",
        parking: parkingFromUrl === "true",
        furnished: furnishedFromUrl === "true",
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      const searchQuery = urlParams.toString();
      try {
        setLoader(true)
        const response = await axios.get(
          `${LISTING_API_ENDPOINT}/get?${searchQuery}`
        );
        setListings(response?.data?.info);
        if(response?.data?.info.length > 8){
          setShowMore(true)
        }else{
          setShowMore(false)
        }
      } catch (error) {
        console.error(error);
      }finally{
        setLoader(false)
      }
    };
    fetchListings();
  }, [location?.search]);


  const showMoreData = async() => {
    const listingLength = listings?.length
    let startIndex = listingLength
    const urlParam = new URLSearchParams(location.search)
    urlParam.set("startIndex", startIndex)
    const searchQuery = urlParam.toString()
    const response = await axios.get(
      `${LISTING_API_ENDPOINT}/get?${searchQuery}`
    );

    if(response?.data?.info?.length < 9){
      setShowMore(false)
    }
    setListings([...listings, ...response?.data?.info])
  }

  const handleSelect = (e) => {
    if (e.target.name === "sort_order") {
      const [sort, order] = e.target.value.split("_");
      setInput({ ...input, sort: sort || "createdAt", order: order || "desc" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParam = new URLSearchParams();
    urlParam.set("searchTerm", input.searchTerm);
    urlParam.set("type", input.type);
    urlParam.set("offer", input.offer.toString());
    urlParam.set("parking", input.parking.toString());
    urlParam.set("furnished", input.furnished.toString());
    urlParam.set("sort", input.sort);
    urlParam.set("order", input.order);

    const searchQuery = urlParam.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* left */}
      <div className="p-7 hidden md:block md:min-h-screen border-slate-600 md:border-r">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          <div className="flex items-center gap-4">
            <span className="">Search Term: </span>
            <input
              name="searchTerm"
              type="text"
              placeholder="Type here"
              className="input"
              value={input.searchTerm}
              onChange={(e) =>
                setInput({ ...input, searchTerm: e.target.value })
              }
            />
          </div>
          <div className="flex gap-4 items-center">
            <span>Type: </span>
            <label className="flex items-center gap-2" htmlFor="rent">
              <input
                type="radio"
                id="rent"
                value="rent"
                checked={input.type === "rent"}
                onChange={(e) => setInput({ ...input, type: e.target.value })}
                name="radio-2"
                className="radio radio-md"
              />
              Rent
            </label>
            <label className="flex items-center gap-2" htmlFor="sale">
              <input
                type="radio"
                checked={input.type === "sale"}
                value="sale"
                id="sale"
                onChange={(e) => setInput({ ...input, type: e.target.value })}
                name="radio-2"
                className="radio radio-md"
              />
              Sale
            </label>
            <label className="flex items-center gap-2" htmlFor="offer">
              <input
                type="checkbox"
                checked={input.offer}
                onChange={(e) =>
                  setInput({ ...input, offer: e.target.checked })
                }
                id="offer"
                className="checkbox checkbox-md"
              />
              Offer
            </label>
          </div>
          <div className="flex gap-4 items-center">
            <span>Amenities: </span>

            <label className="flex items-center gap-2" htmlFor="parking">
              <input
                type="checkbox"
                checked={input.parking}
                onChange={(e) =>
                  setInput({ ...input, parking: e.target.checked })
                }
                id="parking"
                className="checkbox checkbox-md"
              />
              Parking
            </label>
            <label className="flex items-center gap-2" htmlFor="furnished">
              <input
                type="checkbox"
                id="furnished"
                checked={input.furnished}
                onChange={(e) =>
                  setInput({ ...input, furnished: e.target.checked })
                }
                className="checkbox checkbox-md"
              />
              Furnished
            </label>
          </div>

          <div className="flex items-center gap-3">
            <span>Sort: </span>
            <select
              name="sort_order"
              onChange={handleSelect}
              className="select"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      {/* right */}
      <div className="">
        <h1 className="text-3xl font-semibold border-b p-4 border-slate-700">
          Listing results:
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 w-full p-4 gap-3">
            {listings && listings.length > 0 ? (
              listings.map((listing, index) => (
                <ListingItem key={index} listing={listing} />
              ))
            ) : (
              <p className="text-red-600 font-semibold text-center">
                No listings available
              </p>
            )}

            {
              showMore &&
              <button
              onClick={showMoreData}
               className="btn btn-link">Show more</button>
            }
          </div>
      </div>
    </div>
  );
}

export default SearchPage;
