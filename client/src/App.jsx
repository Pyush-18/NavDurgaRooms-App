import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Header from "./components/Header";
import CreateListing from "./pages/CreateListing";
import SingleListing from "./pages/SingleListing";
import EditListing from "./pages/EditListing";
import SearchPage from "./pages/SearchPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<SearchPage />} />

        <Route path="/profile" element={<ProtectedRoute element={<Profile />}/>} />
        <Route path="/create" element={<ProtectedRoute element={<CreateListing />} />} />
        <Route path="/listing/:listingId" element={<ProtectedRoute element={<SingleListing />} />} />
        <Route path="/edit/:listingId" element={<ProtectedRoute element={<EditListing />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
