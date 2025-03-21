import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const { authUser } = useSelector((store) => store.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set("searchTerm", searchTerm)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get("searchTerm")
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl)
    }
  },[location.search])
  return (
    <header className=" shadow-lg">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
          <Link to="/"><span className="text-gray-500">NavDurga</span>
          <span>Rooms</span>
          </Link>
        </h1>
        <form onSubmit={handleSubmit} className="flex items-center ">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="input input-primary rounded-lg w-34 sm:w-64"
          />
          <button type="submit">
            <Search className="-translate-x-9  hover:cursor-pointer" />
          </button>
        </form>

        <ul className="flex items-center gap-4 text-white">
          {authUser ? (
            <>
              <Link to="/" className="hidden sm:inline  hover:underline ">
                Home
              </Link>
              <Link to="/about" className="hidden sm:inline  hover:underline">
                About
              </Link>
              <Link to="/profile" className=" hover:underline">
                <img
                  src={authUser?.avatar || "/avatar.webp"}
                  className="w-9 h-9 rounded-full object-cover"
                  alt=""
                />
              </Link>
            </>
          ) : (
            <>
              <button className="btn btn-primary">
                <Link to="/register">SignUp</Link>
              </button>

              <Link to="/login" className=" hover:underline">
                Login
              </Link>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Header;
