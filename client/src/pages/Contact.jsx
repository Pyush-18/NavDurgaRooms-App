import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { USER_API_ENDPOINT } from "../Api/api_endpoint";
import toast from "react-hot-toast";

function Contact({ listing }) {
    const [message, setMessage] = useState("")
    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchUser = async() => {
            try {
                const response = await axios.get(`${USER_API_ENDPOINT}/${listing?.userId}`, {withCredentials: true})
                if(response?.data?.success){
                    setUser(response?.data?.info)
                }
            } catch (error) {
                toast.error(error?.message)
            }
        }
        fetchUser()
    },[])
    useEffect(() => {
        console.log(user)
    },[user])
  return (
    <div>
      <p className="mt-3">
        Contact : <span>{user?.username}</span> for : <span>{listing?.name}</span>
      </p>
      <textarea
        className="textarea mt-3 w-full"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message here..."
      ></textarea>
      
      <Link to={`mailto:${user?.email}?subject=${listing?.name}&body=${message}`}  className="btn btn-success w-full mt-3">Send Mesasge</Link>
    </div>
  );
}

export default Contact;
