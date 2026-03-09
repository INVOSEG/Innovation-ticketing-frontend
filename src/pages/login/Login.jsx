import * as React from 'react';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import { userLogin } from '../../server/api';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Alasam from "./../../images/alasamLogo.png"
import { setLoading } from '../../redux/reducer/loaderSlice';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// function ColorSchemeToggle() {
//     //   const { onClick, ...other } = props;
// const { mode, setMode } = useColorScheme();
//     const [mounted, setMounted] = React.useState(false);

//     React.useEffect(() => setMounted(true), []);

//     return (
//         <IconButton
//             aria-label="toggle light/dark mode"
//             size="sm"
//             variant="outlined"
//             disabled={!mounted}
//             onClick={(event) => {
//                 setMode(mode === 'light' ? 'dark' : 'light');
//                 // onClick?.(event);
//             }}
//         //   {...other}
//         >
//             {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
//         </IconButton>
//     );
// }

export default function AppLogin() {
    const { enqueueSnackbar } = useSnackbar();
    const [formData, setFormData] = React.useState({
        agentCode: '',
        email: '',
        password: '',
    });
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = React.useState(false);
    const validateForm = () => {
        const { password, email, agentCode } = formData;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!password || !email || !agentCode) {
            enqueueSnackbar("Please fill in all required fields.", { variant: 'error' });
            return false;
        }
        if (!emailRegex.test(email)) {
            enqueueSnackbar("Please enter a valid email address", { variant: 'error' });

            return false;
        }
        return true;
    };

    const handleUserLogin = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            try {
                dispatch(setLoading(true))
                const res = await userLogin({ ...formData, agentCode: formData?.agentCode?.toUpperCase() });

                if (res.status === "success") {
                    enqueueSnackbar(res?.message, { variant: 'success' });
                    dispatch(setLoading(false))
                    navigate(`/verification/${formData?.email}`)
                } else {
                    enqueueSnackbar(res?.message || "Login failed.", { variant: 'error' });
                    dispatch(setLoading(false))
                }
            } catch (error) {
                enqueueSnackbar(error, { variant: 'error' });
                dispatch(setLoading(false))
            }
            finally {
                dispatch(setLoading(false))
            }
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
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
                            {/* <IconButton variant="soft" color="primary" size="sm"> */}
                            <img src={Alasam} style={{ width: '200px', height: '110px' }} />
                            {/* <BadgeRoundedIcon /> */}
                            {/* </IconButton> */}
                            {/* <Typography level="title-lg"></Typography> */}
                        </Box>
                        {/* <ColorSchemeToggle /> */}
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
                                    Login
                                </Typography>
                                {/* <Typography level="body-sm">
                                    New to Al-Saboor? <Link href="/register" level="title-sm">
                                        Regsiter
                                    </Link>
                                </Typography> */}
                            </Stack>
                            {/* <Button
                                variant="soft"
                                color="neutral"
                                fullWidth
                                startDecorator={<GoogleIcon />}
                            >
                                Continue with Google
                            </Button> */}
                        </Stack>
                        {/* <Divider
                            sx={(theme) => ({
                                [theme.getColorSchemeSelector('light')]: {
                                    color: { xs: '#FFF', md: 'text.tertiary' },
                                },
                            })}
                        >
                            or
                        </Divider> */}
                        <Stack gap={4} sx={{ mt: 2 }}>
                            <form onSubmit={handleUserLogin}>
                                <FormControl required>
                                    <FormLabel>Agent Code</FormLabel>
                                    <Input type="text" name="agentCode" value={formData.agentCode} onChange={handleChange} />
                                </FormControl>
                                <FormControl required>
                                    <FormLabel>Email</FormLabel>
                                    <Input type="email" name="email" value={formData.email} onChange={handleChange} />
                                </FormControl>
                                <FormControl required>
                                    <FormLabel>Password</FormLabel>
                                    <Input type={showPassword ? "text" : "password"} name="password" endDecorator={showPassword ? <VisibilityIcon sx={{ cursor: 'pointer' }} onClick={togglePasswordVisibility} /> : <VisibilityOffIcon sx={{ cursor: 'pointer' }} onClick={togglePasswordVisibility} />} value={formData.password} onChange={handleChange} />

                                </FormControl>
                                <Stack gap={4} sx={{ mt: 2 }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                        onClick={() => navigate('/forget-password')}

                                    >
                                        <Link level="title-sm">
                                            Forgot your password?
                                        </Link>
                                    </Box>
                                    <Button type="submit" fullWidth>
                                        Sign in
                                    </Button>
                                </Stack>
                            </form>
                        </Stack>
                    </Box>
                    <Box component="footer" sx={{ py: 3 }}>
                        <Typography level="body-xs" textAlign="center">
                            © Al-Saboor {new Date().getFullYear()}
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
