import React from "react";
import toast from "react-hot-toast";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser, setLoader } from "../redux/user/userSlice";
import { USER_API_ENDPOINT } from "../Api/api_endpoint";
import { useNavigate } from "react-router-dom";

function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const handleGoogleClick = async () => {
    try {
      dispatch(setLoader(true));
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const response = await axios.post(`${USER_API_ENDPOINT}/google`, {
        username: result?.user?.displayName,
        email: result?.user?.email,
        avatar: result?.user?.photoURL,
      });
      console.log(response);
      if (response?.data?.success) {
        dispatch(setAuthUser(response?.data?.info));
        navigate("/")
        
      }
    } catch (error) {
      toast.error(`Can't login with Google: ${error?.message}`);
    }finally{
        dispatch(setLoader(false))
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="btn btn-secondary w-full uppercase"
    >
      Continue with google
    </button>
  );
}

export default OAuth;
