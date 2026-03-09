import * as React from 'react';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/joy';
import FlightTicketCard from '../../pages-components/BookingEngine/FlightTicket';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import PersonIcon from '@mui/icons-material/Person'
import moment from 'moment';
import { useTicketFilterValues } from '../../context/ticketFilterValues';

export default function ReviewConfirmationModal({ open, setOpen, flight, brandedFare, travelers, openModalIssue, psfValue, tripType, singleBrandedFare }) {

    const { markupvalue } = useTicketFilterValues()

    return (
        <React.Fragment>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant="outlined" role="alertdialog" sx={{ width: '60%', height: '80%' }}>
                    <DialogTitle>
                        Re-confirmation Summary
                    </DialogTitle>
                    <Divider />
                    <DialogContent sx={{ overflow: 'auto' }}>
                        {(tripType !== "Multi City" || flight?.api === "hitit") && (
                            <Box>
                                <Typography level="h4">Review Ticket:</Typography>
                                <FlightTicketCard flight={flight} singleBrandedFare={singleBrandedFare} isReviewTicket={true} />
                            </Box>
                        )}

                        <Box>
                            <Typography level="h4">Review Travellers:</Typography>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                    gap: 2,
                                }}
                            >
                                {travelers?.map((item, index) => (
                                    <Card key={index} variant="outlined">
                                        <CardContent>
                                            <Typography level="title-lg">{item?.type} {index + 1}:</Typography>
                                            <Typography level="title-lg">{item?.lastName} / {item?.fullName} {item?.title}</Typography>
                                            <Chip
                                                size="sm"
                                                variant="soft"
                                                color={item?.gender === "MALE" ? 'primary' : item?.gender === "FEMALE" ? 'warning' : 'success'}
                                                sx={{ mt: 1, mb: 2 }}
                                            >
                                                {item?.gender}
                                            </Chip>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CalendarTodayIcon sx={{ fontSize: 'small' }} />
                                                    <Typography level="body-sm">
                                                        Born: {moment(item?.dob).format("DD-MM-YYYY")}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CreditCardIcon sx={{ fontSize: 'small' }} />
                                                    <Typography level="body-sm">Document: {item?.documentType}</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <PersonIcon sx={{ fontSize: 'small' }} />
                                                    <Typography level="body-sm">Document NO.: {item?.documentNo}</Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </Box>

                        <Box>
                            <Typography level="h4">Fare Details:</Typography>
                            <Stack direction="row" justifyContent="space-between" mb={1}>
                                <Typography level="body-sm">Base Fare:</Typography>
                                <Typography level="body-sm"> RS {flight.passengerTotalFare}</Typography>
                            </Stack>

                            {flight?.taxSummaries && (
                                <Stack direction="row" justifyContent="space-between" mb={1}>
                                    <Typography level="body-sm">Taxes & Fees:</Typography>
                                    <Typography level="body-sm">    RS {flight?.taxSummaries?.reduce((acc, tax) => acc + (parseFloat(tax.amount) || 0), 0)}</Typography>
                                </Stack>
                            )}

                            <Divider sx={{ my: 1 }} />
                            <Stack direction="row" justifyContent="space-between">
                                <Typography level="body-md" fontWeight="bold">Total:</Typography>
                                <Typography level="body-md" fontWeight="bold"> RS {markupvalue ? (flight.passengerTotalFare + Number(markupvalue)) : flight.passengerTotalFare + Number(psfValue)}</Typography>
                            </Stack>
                        </Box>

                        <Stack direction="row" justifyContent="end" sx={{ mt: 1 }}>
                            <Button variant="soft" color="warning" onClick={() => setOpen(false)} sx={{ mr: 1 }}>
                                Update
                            </Button>
                            <Button variant="solid" color="success" onClick={() => openModalIssue()}>
                                Continue
                            </Button>
                        </Stack>

                    </DialogContent>
                    <DialogActions>

                    </DialogActions>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
}
