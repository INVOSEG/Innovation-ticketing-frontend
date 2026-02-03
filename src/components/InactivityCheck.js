import { useIdleTimer } from 'react-idle-timer';
import { useDispatch } from 'react-redux';
import { setLoading } from '../redux/reducer/loaderSlice';
import { setLoginUser } from '../redux/reducer/userSlice';
import { setDashboardOption } from '../redux/reducer/dashboardSlice';
import { resetFiltersState } from '../redux/reducer/ticketSlice';
import { useSnackbar } from 'notistack';

const InactivityCheck = ({ children }) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const onIdle = () => {
        // Remove token / session and redirect
        dispatch(setLoading(true));

        // Show loading for 3 seconds
        setTimeout(() => {
            resetFiltersState();
            dispatch(setLoginUser(null));
            dispatch(setDashboardOption("User Management"));
            dispatch(setLoading(false));

            enqueueSnackbar("Your session has ended due to 1 hour of inactivity!", { variant: "success" });


            // Optionally, you can redirect or perform any other action after logout
        }, 3000); // 3000 milliseconds = 3 seconds
    };

    useIdleTimer({
        timeout: 1000 * 60 * 60, // 1 hour in milliseconds
        onIdle,
        debounce: 500
    });

    return <>{children}</>;
};

export default InactivityCheck;
