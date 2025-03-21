import { Camera, DoorOpen, Loader } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { LISTING_API_ENDPOINT, USER_API_ENDPOINT } from "../Api/api_endpoint";
import { setAuthUser, setIsUpdatingProfile } from "../redux/user/userSlice";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import useGetAllListing from "../hooks/useGetAllListing";
import { setAllListing, setRefresh } from "../redux/user/listingSlice";

function Profile() {
  useGetAllListing();
  const { authUser, isUpdatingProfile } = useSelector((store) => store.user);
  const { allListing } = useSelector((store) => store.listing);
  const [showListings, setShowListings] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [input, setInput] = useState({
    username: authUser?.username || "",
    email: authUser?.email || "",
    avatar: authUser?.avatar || "",
  });
  const handleUpdateAvatar = (e) => {
    const file = e.target.files[0];
    setInput((prev) => ({ ...prev, avatar: file }));
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const updateProfileHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", input.username);
    formData.append("email", input.email);
    formData.append("avatar", input.avatar);
    try {
      dispatch(setIsUpdatingProfile(true));
      const response = await axios.post(
        `${USER_API_ENDPOINT}/update-profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (response?.data?.success) {
        dispatch(
          setAuthUser({
            ...authUser,
            username: response?.data?.info?.username,
            email: response?.data?.info?.email,
            avatar: response?.data?.info?.avatar,
          })
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setIsUpdatingProfile(false));
    }
  };

  const logoutHandler = async () => {
    try {
      const response = await axios.get(`${USER_API_ENDPOINT}/logout`, {
        withCredentials: true,
      });
      console.log(response)
      if (response?.data?.success) {
        dispatch(setAuthUser(null));
        navigate("/login");
        toast.success(response?.data?.message);
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message);
    }
  };

  const deleteListingHandler = async (listingId) => {
    try {
      const response = await axios.delete(
        `${LISTING_API_ENDPOINT}/delete/${listingId}`,
        { withCredentials: true }
      );
      if (response?.data?.success) {
        toast.success(response?.data?.message);

        if(allListing && allListing?.length > 0){
          const newListings = allListing?.filter((listing) => listing?._id !== listingId)
          dispatch(setAllListing(newListings))
        }
      }else{
        toast.error(response?.data?.message); 
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div className="flex flex-col items-center p-8 overflow-x-hidden  h-[calc(100vh-70px)]">
      <div className=" rounded-lg min-w-[550px] ">
        <button onClick={logoutHandler} className="p-6 pl-10 sm:pl-4">
          <DoorOpen className="size-8 cursor-pointer" />
        </button>
        <form
          onSubmit={updateProfileHandler}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <img
              src={authUser?.avatar || "/avatar.webp"}
              className="rounded-full size-30 object-cover border-4 border-yellow-300"
              alt=""
            />
            <label
              htmlFor="avatar-upload"
              className="absolute right-0 bottom-0 bg-black rounded-full p-1 hover:scale-120 transition-transform duration-200"
            >
              <Camera className="size-6" />
              <input
                onChange={handleUpdateAvatar}
                type="file"
                accept="image/*"
                className="hidden"
                id="avatar-upload"
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
          <p className="my-4">
            {isUpdatingProfile
              ? "Updating..."
              : "Click camera icon to change the avatar"}
          </p>
          <input
            value={input.username}
            onChange={inputHandler}
            type="text"
            name="username"
            placeholder="username"
            className="input input-ghost mt-6 bg-white text-black font-medium"
          />
          <input
            value={input.email}
            onChange={inputHandler}
            type="email"
            name="email"
            placeholder="email"
            className="input input-ghost mt-6 bg-white font-medium text-black"
          />

          <button
            type="submit"
            className="btn btn-soft btn-primary w-[65vw] sm:w-[20vw] mt-4"
            disabled={isUpdatingProfile}
          >
            {isUpdatingProfile && <Loader className="animate-spin" />}
            Update Profile
          </button>
        </form>

        <div className="flex items-center justify-center">
          <Link to="/create">
            <button className="btn btn-soft btn-secondary w-[65vw] sm:w-[20vw] my-4">
              Create Listing
            </button>
          </Link>
        </div>
      </div>
      <button
        onClick={() => setShowListings((prev) => !prev)}
        className="btn btn-link my-3"
      >
        Show Listings
      </button>
      {
        showListings && <h1 className="font-bold text-2xl mb-4">All Listings</h1>
      }
      {showListings &&
        allListing &&
        allListing?.length > 0 &&
        allListing?.map((listing) => (
          <div
            className="flex justify-between items-center border my-3 p-3 rounded-md border-gray-500 w-[100vw] sm:w-[40vw]"
            key={listing?._id}
          >
            <div className="flex items-center gap-4">
              <Link to={`/listing/${listing?._id}`}>
                <img
                  className="size-15 object-cover rounded-full"
                  src={listing?.images[1] || "/default_hotel_img.png"}
                  alt="listing image"
                />
              </Link>
              <Link to={`/listing/${listing?._id}`}>
                <p className="text-gray-200 text-sm">
                  {listing?.name}
                </p>
              </Link>
            </div>

            <div className="flex flex-col">
              <button
                onClick={() => deleteListingHandler(listing?._id)}
                className="btn btn-link text-red-600"
              >
                Delete
              </button>
              <Link to={`/edit/${listing?._id}`}><button className="btn btn-link">Edit</button></Link>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Profile;
