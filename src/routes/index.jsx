import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLogin from "../pages/login/Login";
import AppRegister from "../pages/register/Register";
import ProtectedRoute from "../routes/ProtectedRoute";
import AppDashboard from "../pages/dashboard";
import Booking from "../pages/booking/Booking";
import Verification from "../pages/verification/Verification";
import HideIfLoggedIn from "./HideIfLoggedIn";
import ForgetPassword from "../pages/forget-password/ForgetPassword";
import Signup from "../pages/b2b/Signup";
import Login from "../pages/b2b/Login";
import Agency from "../pages/b2b/Agency";
import Profile from "../pages/b2b/Profile";
import PNR from "../pages/b2b/PNR";
import SearchTicket from "../pages/b2b/SearchTicket";
import PnrDetail from "../pages/b2b/PnrDetail";
import SaleReport from "../pages/b2b/SaleReport";
import FlightBooking from "../pages/b2b/FlightBooking";
import InformationRequired from "../pages/b2b/InformationRequired";
import PortalHome from "../components/utils/PortalHome";
import ImportPNRv2 from "../components/utils/ImportPNRv2";
import SearchFlights from "../components/utils/SearchFlights";
import TravelCalendar from "../pages/b2b/TravelCalender";
import BookingV2 from "../pages/booking/BookingV2";
import Umrahb2b from "../pages/b2b/Umrahb2b";
import InactivityCheck from "../components/InactivityCheck";
import Account from "../pages/b2b/Account";
// import Umrahb2b from "../pages/b2b/Umrahb2b";


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<HideIfLoggedIn element={AppLogin} />} />
        <Route path="/register" element={<HideIfLoggedIn element={AppRegister} />} />
        <Route path="/verification/:email" element={<HideIfLoggedIn element={Verification} />} />
        <Route path="/forget-password" element={<HideIfLoggedIn element={ForgetPassword} />} />
        <Route path="/forget-password/:token" element={<HideIfLoggedIn element={ForgetPassword} />} />
        <Route path="/" element={<ProtectedRoute element={AppDashboard} />} />
        {/* <Route path="/booking" element={<ProtectedRoute element={Booking} />} /> */}
        <Route path="/booking" element={<ProtectedRoute element={BookingV2} />} />

        {/* B2B Routes */}
        <Route path="/b2b/signup" element={<ProtectedRoute element={Signup} />} />
        <Route path="/b2b/login" element={<ProtectedRoute element={Login} />} />
        <Route path="/b2b/agency" element={<ProtectedRoute element={Agency} />} />
        <Route path="/b2b/profile" element={<ProtectedRoute element={Profile} />} />
        <Route path="/b2b/account" element={<ProtectedRoute element={Account} />} />
        <Route path="/b2b/pnr" element={<ProtectedRoute element={PNR} />} />
        {/* <Route path="/b2b/searchticket" element={<ProtectedRoute element={SearchTicket} />} /> */}
        <Route path="/b2b/pnr-detail" element={<ProtectedRoute element={PnrDetail} />} />
        <Route path="/b2b/sale-report" element={<ProtectedRoute element={SaleReport} />} />
        <Route path="/b2b/flight-booking" element={<ProtectedRoute element={FlightBooking} />} />
        <Route path="/b2b/under-discussion" element={<ProtectedRoute element={InformationRequired} />} />
        <Route path="/b2b/searchticket" element={<ProtectedRoute element={PortalHome} />} />
        <Route path="/pnr" element={<ProtectedRoute element={ImportPNRv2} />} />
        <Route path="/flights" element={<ProtectedRoute element={SearchFlights} />} />
        <Route path="/b2b/travel-calender" element={<ProtectedRoute element={TravelCalendar} />} />
        {/* <Route path="/b2b/umrah" element={<ProtectedRoute element={Umrahb2b} />} /> */}
        <Route path="/b2b/umrah" element={<ProtectedRoute element={InformationRequired} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
