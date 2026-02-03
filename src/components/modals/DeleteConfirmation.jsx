import * as React from 'react';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DeleteForever from '@mui/icons-material/DeleteForever';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { useSelector } from 'react-redux';

export default function DeleteConfirmation({ open, setOpen, handleDelete, description, flight }) {
    const isLoading = useSelector((state) => state.loading.loading)

    return (
        <React.Fragment>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant="outlined" role="alertdialog">
                    <DialogTitle>
                        <WarningRoundedIcon />
                        Confirmation
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        {description}
                    </DialogContent>
                    <DialogActions>
                        <Button loading={isLoading} variant="solid" color="danger" onClick={() => handleDelete(flight)}>
                            Confirm
                        </Button>
                        <Button disabled={isLoading} variant="plain" color="neutral" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}
