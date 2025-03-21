import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allListing : [],
    singleListing: null,
}
const listingSlice = createSlice({
    name: "listing",
    initialState,
    reducers : {
        setAllListing : (state, action) => {
            state.allListing = action.payload
        },
        setSingleListing : (state, action) => {
            state.singleListing = action.payload
        }
    }
})

export const {setAllListing,setSingleListing,setRefresh} = listingSlice.actions

export default listingSlice.reducer