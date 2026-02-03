import * as React from 'react';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { Input, Stack } from '@mui/joy';
import { resendOtp } from '../server/api';
import { enqueueSnackbar } from 'notistack';

export default function OtpModal({ open, setOpen, flightId, apiName, handleSubmit, otp, setOtp, email, flight }) {
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

    const handleClose = () => {
        setOtp(["", "", "", "", "", ""])
        setOpen(false)
        setTimer(300)
    }

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
        if (open) {
            const interval = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer === 0 && open) {
                        clearInterval(interval)
                        return 0
                    }
                    return prevTimer - 1
                })
            }, 1000)

            return () => clearInterval(interval)
        }
    }, [open])

    React.useEffect(() => {
        if (otp.join('').length === 6) {
            handleSubmit(flightId, apiName, otp, flight);
            handleClose();
        }
    }, [flightId, apiName, otp, flight]);

    return (
        <React.Fragment>
            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={open}
                onClose={() => handleClose()}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Sheet
                    variant="outlined"
                    sx={{ maxWidth: 500, borderRadius: 'md', p: 3, boxShadow: 'lg' }}
                >
                    <ModalClose variant="plain" sx={{ m: 1 }} />
                    <Typography
                        component="h2"
                        id="modal-title"
                        level="h4"
                        textColor="inherit"
                        sx={{ fontWeight: 'lg', mb: 1 }}
                    >
                        OTP Verification Required
                    </Typography>
                    <Typography id="modal-desc" textColor="text.tertiary" level="title-sm">
                        Please enter the OTP sent to your email address to proceed with creating your ticket. This step ensures your identity and helps us securely process your request.
                    </Typography>


                    <Stack gap={4} sx={{ mt: 2 }}>
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
                    </Stack>
                </Sheet>
            </Modal>
        </React.Fragment>
    );
}
