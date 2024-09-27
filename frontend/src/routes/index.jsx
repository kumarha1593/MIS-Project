import React from 'react'
import PageNotFound from '../components/global/PageNotFound'
import PrivateRoutes from './AuthRoutes'
import PublicRoutes from './UnAuthRoutes'
import Login from '../components/Login/Login'
import AdminLogin from '../components/AdminLogin/AdminLogin'
import AdminHomePage from '../components/AdminHomePage/AdminHomePage'
import Users from '../components/userManagement'
import AdminFormPage from '../components/AdminFormPage/AdminFormPage'
import AppLayout from '../components/AppLayout/AppLayout'
import Home from '../components/Home/Home'
import FieldDashboard from '../components/FieldDashboard/FieldDashboard'
import FamilyDetails from '../components/FamilyDetails/FamilyDetails'
import FormPage from '../components/FormPage/FormPage'
import ReviewPage from "../components/Review/Review";
import { Route, Routes } from 'react-router-dom'

const RouteStack = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoutes />}>
                <Route path="/" element={<Login />} />
                <Route path="/admin-login" element={<AdminLogin />} />
            </Route>

            {/* Private Routes */}
            <Route element={<PrivateRoutes />}>
                {/* Super Admin Routes */}
                <Route
                    path="/admin-home"
                    element={
                        <AppLayout hideFamily>
                            <AdminHomePage />
                        </AppLayout>
                    }
                />

                <Route
                    path="/admin-form"
                    element={
                        <AppLayout showBackBtn hideFamily>
                            <AdminFormPage />
                        </AppLayout>
                    }
                />

                {/* Admin Routes */}
                <Route
                    path="/users"
                    element={
                        <AppLayout hideFamily>
                            <Users />
                        </AppLayout>
                    }
                />

                {/* User Routes */}
                <Route
                    path="/home"
                    element={
                        <AppLayout>
                            <Home />
                        </AppLayout>
                    }
                />

                <Route
                    path="/FieldDashboard"
                    element={
                        <AppLayout>
                            <FieldDashboard />
                        </AppLayout>
                    }
                />

                <Route
                    path="/family-details/:headId"
                    element={
                        <AppLayout>
                            <FamilyDetails />
                        </AppLayout>
                    }
                />

                <Route
                    path="/FormPage"
                    element={
                        <AppLayout>
                            <FormPage />
                        </AppLayout>
                    }
                />

                <Route
                    path="/Review"
                    element={
                        <AppLayout>
                            <ReviewPage />
                        </AppLayout>
                    }
                />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};
export default RouteStack