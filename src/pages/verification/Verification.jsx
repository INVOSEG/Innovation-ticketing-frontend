import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import { resendOtp, verifyOtp } from '../../server/api';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { setLoginUser } from '../../redux/reducer/userSlice';
import { useNavigate, useParams } from 'react-router-dom';
import Alasam from "./../../images/alasamLogo.png"
import Cookies from 'js-cookie';
import { setLoading } from '../../redux/reducer/loaderSlice';

export default function Verification() {
    const { email } = useParams()
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [otp, setOtp] = React.useState(["", "", "", "", "", ""])
    const [timer, setTimer] = React.useState(300) // 5 minutes in seconds
    const [hover, setHover] = React.useState(false);

    const handleChangeOtp = (e, index) => {
        const value = e.target.value;

        // Only allow numeric input
        if (/^\d*$/.test(value)) {
            const newOtp = [...otp];

            // Check if the value in otp state is empty , if empty then add it otherwise  replace it with latest value.
            if (newOtp[index] === '') {
                newOtp[index] = value;
                setOtp(newOtp);
            } else {
                const newValue = value.slice(-1)
                newOtp[index] = newValue;
                setOtp(newOtp);
            }


            // Move focus to next input when user enters a digit
            if (value && index < otp.length - 1) {
                document.getElementById(`otp-input-${index + 1}`).focus();
            }
        }
    }

    const handleUserLogin = async () => {

        try {
            dispatch(setLoading(true))
            const res = await verifyOtp({ email, otp: otp.join('') });
            console.log(res?.user?.role)

            if (res.user.id) {
                enqueueSnackbar("Verification successful!", { variant: 'success' });
                dispatch(setLoginUser(res?.user))
                Cookies.set('auth-token', res.token, { expires: 7 });
                dispatch(setLoading(false))
                setOtp(["", "", "", "", "", ""])
                setTimer(300)
                navigate("/")
                // if (res.user.role === "super_admin") {
                //     navigate("/b2b/searchticket")
                // } else {
                //     navigate("/")
                // }
            } else {
                enqueueSnackbar(res || "Verification failed.", { variant: 'error' });
                dispatch(setLoading(false))
            }
        } catch (error) {
            enqueueSnackbar(error || "An error occurred during login.", { variant: 'error' });
            dispatch(setLoading(false))
        }
        finally {
            dispatch(setLoading(false))
        }
    };

    const resendOtpFunction = async () => {
        try {
            const data = await resendOtp({ email });
            enqueueSnackbar(data?.message, { variant: "success" });
            setOtp(["", "", "", "", "", ""]);
            setTimer(300);
        } catch (error) {
            console.log(error)
            // Check if the error contains a message
            const errorMessage = error?.message || "Something went wrong";
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    }

    React.useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer === 0) {
                    clearInterval(interval)
                    return 0
                }
                return prevTimer - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    React.useEffect(() => {
        if (otp.join('').length === 6) {
            handleUserLogin()
        }
    }, [otp]);

    return (
        <CssVarsProvider defaultMode="light" disableTransitionOnChange>
            <CssBaseline />
            <GlobalStyles
                styles={{
                    ':root': {
                        '--Form-maxWidth': '800px',
                        '--Transition-duration': '0.4s', // set to `none` to disable transition
                    },
                }}
            />
            <Box
                sx={(theme) => ({
                    width: { xs: '100%', md: '50vw' },
                    transition: 'width var(--Transition-duration)',
                    transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    backdropFilter: 'blur(12px)',
                    backgroundColor: 'rgba(255 255 255 / 0.2)',
                    [theme.getColorSchemeSelector('dark')]: {
                        backgroundColor: 'rgba(19 19 24 / 0.4)',
                    },
                })}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '100dvh',
                        width: '100%',
                        px: 2,
                    }}
                >
                    <Box
                        component="header"
                        sx={{
                            py: 3,
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                            <img src={Alasam} style={{ width: '200px', height: '100px' }} />
                        </Box>
                    </Box>
                    <Box
                        component="main"
                        sx={{
                            my: 'auto',
                            py: 2,
                            pb: 5,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            width: 400,
                            maxWidth: '100%',
                            mx: 'auto',
                            borderRadius: 'sm',
                            '& form': {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                            },
                            [`& .MuiFormLabel-asterisk`]: {
                                visibility: 'hidden',
                            },
                        }}
                    >
                        <Stack gap={4} sx={{ mb: 2 }}>
                            <Stack gap={1}>
                                <Typography component="h1" level="h3">
                                    Enter Verification Code
                                </Typography>
                            </Stack>
                        </Stack>
                        <Stack gap={4} sx={{ mt: 2 }}>
                            <form>
                                <Stack direction={"row"} gap={1}>
                                    {otp.map((digit, index) => (
                                        <Input
                                            key={index}
                                            id={`otp-input-${index}`}
                                            value={digit}
                                            onChange={(e) => handleChangeOtp(e, index)}
                                            inputProps={{ maxLength: 1, inputMode: 'numeric', style: { textAlign: 'center', fontSize: '24px' }, }}
                                            sx={{ width: 60, height: 60, textAlign: 'center', fontSize: '24px' }}
                                        />
                                    ))}
                                </Stack>

                                <Stack gap={4} sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Typography level="h4">
                                        Time remaining: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
                                    </Typography>
                                </Stack>

                                <Stack gap={4} >
                                    <Typography>
                                        Didn't receive code? <span style={{
                                            color: hover ? 'red' : 'blue', textDecoration: 'underline', cursor: 'pointer'
                                        }}
                                            onMouseEnter={() => {
                                                setHover(true);
                                            }}
                                            onMouseLeave={() => {
                                                setHover(false);
                                            }}

                                            onClick={() => resendOtpFunction()}>Request Again</span>
                                    </Typography>
                                </Stack>
                            </form>
                        </Stack>
                    </Box>
                    <Box component="footer" sx={{ py: 3 }}>
                        <Typography level="body-xs" textAlign="center">
                            © INNOVATION TECH {new Date().getFullYear()}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={(theme) => ({
                    height: '100%',
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    left: { xs: 0, md: '50vw' },
                    transition:
                        'background-image var(--Transition-duration), left var(--Transition-duration) !important',
                    transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
                    backgroundColor: 'background.level1',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundImage:
                        'url(https://images.pexels.com/photos/1443894/pexels-photo-1443894.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
                    [theme.getColorSchemeSelector('dark')]: {
                        backgroundImage:
                            'url(https://images.pexels.com/photos/1443894/pexels-photo-1443894.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
                    },
                })}
            />
        </CssVarsProvider>
    );
}
