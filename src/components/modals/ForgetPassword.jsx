import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalDialog,
    ModalClose,
    Typography,
    FormControl,
    FormLabel,
    Input,
    Button,
    Stack,
    IconButton,
    Box
} from '@mui/joy';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { updateProfilePassword } from '../../server/api';

export default function ForgetPassword({ open, setOpen }) {
    const { enqueueSnackbar } = useSnackbar();

    const userData = useSelector((state) => state?.user?.loginUser);

    const [otp, setOtp] = useState('');
    const [otpTimer, setOtpTimer] = useState(300);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const handleResendOTP = async () => {
        try {
            await resendOtp({ email: userData?.email });
            enqueueSnackbar("OTP send to your email!", { variant: "success" });
            setOtpTimer(300);
        } catch (error) {
            console.log(error)
            const errorMessage = error || "Something went wrong";
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')} Min ${secs.toString().padStart(2, '0')} Sec`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true)

        if (newPassword !== confirmPassword) {
            enqueueSnackbar("New password and confirm password is not same!", { variant: "error" });
            setIsLoading(false)
        } else {
            updateProfilePassword({ newPassword, otp }).then((res) => {
                console.log(res)

                enqueueSnackbar(res?.message, { variant: "success" });
                setIsLoading(false)
                setOpen(false);
            }).catch((error) => {
                console.log(error)

                const errorMessage = error || "Something went wrong";
                enqueueSnackbar(errorMessage, { variant: "error" });
                setIsLoading(false)
            })
        }
    };

    // OTP Timer countdown
    useEffect(() => {
        let interval;
        if (open && otpTimer > 0) {
            interval = setInterval(() => {
                setOtpTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [open, otpTimer]);

    return (
        <Box>
            <Modal open={open} onClose={() => { setOpen(false); setOtpTimer(300); }}>
                <ModalDialog
                    variant="outlined"
                    role="alertdialog"
                    size="md"
                    sx={{
                        maxWidth: 400,
                        borderRadius: 'md',
                        p: 3,
                        boxShadow: 'lg',
                    }}
                >
                    <ModalClose variant="plain" sx={{ m: 1 }} />

                    <Typography
                        component="h2"
                        id="modal-title"
                        level="h4"
                        textColor="inherit"
                        fontWeight="lg"
                        mb={2}
                        textAlign="center"
                    >
                        Change Password
                    </Typography>

                    <Stack spacing={2}>
                        {/* New Password Field */}
                        <FormControl>
                            <FormLabel>New Password *</FormLabel>
                            <Input
                                type={showNewPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                endDecorator={
                                    <IconButton
                                        variant="plain"
                                        color="neutral"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        sx={{ '--IconButton-size': '24px' }}
                                    >
                                        {showNewPassword ? <VisibilityOffIcon size={16} /> : <RemoveRedEyeIcon size={16} />}
                                    </IconButton>
                                }
                                sx={{
                                    '--Input-decoratorChildHeight': '24px',
                                }}
                            />
                        </FormControl>

                        {/* Confirm Password Field */}
                        <FormControl>
                            <FormLabel>Confirm Password *</FormLabel>
                            <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                endDecorator={
                                    <IconButton
                                        variant="plain"
                                        color="neutral"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        sx={{ '--IconButton-size': '24px' }}
                                    >
                                        {showConfirmPassword ? <VisibilityOffIcon size={16} /> : <RemoveRedEyeIcon size={16} />}
                                    </IconButton>
                                }
                                sx={{
                                    '--Input-decoratorChildHeight': '24px',
                                }}
                            />
                        </FormControl>

                        {/* OTP Field */}
                        <FormControl>
                            <FormLabel>Enter OTP *</FormLabel>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                                <Input
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter OTP"
                                    sx={{ flex: 1 }}
                                />
                                <Box sx={{ minWidth: 'fit-content', textAlign: 'center' }}>
                                    {otpTimer > 0 ? (
                                        <Typography level="body-sm" textColor="neutral.600">
                                            Resend OTP {formatTime(otpTimer)}
                                        </Typography>
                                    ) : (
                                        <Button
                                            variant="plain"
                                            size="sm"
                                            onClick={handleResendOTP}
                                            sx={{
                                                textDecoration: 'underline',
                                                minHeight: 'auto',
                                                p: 0
                                            }}
                                        >
                                            Resend OTP
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </FormControl>

                        {/* Submit Button */}
                        <Button
                            onClick={handleSubmit}
                            fullWidth
                            sx={{ mt: 2 }}
                            disabled={!newPassword || !confirmPassword || !otp || isLoading}
                        >
                            {isLoading ? "Loaidng..." : "Reset Password"}
                        </Button>
                    </Stack>
                </ModalDialog>
            </Modal>
        </Box>
    );
}