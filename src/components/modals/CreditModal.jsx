import * as React from 'react';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { Input, Option, Select } from '@mui/joy';
import { createLedger, updateLedger } from '../../server/api';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { setLoading } from '../../redux/reducer/loaderSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function CreditModal({ open, setOpen, pnr, isEdit }) {
    const isLoading = useSelector((state) => state.loading.loading);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [isPayNow, setIsPayNow] = React.useState(false);
    const [transactionData, setTransactionData] = React.useState({
        amount: '',
        payMode: '',
        chequeNo: '',
        bankName: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTransactionData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        dispatch(setLoading(true))
        const body = {
            ...transactionData,
            pnr
        }

        createLedger(body).then((res) => {
            if (res.status === "success") {
                setOpen({ value: false, pnr: null })
                dispatch(setLoading(false))
                enqueueSnackbar(res.message, { variant: "success" });
                navigate("/");
            }
        }).catch((err) => {
            dispatch(setLoading(false))
            enqueueSnackbar(err || "Something went wrong!", { variant: "error" });
        })
    }

    const handlePayLater = async () => {
        dispatch(setLoading(true))
        const body = {
            pnr
        }

        createLedger(body).then((res) => {
            if (res.status === "success") {
                dispatch(setLoading(false))
                setOpen({ value: false, pnr: null })
                navigate("/");
            }
        }).catch((err) => {
            dispatch(setLoading(false))
            enqueueSnackbar(err || "Something went wrong!", { variant: "error" });
        })
    }

    const handleEditCredit = async () => {
        dispatch(setLoading(true))

        const body = {
            ...transactionData,
            pnr
        }

        updateLedger(body).then((res) => {
            if (res.status === "success") {
                setOpen({ value: false, pnr: null })
                enqueueSnackbar(res.message, { variant: "success" });
                dispatch(setLoading(false))
                navigate("/");
            }
        }).catch((err) => {
            dispatch(setLoading(false))
            enqueueSnackbar(err || "Something went wrong!", { variant: "error" });
        })
    }

    React.useEffect(() => {
        if (isEdit) {
            setIsPayNow(isEdit)
        } else {
            setIsPayNow(false)
        }
    }, [isEdit])

    return (
        <React.Fragment>
            <Modal open={open} onClose={() => isEdit ? setOpen(false) : handlePayLater()}>
                <ModalDialog variant="outlined" role="alertdialog">
                    {isPayNow ? (
                        <DialogContent>
                            <Select
                                name="payMode"
                                value={transactionData.payMode}
                                onChange={(e, value) =>
                                    setTransactionData((prev) => ({ ...prev, payMode: value }))
                                }
                                placeholder="Select Payment Mode"
                            >
                                <Option value="CASH">Cash</Option>
                                <Option value="CHECK">Check</Option>
                                {/* <Option value="CR">Credit</Option>
                                <Option value="VD">Void</Option> */}
                            </Select>
                            {transactionData.payMode === "CHECK" && (
                                <Input
                                    sx={{ mt: 1 }}
                                    type="text"
                                    name="chequeNo"
                                    placeholder="Enter Check Number"
                                    value={transactionData.chequeNo}
                                    onChange={handleInputChange}
                                />
                            )}
                            {transactionData.payMode === "CHECK" && (
                                <Input
                                    sx={{ mt: 1 }}
                                    type="text"
                                    name="bankName"
                                    placeholder="Enter Bank Name"
                                    value={transactionData.bankName}
                                    onChange={handleInputChange}
                                />
                            )}
                            <Input
                                sx={{ mt: 1 }}
                                type="number"
                                name="amount"
                                placeholder="Enter Amount"
                                value={transactionData.amount}
                                onChange={handleInputChange}
                            />
                        </DialogContent>
                    ) : (
                        <>
                            <DialogTitle>
                                <WarningRoundedIcon />
                                Confirmation
                            </DialogTitle>
                            <Divider />
                            <DialogContent>
                                Do you want to pay it now or pay later?
                            </DialogContent>
                            <DialogActions>
                                {isLoading ? (
                                    <Button variant="plain" color="neutral" loading={isLoading}>
                                        Loading...
                                    </Button>
                                ) : (
                                    <>
                                        <Button variant="solid" color="danger" onClick={() => setIsPayNow(true)}>
                                            Pay Now
                                        </Button>
                                        <Button variant="plain" color="neutral" onClick={() => handlePayLater()}>
                                            Pay Later
                                        </Button>
                                    </>
                                )}
                            </DialogActions>
                        </>
                    )}

                    {isPayNow && (
                        <DialogActions>
                            <Button loading={isLoading} onClick={() => { isEdit ? handleEditCredit() : handleUpdate() }}>
                                Save
                            </Button>
                        </DialogActions>
                    )}
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}
