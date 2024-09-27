import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const PublicRoutes = () => {

    const isAuthenticated = localStorage.getItem('token') ? true : false;

    return !isAuthenticated ? <Outlet /> : <Navigate to='/home' />
}

export default PublicRoutes