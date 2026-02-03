import React from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { setDashboardOption } from '../redux/reducer/dashboardSlice';
import { setLoginUser } from '../redux/reducer/userSlice';
import { useTicketFilterValues } from '../context/ticketFilterValues';
import InactivityCheck from '../components/InactivityCheck';

const isTokenExpired = (token) => {
    if (!token) return true; // No token means expired
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() > exp; // Check if current time is greater than expiration time
};

const ProtectedRoute = ({ element: Element }) => {
    let userData = useSelector(state => state.user.loginUser);
    const { resetFiltersState } = useTicketFilterValues()
    const token = Cookies.get('auth-token');
    const dispatch = useDispatch();

    if (isTokenExpired(token)) {
        resetFiltersState();
        dispatch(setLoginUser(null));
        dispatch(setDashboardOption("User Management"));
        userData = null
    }

    const isAuthenticated = userData?.id
    return isAuthenticated ?
        <InactivityCheck>
            <Element />
        </InactivityCheck>
        : <Navigate to="/login" />;
};

export default ProtectedRoute;
