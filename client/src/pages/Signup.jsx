import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { USER_API_ENDPOINT } from "../Api/api_endpoint.js";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../redux/user/userSlice.js";
import OAuth from "../components/OAuth.jsx";
function Signup() {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { loader } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const changeHandler = (e) => {
    setInput({ ...input, [e.target.id]: e.target.value });
  };
  const dispatch = useDispatch();
  const registerHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoader(true));
      const response = await axios.post(
        `${USER_API_ENDPOINT}/register`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response?.data?.success) {
        navigate("/login");
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      dispatch(setLoader(false));
    }
  };
  return (
    <div className="max-w-lg mx-auto h-[calc(100vh-100px)] flex justify-center items-center flex-col">
      <h1 className="text-3xl text-center font-bold mb-10">Sign Up</h1>
      <form
        onSubmit={registerHandler}
        className="flex flex-col gap-4 items-center justify-between"
      >
        <input
          type="text"
          placeholder="username"
          className="input input-info rounded-lg"
          id="username"
          value={input.username}
          autoComplete="username"
          onChange={changeHandler}
        />
        <input
          type="email"
          placeholder="email"
          className="input input-info rounded-lg"
          autoComplete="email"
          id="email"
          value={input.email}
          onChange={changeHandler}
        />
        <input
          type="password"
          placeholder="password"
          className="input input-info rounded-lg"
          id="password"
          autoComplete="current-password"
          value={input.password}
          onChange={changeHandler}
        />
        <button
          type="submit"
          className="btn btn-soft btn-primary w-80 flex gap-3"
        >
          {loader && <LoaderCircle className="animate-spin" size={20} />}
          Signup
        </button>
        <OAuth />

        <span className="text-center mt-2">
          Already have an account ?{" "}
          <Link to="/login" className="text-blue-600 underline">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
}

export default Signup;
