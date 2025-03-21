import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LISTING_API_ENDPOINT } from "../Api/api_endpoint";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

function EditListing() {
  let [listingToUpdate, setListingToUpdate] = useState(null);
  const { listingId } = useParams();
  const [loader, setLoader] = useState(false);
  const { allListing } = useSelector((store) => store.listing);
  const navigate = useNavigate();
  useEffect(() => {
    if (allListing && allListing.length > 0) {
      const foundedListing = allListing?.find(
        (listing) => listing?._id === listingId
      );
      console.log(foundedListing);
      setListingToUpdate(foundedListing || null);
    }
  }, [allListing, listingId]);

  const [data, setData] = useState({
    name: "",
    description: "",
    address: "",
    noOfBedrooms: 0,
    noOfBathrooms: 0,
    parking: false,
    furnished: false,
    offer: false,
    regularPrice: 0,
    discountPrice: 0,
    type: "",
    images: [],
  });

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      name: listingToUpdate?.name || "",
      description: listingToUpdate?.description || "",
      address: listingToUpdate?.address || "",
      noOfBedrooms: listingToUpdate?.noOfBedrooms || 0,
      noOfBathrooms: listingToUpdate?.noOfBathrooms || 0,
      parking: listingToUpdate?.parking || false,
      furnished: listingToUpdate?.furnished || false,
      offer: listingToUpdate?.offer || false,
      regularPrice: listingToUpdate?.regularPrice || 0,
      discountPrice: listingToUpdate?.discountPrice || 0,
      type: listingToUpdate?.type || "",
      images: listingToUpdate?.images || [],
    }));
  }, [listingToUpdate]);

  const imageHandler = (e) => {
    const files = Array.from(e.target.files);
    setData((prev) => ({ ...prev, images: files }));
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const formHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("address", data.address);
    formData.append("parking", data.parking);
    formData.append("furnished", data.furnished);
    formData.append("offer", data.offer);
    formData.append("noOfBedrooms", data.noOfBedrooms);
    formData.append("noOfBathrooms", data.noOfBathrooms);
    formData.append("regularPrice", data.regularPrice);
    formData.append("discountPrice", data.discountPrice);
    formData.append("type", data.type);
    if (data.images.length > 0) {
      data.images?.map((image) => formData.append("images", image));
    }
    try {
      setLoader(true);
      const response = await axios.put(
        `${LISTING_API_ENDPOINT}/update/${listingId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        navigate(`/listing/${listingId}`);

        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update Listing
      </h1>
      <form onSubmit={formHandler} className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-col gap-4 p-4 flex-1">
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={changeHandler}
            placeholder="name"
            maxLength={62}
            minLength={10}
            required
            className="input input-ghost w-full sm:w-[30vw] p-4 bg-white text-black font-medium"
          />
          <textarea
            type="text"
            rows={5}
            cols={40}
            name="description"
            value={data.description}
            onChange={changeHandler}
            placeholder="description"
            required
            className="input input-ghost p-2  w-full sm:w-[30vw] bg-white text-black font-medium"
          />
          <input
            type="text"
            name="address"
            value={data.address}
            onChange={changeHandler}
            placeholder="address"
            required
            className="input input-ghost p-4 w-full sm:w-[30vw] bg-white text-black font-medium"
          />
          <div className="flex gap-6 flex-wrap">
            <label className="fieldset-label">
              <input
                onChange={(e) =>
                  setData((prev) => ({ ...prev, type: e.target.value }))
                }
                checked={data.type === "sale"}
                type="radio"
                name="type"
                value="sale"
                className="radio"
              />
              Sale
            </label>
            <label className="fieldset-label">
              <input
                checked={data.type === "rent"}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, type: e.target.value }))
                }
                type="radio"
                name="type"
                value="rent"
                className="radio"
              />
              Rent
            </label>
            <label className="fieldset-label">
              <input
                onChange={(e) =>
                  setData((prev) => ({ ...prev, parking: e.target.checked }))
                }
                checked={data.parking}
                type="checkbox"
                id="parking"
                className="checkbox"
              />
              Parking
            </label>
            <label className="fieldset-label">
              <input
                onChange={(e) =>
                  setData((prev) => ({ ...prev, furnished: e.target.checked }))
                }
                checked={data.furnished}
                type="checkbox"
                id="furnished"
                className="checkbox"
              />
              Furnished
            </label>
            <label className="fieldset-label">
              <input
                onChange={(e) =>
                  setData((prev) => ({ ...prev, offer: e.target.checked }))
                }
                checked={data.offer}
                type="checkbox"
                id="offer"
                className="checkbox"
              />
              Offer
            </label>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <label className="fieldset-label">
              <input
                type="number"
                id="bedrooms"
                value={data.noOfBedrooms}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    noOfBedrooms: parseInt(e.target.value),
                  }))
                }
                min={1}
                max={10}
                required
                className="input input-ghost p-4 w-15  bg-white text-black font-medium"
              />
              Bedrooms
            </label>
            <label className="fieldset-label">
              <input
                type="number"
                value={data.noOfBathrooms}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    noOfBathrooms: parseInt(e.target.value),
                  }))
                }
                id="bathrooms"
                min={0}
                max={10}
                required
                className="input input-ghost p-4 w-15  bg-white text-black font-medium"
              />
              Bathrooms
            </label>
            <label className="fieldset-label">
              <input
                type="number"
                id="regularPrice"
                value={data.regularPrice}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    regularPrice: parseInt(e.target.value),
                  }))
                }
                min={0}
                required
                className="input input-ghost p-4 w-15  bg-white text-black font-medium"
              />
              <div>
                <p>Regular Price</p>
                <p className="text-xs text-center"> ($ / month)</p>
              </div>
            </label>
            {data?.offer && (
              <label className="fieldset-label">
                <input
                  type="number"
                  value={data.discountPrice}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      discountPrice: parseInt(e.target.value),
                    }))
                  }
                  id="discountPrice"
                  min={0}
                  required
                  className="input input-ghost p-4 w-15  bg-white text-black font-medium"
                />
                <div>
                  <p>Discount Price</p>
                  <p className="text-xs text-center"> ($ / month)</p>
                </div>
              </label>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:items-center flex-1 sm:mt-3">
          <p className="font-semibold ml-4">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be cover (max : 5)
            </span>
          </p>
          <div className="mt-4 ml-4">
            <input
              className="p-3 border border-gray-300 rounded-lg w-fit"
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={imageHandler}
            />
          </div>
          <div className="m-4 flex flex-wrap items-center gap-4 border border-gray-400 p-6 rounded-lg">
            {data?.images?.map((image) => (
              <img src={image} className="size-24 rounded-lg" alt="images" />
            ))}
          </div>

          <button
            type="submit"
            disabled={loader}
            className="btn btn-primary flex gap-3 items-center  mt-6 w-[90vw] sm:w-[20vw] mx-auto"
          >
            {loader && <Loader2 className="animate-spin" />}
            Update Listing
          </button>
        </div>
      </form>
    </main>
  );
}
export default EditListing;
