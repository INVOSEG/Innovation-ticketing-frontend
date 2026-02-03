import * as React from 'react';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Alert from '@mui/joy/Alert';
import AspectRatio from '@mui/joy/AspectRatio';
import Check from '@mui/icons-material/Check';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import { ForgetPasswordEmailSend, ResetPassword } from '../../server/api';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Alasam from "./../../images/alasamLogo.png"
import { setLoading } from '../../redux/reducer/loaderSlice';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';



export default function ForgetPassword() {
    const { token } = useParams()
    const { enqueueSnackbar } = useSnackbar();
    const [email, setEmail] = React.useState('')
    const [formData, setFormData] = React.useState({
        cpassword: '',
        password: '',

    });
    const [isEmailSend, setIsEmailSend] = React.useState(false);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = React.useState(false);
    const [showCPassword, setShowCPassword] = React.useState(false);

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            enqueueSnackbar("Please fill in email.", { variant: 'error' });
            return false;
        }
        if (!emailRegex.test(email)) {
            enqueueSnackbar("Please enter a valid email address", { variant: 'error' });

            return false;
        }
        return true;
    }

    const validatePassword = () => {
        const { password, cpassword } = formData;
        if (!password || !cpassword) {
            enqueueSnackbar("Please fill in all required fields.", { variant: 'error' });
            return false;
        }

        if (password !== cpassword) {
            enqueueSnackbar("The password and confirm password do not match. Please try again.", { variant: 'error' });
            return false;
        }
        return true;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleCPasswordVisibility = () => {
        setShowCPassword(!showCPassword);
    };

    const handleEmailSend = async (e) => {
        e.preventDefault()
        if (validateEmail()) {
            try {
                dispatch(setLoading(true))
                const res = await ForgetPasswordEmailSend({ email });

                if (res.message) {
                    setIsEmailSend(true);
                    dispatch(setLoading(false))
                } else {
                    enqueueSnackbar(res || "Login failed.", { variant: 'error' });
                    dispatch(setLoading(false))
                }
            } catch (error) {
                enqueueSnackbar(error || "An error occurred during login.", { variant: 'error' });
                dispatch(setLoading(false))
            }
            finally {
                dispatch(setLoading(false))
            }
        }
    };

    const handleForgetPassword = async (e) => {
        e.preventDefault();

        if (validatePassword()) {
            try {
                dispatch(setLoading(true))
                const res = await ResetPassword(token, { password: formData?.password });

                if (res.message) {
                    enqueueSnackbar(res.message, { variant: 'success' });
                    setTimeout(() => {
                        dispatch(setLoading(false))
                        navigate('/login')
                    }, 2000)
                } else {
                    enqueueSnackbar(res || "Login failed.", { variant: 'error' });
                    dispatch(setLoading(false))
                }
            } catch (error) {
                enqueueSnackbar(error || "An error occurred during login.", { variant: 'error' });
                dispatch(setLoading(false))
            }
            finally {
                dispatch(setLoading(false))
            }

        }

    }
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
                                    Forget Password
                                </Typography>
                            </Stack>
                        </Stack>

                        <Stack gap={4} sx={{ mt: 2 }}>
                            <form onSubmit={token ? handleForgetPassword : handleEmailSend}>
                                {token ? (
                                    <>
                                        <FormControl required>
                                            <FormLabel>Password</FormLabel>
                                            <Input type={showPassword ? "text" : "password"} name="password" endDecorator={showPassword ? <VisibilityIcon sx={{ cursor: 'pointer' }} onClick={togglePasswordVisibility} /> : <VisibilityOffIcon sx={{ cursor: 'pointer' }} onClick={togglePasswordVisibility} />} value={formData.password} onChange={handleChange} />

                                        </FormControl>

                                        <FormControl required>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <Input type={showCPassword ? "text" : "password"} name="cpassword" endDecorator={showCPassword ? <VisibilityIcon sx={{ cursor: 'pointer' }} onClick={toggleCPasswordVisibility} /> : <VisibilityOffIcon sx={{ cursor: 'pointer' }} onClick={toggleCPasswordVisibility} />} value={formData.cpassword} onChange={handleChange} />

                                        </FormControl>
                                    </>
                                ) : (
                                    <>
                                        {isEmailSend ? (

                                            <Alert
                                                size="lg"
                                                color="success"
                                                variant="solid"
                                                invertedColors
                                                startDecorator={
                                                    <AspectRatio
                                                        variant="solid"
                                                        ratio="1"
                                                        sx={{
                                                            minWidth: 40,
                                                            borderRadius: '50%',
                                                            boxShadow: '0 2px 12px 0 rgb(0 0 0/0.2)',
                                                        }}
                                                    >
                                                        <div>
                                                            <Check fontSize="xl2" />
                                                        </div>
                                                    </AspectRatio>
                                                }
                                                sx={{ alignItems: 'center', overflow: 'hidden' }}
                                            >
                                                <div>
                                                    <Typography level="title-lg">Email Sent Successfully</Typography>
                                                    <Typography level="body-sm">
                                                        A password reset link has been sent to your email address. Please check your inbox to proceed.
                                                    </Typography>
                                                </div>
                                            </Alert>
                                        ) : (
                                            <FormControl required>
                                                <FormLabel>Email</FormLabel>
                                                <Input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                            </FormControl>
                                        )}
                                    </>
                                )}
                                {!isEmailSend ? (
                                    <Stack gap={4} sx={{ mt: 2 }}>
                                        {!token && (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                                onClick={() => navigate('/login')}

                                            >
                                                <Link level="title-sm">
                                                    Go Back To Login?
                                                </Link>
                                            </Box>
                                        )}
                                        <Button type="submit" fullWidth>
                                            {token ? 'Change Password' : "Send Reset Link"}
                                        </Button>
                                    </Stack>
                                ) : (<>

                                    <Stack gap={4} sx={{ mt: 2 }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                            onClick={() => setIsEmailSend(false)}

                                        >
                                            <Link level="title-sm">
                                                Send Email Again?
                                            </Link>
                                        </Box>
                                        <Button type="submit" fullWidth onClick={() => { navigate('/login') }}>
                                            Go Back To Login
                                        </Button>
                                    </Stack>
                                </>
                                )}
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
