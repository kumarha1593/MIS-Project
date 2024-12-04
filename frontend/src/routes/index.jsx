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
import ScreeningCount from '../components/userManagement/ScreeningCount'
import OverView from '../components/userManagement/OverView'
import HealthFacilityStatus from '../components/screenings/HealthFacilityStatus'
import StateWiseScreening from '../components/screenings/StateWiseScreening'

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

                {/* Screening Routes */}
                <Route
                    path="/screening-count"
                    element={
                        <AppLayout hideFamily>
                            <ScreeningCount />
                        </AppLayout>
                    }
                />


                {/* Health Facility Status Routes */}
                <Route
                    path="/health-facility-status"
                    element={
                        <AppLayout hideFamily>
                            <HealthFacilityStatus />
                        </AppLayout>
                    }
                />

                {/* State Screening Routes */}
                <Route
                    path="/state-screening"
                    element={
                        <AppLayout hideFamily>
                            <StateWiseScreening />
                        </AppLayout>
                    }
                />

                {/* OverView Routes */}
                <Route
                    path="/dashboard-overview"
                    element={
                        <AppLayout hideFamily>
                            <OverView />
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