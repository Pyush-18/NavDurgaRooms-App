import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authUser : null,
    loader : false,
    isUpdatingProfile : false
}

const userSlice = createSlice({
    name: "user",
    initialState, 
    reducers: {
        setLoader : (state,action) => {
            state.loader = action.payload
        },
        setAuthUser : (state, action) => {
            state.authUser = action.payload
        },
        setIsUpdatingProfile : (state, action) => {
            state.isUpdatingProfile = action.payload
        }
    }
})

export const {setLoader, setAuthUser, setIsUpdatingProfile} = userSlice.actions

export default userSlice.reducer