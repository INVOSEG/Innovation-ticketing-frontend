import * as React from 'react';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { Input, Option, Select, Typography } from '@mui/joy';
import { createLedger, updateBalance, updateLedger } from '../../server/api';
import { useSnackbar } from 'notistack';
import { useLocation, useNavigate } from 'react-router-dom';
import { setLoading } from '../../redux/reducer/loaderSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function AddTopupModal({ open, setOpen, data, fetchAgencyUsers }) {
    const isLoading = useSelector((state) => state.loading.loading);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate()
    const location = useLocation();
    const dispatch = useDispatch()
    const [transactionData, setTransactionData] = React.useState({
        amount: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTransactionData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            dispatch(setLoading(true))
            const body = {
                ...transactionData,
                staffId: data?._id,
                type: "credited"
            }

            updateBalance(body).then((res) => {

                dispatch(setLoading(false))
                enqueueSnackbar(res.message, { variant: "success" });

                if (res.status === "success") {
                    fetchAgencyUsers()
                    setOpen({ value: false, data: null })
                    // Only navigate away if we are NOT on /b2b/profile
                    if (location.pathname !== "/b2b/profile") {
                        navigate("/");
                    }
                }
            }).catch((err) => { // This should be `.catch` to handle errors
                dispatch(setLoading(false));
                enqueueSnackbar(err, { variant: "error" });
            });
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <React.Fragment>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant="outlined" role="alertdialog">
                    <DialogContent>
                        <Typography level='h4'>Add Balance in {data?.firstName} Staff</Typography>
                        <Input
                            sx={{ mt: 1 }}
                            type="number"
                            name="amount"
                            placeholder="Enter Amount"
                            value={transactionData.amount}
                            onChange={handleInputChange}
                        />
                    </DialogContent>

                    <DialogActions>
                        <Button loading={isLoading} onClick={() => { handleUpdate() }}>
                            Save
                        </Button>
                        <Button disabled={isLoading} onClick={() => { setOpen(false) }}>
                            Close
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}
