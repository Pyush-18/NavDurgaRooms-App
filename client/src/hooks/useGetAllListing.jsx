import axios from 'axios'
import React, { useEffect } from 'react'
import { LISTING_API_ENDPOINT } from '../Api/api_endpoint'
import { useDispatch } from 'react-redux'
import { setAllListing } from '../redux/user/listingSlice'

function useGetAllListing() {
    const dispatch = useDispatch()
  useEffect(() => {
    const fetchListing = async() => {
        try {
            const response = await axios.get(`${LISTING_API_ENDPOINT}/all`, {withCredentials: true})
            if(response?.data?.success){
                dispatch(setAllListing(response?.data?.info))
            }
        } catch (error) {
            console.log(error)
        }
    }
    fetchListing()
  },[])
}

export default useGetAllListing