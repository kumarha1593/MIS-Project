import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoutes = () => {

    const isAuthenticated = localStorage.getItem('token') ? true : false;

    return isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

export default PrivateRoutes