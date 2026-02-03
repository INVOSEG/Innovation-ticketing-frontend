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

export default function ConfirmDeleteUser({ openDeleteUser, setOpenDeleteUser, handleDeleteAgencyUser }) {

    return (
        <React.Fragment>
            <Modal open={openDeleteUser} onClose={() => setOpenDeleteUser(false)}>
                <ModalDialog variant="outlined" role="alertdialog">
                    <DialogTitle>
                        <WarningRoundedIcon />
                        Confirmation
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        Are you sure you want to delete this user?
                    </DialogContent>
                    <DialogActions>
                        <Button variant="solid" color="danger" onClick={handleDeleteAgencyUser}>
                            Delete User
                        </Button>
                        <Button variant="plain" color="neutral" onClick={() => setOpenDeleteUser(false)}>
                            Cancel
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}
