import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({children}) {
    const {authUser} = useSelector((store) => store.user)
  return authUser ? children : <Navigate to="/login"  replace/>
}

export default ProtectedRoute