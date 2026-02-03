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

export default function IssueTicketModal({ open, setOpen, handleIssueTicket, handleHoldTicket }) {
    const isLoading = useSelector((state) => state.loading.loading);
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
                        Do you want to hold or issue the ticket?
                    </DialogContent>
                    <DialogActions>
                        {isLoading ? (
                            <Button variant="plain" color="neutral" loading={isLoading}>
                                Loading...
                            </Button>
                        ) : (
                            <>
                                <Button variant="solid" color="danger" onClick={() => handleHoldTicket(false)}>
                                    Hold
                                </Button>
                                <Button variant="plain" color="neutral" onClick={() => handleIssueTicket(false)}>
                                    Issue
                                </Button>
                            </>
                        )}
                    </DialogActions>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}
