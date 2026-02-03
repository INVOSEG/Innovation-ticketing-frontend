import * as React from 'react';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import { Box, Card, CardContent, Chip, FormControl, FormLabel, Input, Radio, RadioGroup, Typography } from '@mui/joy';
import FlightTicketCard from '../../pages-components/BookingEngine/FlightTicket';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import PersonIcon from '@mui/icons-material/Person'
import moment from 'moment';
import { useTicketFilterValues } from '../../context/ticketFilterValues';

export default function AddBaseFare({ open, setOpen, openReviewConfirmationModalIssue, psfValue, setPsfValue, printOption, setPrintOption }) {

    const { markupPreference,
        markupvalue } = useTicketFilterValues()

    return (
        <React.Fragment>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant="outlined" role="alertdialog" sx={{ width: '45%', height: markupvalue === "" ? '50%' : '40%' }}>
                    <DialogTitle>
                        Add Base Fare
                    </DialogTitle>
                    <Divider />
                    <DialogContent sx={{ overflow: 'hidden' }}>
                        <FormControl>
                            <FormLabel sx={{ fontSize: "20px" }}>Do you want to print the invoice :</FormLabel>
                            <RadioGroup name="radio-buttons-group" value={printOption} onChange={(e) => setPrintOption(e.target.value)}>
                                <Radio value="with" label="With Fare" size="md" />
                                <Radio value="without" label="Without Fare" size="md" />
                            </RadioGroup>
                        </FormControl>
                        {markupvalue === "" && (
                            <FormControl>
                                <FormLabel>PSF Value:</FormLabel>
                                <Input placeholder="Enter PSF value" value={psfValue} onChange={(e) => setPsfValue(e.target.value)} />
                            </FormControl>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button variant="solid" color="success" onClick={() => console.log('Close it')} sx={{ display: 'none' }}>
                            Continue
                        </Button>
                        <Button variant="soft" color="success" onClick={() => openReviewConfirmationModalIssue()}>
                            Next
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}
