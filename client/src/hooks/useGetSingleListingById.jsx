import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setSingleListing } from '../redux/user/listingSlice'
import toast from 'react-hot-toast'

function useGetSingleListingById(listingId) {
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchListing = async() => {
         try {
             const response = await axios.get(`${LISTING_API_ENDPOINT}/get/${listingId}`,{withCredentials: true})
             if(response?.data?.success){
                 dispatch(setSingleListing(response?.data?.info))
             }
         } catch (error) {
             toast.error(error?.response?.data?.message)
         }
        }
        fetchListing()
     },[])
}

export default useGetSingleListingById