import React, { useCallback, useEffect, useRef, useState } from 'react'
import B2bHeader from '../../components/utils/b2bHeader'
import { Box, Chip, Table, Tooltip, Typography } from '@mui/joy';
import { formatDate } from '../../components/utils';
import { copyToClipboard, truncateString } from '../../utils/HelperFunctions';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../redux/reducer/loaderSlice';
import { cancelBooking, getAllBookings, issueTicket, refundFlight, resendOtp, viewItinary, viewItinaryWithLogos, voidFlight, hititVoidTicket, hititCancelBooking, hititIssueTicket } from '../../server/api';
import { generatePDFInvoice } from '../../components/Invoice';
import DeleteConfirmation from '../../components/modals/DeleteConfirmation';
import OtpModal from '../../components/OtpModal';
import PnrModal from '../../components/modals/PnrStatus';
import ViewBooking from '../../components/Drawers/ViewBooking';
import PrintIcon from '@mui/icons-material/Print';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { NavbarDivData } from '../../utils/DummyData';
import { NEXT_PUBLIC_PROD_IMAGE_URL } from '../../env';
import AddCardIcon from '@mui/icons-material/AddCard';
import CreditModal from '../../components/modals/CreditModal';
import { generatePDFTicket } from '../../components/utils/Ticket';

const FlightBooking = () => {
    const [activeDiv, setActiveDiv] = useState(3);
    const [activeOption, setActiveOption] = useState(0);
    const flightBookingRef = useRef({});
    const initialized = useRef(false)
    const [errors, setErrors] = useState({});
    const agentData = useSelector((state) => state.user.loginUser);
    const [selected, setSelected] = useState([]);
    const [agencies, setAgencies] = useState([]);
    const [flightBooking, setFlightBooking] = useState([])
    const [open, setOpen] = useState(false)
    const [openOtpModal, setOpenOtpModal] = React.useState(false);
    const [otp, setOtp] = React.useState(["", "", "", "", "", ""])
    const [openPnrUpdation, setOpenPnrUpdation] = React.useState(false)
    const [state, setState] = React.useState(false);
    const [openCreditModal, setOpenCreditModal] = React.useState({ value: false, pnr: null })
    const agentID = agentData;
    const dispatch = useDispatch()

    const { enqueueSnackbar } = useSnackbar();
    console.log("agentID", agentID);

    const handleInputChange = useCallback((event) => {
        const { name, value } = event.target;
        flightBookingRef.current[name] = value;
    }, []);

    const validateForm = () => {
        const newErrors = {};
        const requiredFields = ["tripID", "bookingID"];

        requiredFields.forEach((field) => {
            if (!flightBookingRef.current[field]) {
                newErrors[field] = true;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFlightBookingSearch = async () => {
        if (!validateForm()) {
            enqueueSnackbar("Please fill in all required fields.", {
                variant: "error",
            });
            return;
        }

        const body = {
            // agent_ID: agentID
        };


    };

    const fetchAllFlightBookings = async (refetch) => {
        try {
            dispatch(setLoading(true))
            const res = await getAllBookings();
            setFlightBooking(res.result)
            console.log("flight booking is 00000000000000000 ", res.result)
            console.log(flightBooking, "00000000000000000")

            if (!refetch) {
                enqueueSnackbar("Flight Search Successful!", { variant: "success" });
            }
            // Reset form or handle any post-submit actions
        } catch (error) {
            console.error("Error searching flight:", error);
            dispatch(setLoading(false))
            if (!refetch) {
                enqueueSnackbar(error, { variant: "error" });
            }
        } finally {
            dispatch(setLoading(false))
        }
    }

    const issueTicketFunction = async (id, apiName, ticketData) => {
        try {
            dispatch(setLoading(true)); // Start loading
            let res;
            if (apiName?.toLowerCase() === "hitit") {
                const hititBody = {
                    orderId: id,
                    ownerCode: "PK",
                    currency: "PKR",
                    paymentFunctions: {
                        paymentProcessingDetails: {
                            amount: `${ticketData?.finalPrice || 22520}`,
                            currency: "PKR",
                            paymentMethod: {
                                accountableDoc: {
                                    docType: "MCO",
                                    ticketId: "4000011567"
                                }
                            },
                            paymentRefID: "PaymentInfo1",
                            typeCode: "MCO"
                        }
                    }
                };
                console.log("Hitit Issue Ticket Body (B2B):", JSON.stringify(hititBody, null, 2));
                res = await hititIssueTicket(hititBody);
            } else {
                const body = { pnr: id };
                res = await issueTicket(body, (apiName === "amadeus" || apiName === "amadus") ? "flights" : apiName);
            }

            // const resData = await viewItinary(id, (ticketData?.api === "amadeus" || ticketData?.api === "amadus") ? "flights" : 'sabre')

            console.log(res, "RES");
            // const agencyLogoUrl = `${NEXT_PUBLIC_PROD_IMAGE_URL}${ticketData?.agencyId?.logo}`;
            // await generatePDFTicket(ticketData, agencyLogoUrl, flightBooking, resData?.result);

            if (apiName?.toLowerCase() === "hitit") {
                if (res?.result?.status === 'success') {
                    setOpenOtpModal(false)
                    setOtp(["", "", "", "", "", ""])
                    enqueueSnackbar(`Ticket of PNR: ${id} of ${apiName} has been issued successfully!`, { variant: "success" });
                    setOpenCreditModal({ value: true, pnr: id });
                } else {
                    console.error("Error issuing ticket:", res);
                    enqueueSnackbar(`Error issuing ticket for PNR: ${id} of ${apiName}. Please try again later.`, { variant: "error" });
                    setOpenOtpModal(false)
                    setOtp(["", "", "", "", "", ""])
                }
            } else {
                setOpenOtpModal(false)
                setOtp(["", "", "", "", "", ""])
                enqueueSnackbar(`Ticket of PNR: ${id} of ${apiName} has been issued successfully!`, { variant: "success" });
                setOpenCreditModal({ value: true, pnr: id });
            }

        } catch (error) {
            console.error("Error issuing ticket:", error);
            enqueueSnackbar(`Error issuing ticket for PNR: ${id} of ${apiName}. Please try again later.`, { variant: "error" });
            setOpenOtpModal(false)
            setOtp(["", "", "", "", "", ""])
        } finally {
            dispatch(setLoading(false)); // Stop loading after the operation is complete
            setOpenOtpModal(false)
            setOtp(["", "", "", "", "", ""])
        }
    }

    const handleOpenOtpModal = async (id, apiName) => {
        const res = await resendOtp({ email: agentData?.email });
        if (res?.message) {
            enqueueSnackbar(res?.message, { variant: "success" });
        }
        setOpenOtpModal({ value: true, flightId: id, flightApi: apiName })
    }

    function isToday(dateString) {
        // Parse the input date string into a Date object
        const inputDate = new Date(dateString);

        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to the start of today (midnight)

        // Set the input date to the start of the day (ignoring time)
        inputDate.setHours(0, 0, 0, 0);

        // Check if the input date is today
        return inputDate.getTime() === today.getTime();
    }

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            fetchAllFlightBookings()
        }
    }, [])

    const handlePrintInvoice = async (invoiceData) => {
        dispatch(setLoading(true))

        // Hit the "old" API first to get basic data for everyone
        let resData = await viewItinaryWithLogos(invoiceData?.id);

        // If it's Sabre, hit the "new" API as well to get the live paymentDeadline
        if (invoiceData?.api?.toLowerCase() === 'sabre') {
            try {
                const liveData = await viewItinary(invoiceData?.id, 'sabre');
                const liveBooking = liveData?.result?.data || liveData?.result;

                if (liveBooking?.paymentDeadline && resData?.message?.booking) {
                    // Extract and format deadline from live data
                    const deadline = liveBooking.paymentDeadline?.expiryDateTime ||
                        (liveBooking.paymentDeadline?.expiryDate && liveBooking.paymentDeadline?.expiryTime ?
                            `${liveBooking.paymentDeadline.expiryDate}T${liveBooking.paymentDeadline.expiryTime}` :
                            liveBooking.paymentDeadline);

                    // Merge live deadline into our main response data
                    resData.message.booking.paymentDeadline = deadline;
                    console.log("[Sabre PDF] Successfully integrated live paymentDeadline:", deadline);
                }
            } catch (err) {
                console.warn("[Sabre PDF] Live viewItinary call failed, using stored data only.", err);
            }
        }

        // Log the raw API response data
        console.log("API Response Data:", resData);
        if (resData?.message) {
            console.log("Message Data:", resData.message);
            console.log("Booking Data:", resData.message.booking);
            console.log("Agency Data:", resData.message.agency);
            console.log("Airline Details:", resData.message.airlineDetails);
        }

        const agencyLogoUrl = resData?.message?.agency?.logoUrl || `${NEXT_PUBLIC_PROD_IMAGE_URL}${invoiceData?.agencyId?.logo}`;

        // Log the agency logo URL
        console.log("Agency Logo URL:", agencyLogoUrl);

        try {
            // Create a compatible structure for the PDF generation
            const formattedData = {
                data: {
                    ...resData?.message?.booking,
                    agency: {
                        agencyName: resData?.message?.agency?.name,
                        agencyEmail: resData?.message?.agency?.email,
                        phoneNumber: resData?.message?.agency?.phone,
                        address: ""
                    },
                    flights: resData?.message?.airlineDetails || [],
                    allSegments: resData?.message?.airlineDetails || [],
                    fares: [{
                        totals: {
                            subtotal: resData?.message?.booking?.orignalPrice,
                            total: resData?.message?.booking?.finalPrice
                        }
                    }],
                    fareOffers: [{
                        cabinBaggageAllowance: {
                            baggagePieces: [{
                                maximumWeightInKilograms: 7
                            }]
                        },
                        checkedBaggageAllowance: {
                            totalWeightInKilograms: 20
                        }
                    }]
                }
            };

            // Log the formatted data
            console.log("Formatted Data for PDF:", formattedData);

            await generatePDFTicket(invoiceData, resData, agencyLogoUrl, formattedData);
            dispatch(setLoading(false))
            enqueueSnackbar("Invoice PDF generated successfully", { variant: "success" });
        } catch (error) {
            dispatch(setLoading(false))
            console.error("Error generating PDF:", error);
            enqueueSnackbar("Error generating PDF invoice: " + error.message, { variant: "error" });
        }
    };

    const handleDelete = async (flight) => {
        try {
            dispatch(setLoading(true))
            let res;
            let statusName;
            if (flight?.status === 'confirmed') {
                if (flight?.api?.toLowerCase() === 'hitit') {
                    const voidBody = {
                        orderId: flight?.id,
                        ticketDocNbr: flight?.ticket?.[0]?.ticketDocNbr || "2142417468658" // Use dynamic value if available in flight object
                    };
                    res = await hititVoidTicket(voidBody);
                    statusName = 'Voided';
                } else if (isToday(flight?.createdAt)) {
                    res = await voidFlight(flight?.id, flight?.api === 'Sabre' ? 'sabre' : 'flights')
                    statusName = 'Voided';
                } else {
                    res = await refundFlight(flight?.id, flight?.api === 'Sabre' ? 'sabre' : 'flights')
                    statusName = 'Refunded';
                }
                dispatch(setLoading(false))
            } else if (flight?.status === "hold" || flight?.status === "voided") {
                if (flight?.api?.toLowerCase() === 'hitit') {
                    const cancelBody = {
                        orderId: flight?.id,
                        action: "COMMIT",
                        ownerCode: "PK",
                        currency: "PKR"
                    };
                    res = await hititCancelBooking(cancelBody);
                } else {
                    res = await cancelBooking(flight?.id, flight?.api === 'Sabre' ? 'sabre' : 'flights');
                }
                statusName = 'Cancelled'
                dispatch(setLoading(false))
            } else {
                enqueueSnackbar('Flight Status are not available', { variant: "error" });
                dispatch(setLoading(false))
                return;
            }
            if (res?.status === "success") {
                enqueueSnackbar(`Flight Booking ${statusName} Successful!`, { variant: "success" });
                fetchAllFlightBookings(true)
                dispatch(setLoading(false))
            } else {
                enqueueSnackbar(res?.status || 'Something went wrong 1', { variant: "error" });
                dispatch(setLoading(false))
            }
        } catch (e) {
            console.log(e)
            enqueueSnackbar(e || `Something went wrong!`, { variant: "error" });
            dispatch(setLoading(false))
        }

        setOpen(false)
    }

    const handleOpenPnrStatusModal = () => {
        setOpenPnrUpdation(true)
    }

    const toggleDrawer = (open, id, apiName) => async (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        if (!open) {
            setState(false);
            return;
        }

        setState({ value: open, id, api: apiName })
    };

    function RowMenu({ flight, setOpen, setOpenOtpModal }) {
        console.log(flight, '******************')
        return (
            <>
                <Tooltip
                    arrow={false}
                    color="neutral"
                    size="md"
                    variant="solid"
                    title="View Detail"
                >
                    <RemoveRedEyeIcon onClick={toggleDrawer(true, flight.id, flight.api)} sx={{ fontSize: '25px', cursor: 'pointer', marginRight: '5px' }} />
                </Tooltip>

                {!['canceled', 'voided']?.includes(flight?.status) && (
                    <Tooltip
                        arrow={false}
                        color="neutral"
                        size="md"
                        variant="solid"
                        title="Print Invoice"
                    >
                        <PrintIcon onClick={() => handlePrintInvoice(flight)} sx={{ fontSize: '25px', cursor: 'pointer', mr: 1 }} />
                    </Tooltip>
                )}

                {!['canceled', 'voided', 'confirmed']?.includes(flight?.status) && (
                    <Tooltip
                        arrow={false}
                        color="neutral"
                        size="md"
                        variant="solid"
                        title="Issue Ticket"
                    >
                        <ReceiptLongIcon onClick={() => issueTicketFunction(flight.id, flight.api, flight)} sx={{ fontSize: '25px', cursor: 'pointer', mr: 1 }} />
                    </Tooltip>
                )}

                {flight?.status && flight?.status !== "canceled" && (
                    <Tooltip
                        arrow={false}
                        color="danger"
                        size="md"
                        variant="solid"
                        title={`${flight?.status === 'confirmed' ? 'Void' : flight?.status === 'voided' || flight?.status === 'refunded' || flight?.status === 'hold' ? 'Cancel' : flight?.status === 'confirmed' ? 'Void' : 'N/A'} Booking`}
                    >
                        <EventBusyIcon onClick={() => { setOpen({ modal: true, flightId: flight?._id, api: flight?.api, flight }) }} sx={{ fontSize: '25px', cursor: 'pointer' }} />
                    </Tooltip>
                )}

                {['confirmed']?.includes(flight?.status) && (
                    <Tooltip
                        arrow={false}
                        color="neutral"
                        size="md"
                        variant="solid"
                        title="Add Credit"
                    >
                        <AddCardIcon onClick={() => setOpenCreditModal({ value: true, pnr: flight.id, isEdit: true })} sx={{ fontSize: '25px', cursor: 'pointer', mr: 1 }} />
                    </Tooltip>
                )}
            </>
        );
    }

    return (
        <>
            <B2bHeader divs={NavbarDivData} activeDiv={activeDiv} setActiveDiv={setActiveDiv} activeOption={activeOption} setActiveOption={setActiveOption} showDiv={true} hidePromotion={true} />

            <Box sx={{ margin: 3 }}>
                <Table
                    aria-labelledby="tableTitle"
                    // stickyHeader
                    hoverRow
                    sx={{
                        "--TableCell-headBackground":
                            "var(--joy-palette-background-level1)",
                        "--Table-headerUnderlineThickness": "1px",
                        "--TableRow-hoverBackground":
                            "var(--joy-palette-background-level1)",
                        "--TableCell-paddingY": "4px",
                        "--TableCell-paddingX": "8px",
                    }}
                >
                    <thead>
                        <tr>
                            {/* <th>
                <Checkbox
                  size="sm"
                  indeterminate={
                    selected.length > 0 && selected.length !== agencies.length
                  }
                  checked={selected.length === agencies.length}
                  onChange={(event) =>
                    setSelected(
                      event.target.checked ? agencies.map((row) => row.id) : []
                    )
                  }
                />
              </th> */}
                            <th style={{ textAlign: 'center' }}>ID</th>
                            <th style={{ textAlign: 'center' }}>Traveller Name</th>
                            <th style={{ textAlign: 'center' }}>Ticket Price</th>
                            <th style={{ textAlign: 'center' }}>Ticket Date</th>
                            <th style={{ textAlign: 'center' }}>Booking Date</th>
                            <th style={{ textAlign: 'center' }}>Airline Code</th>
                            <th style={{ textAlign: 'center' }}>Type</th>
                            <th style={{ textAlign: 'center' }}>Status</th>
                            <th style={{ textAlign: 'center' }}>PNR</th>
                            <th style={{ textAlign: 'center' }}>Action</th>



                        </tr>
                    </thead>
                    {flightBooking.length > 0 ? (
                        <tbody>
                            {flightBooking.map(
                                (row) => (
                                    <tr key={row._id}>
                                        {/* <td>
                      <Checkbox
                        size="sm"
                        checked={selected.includes(row.userName)}
                        onChange={(event) =>
                          setSelected(
                            event.target.checked
                              ? [...selected, row.userName]
                              : selected.filter((name) => name !== row.userName)
                          )
                        }
                      />
                    </td> */}
                                        <td style={{ textAlign: 'center', cursor: 'pointer', display: 'flex', justifyContent: row.id ? 'space-between' : 'center', alignItems: 'center' }}>
                                            <Tooltip title={row._id} variant="solid" sx={{ marginRight: '10px' }}>
                                                <span>{row._id?.slice(-6)}</span>
                                            </Tooltip>
                                            <ContentCopyIcon sx={{ marginLeft: '10x', cursor: 'pointer' }} onClick={() => copyToClipboard(row._id, 'Booking ID')} />
                                        </td>
                                        <td style={{ textAlign: 'center' }}>{row.travelers[0]?.name?.lastName || row.travelers[0]?.name?.firstName ? `${row.travelers[0]?.name?.lastName}/${row.travelers[0]?.name?.firstName}` : 'N/A'}</td>
                                        <td style={{ textAlign: 'center' }}>{row?.finalPrice ? `RS. ${row?.finalPrice}` : 'N/A'}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            {row?.api?.toLowerCase() === 'hitit'
                                                ? (row.departure?.[0]?.departureTime ? formatDate(row.departure[0].departureTime) : 'N/A')
                                                : (row.flightOffers[0]?.itineraries[0]?.segments[0]?.departure?.at ? formatDate(row.flightOffers[0]?.itineraries[0]?.segments[0]?.departure?.at) : 'N/A')
                                            }
                                        </td>
                                        <td style={{ textAlign: 'center' }}>{row.createdAt ? formatDate(row.createdAt) : 'N/A'}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            {row?.api?.toLowerCase() === 'hitit'
                                                ? (row.departure?.[0]?.marketingCarrier && row.departure?.[0]?.marketingFlightNumber
                                                    ? `${row.departure[0].marketingCarrier}-${row.departure[0].marketingFlightNumber}`
                                                    : row.departure?.[0]?.marketingCarrier || 'N/A')
                                                : ((row?.api === "amadeus" || row?.api === "amadus")
                                                    ? `${row.flightOffers[0]?.itineraries[0]?.segments[0]?.carrierCode}-${row.flightOffers[0]?.itineraries[0]?.segments[0].number}`
                                                    : row.flightOffers[0]?.itineraries[0]?.segments[0]?.carrierCode && row.flightOffers[0]?.itineraries[0]?.segments[0].number
                                                        ? `${row.flightOffers[0]?.itineraries[0]?.segments[0]?.carrierCode}-${row.flightOffers[0]?.itineraries[0]?.segments[0].number}`
                                                        : row.flightOffers[0]?.itineraries[0]?.segments[0]?.operating?.carrierCode && row.flightOffers[0]?.itineraries[0]?.segments[0].carrierCode
                                                            ? `${row.flightOffers[0]?.itineraries[0]?.segments[0]?.operating?.carrierCode}-${row.flightOffers[0]?.itineraries[0]?.segments[0].carrierCode}`
                                                            : 'N/A')
                                            }
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            {row?.bookingType ? (
                                                <Chip
                                                    color={row.bookingType === "online" ? "primary" : "neutral"}
                                                    variant="solid"
                                                >
                                                    {row.bookingType === "online" ? "Online" : "Offline"}
                                                </Chip>
                                            ) : 'N/A'}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>{row?.status === "hold" ? <Chip
                                            color="warning"
                                            variant="solid"
                                        >
                                            Hold
                                        </Chip> : row?.status === "canceled" ? <Chip
                                            color="danger"
                                            variant="solid"
                                        >
                                            Cancelled
                                        </Chip> : row?.status === "voided" ? <Chip
                                            color="danger"
                                            variant="solid"
                                        >
                                            Voided
                                        </Chip> : row?.status === "confirmed" ? <Chip
                                            color="success"
                                            variant="solid"
                                        >
                                            Issued
                                        </Chip> : row?.status === "refunded" ? <Chip
                                            color="danger"
                                            variant="solid"
                                        >
                                            Refunded
                                        </Chip> : <Chip
                                            color="warning"
                                            variant="solid"
                                        >
                                            N/A
                                        </Chip>}</td>
                                        <td style={{ textAlign: 'center', display: 'flex', justifyContent: row.id ? 'space-between' : 'center', alignItems: 'center' }}>
                                            {(row?.api === "amadeus" || row?.api === "amadus") && row?.reference ? truncateString(row.reference, 17) : (row?.api === "Sabre" || row?.api?.toLowerCase() === "hitit") && row?.id ? truncateString(row.id, 17) : 'N/A'}
                                            {((row?.api === "amadeus" || row?.api === "amadus") && row?.reference || (row?.api === "Sabre" || row?.api?.toLowerCase() === "hitit") && row?.id) && (
                                                <ContentCopyIcon sx={{ marginLeft: '5x', cursor: 'pointer' }} onClick={() => copyToClipboard((row?.api === "amadeus" || row?.api === "amadus") && row?.reference ? row?.reference : (row?.api === "Sabre" || row?.api?.toLowerCase() === "hitit") && row?.id ? row.id : null, 'PNR number')} />
                                            )}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <RowMenu flight={row} setOpen={setOpen} setOpenOtpModal={setOpenOtpModal} />
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    ) : (
                        <Typography level="h1" sx={{ textAlign: 'center', width: '140vh', mt: 6 }}> No Data Found!</Typography>
                    )}
                </Table>
            </Box>

            {open?.modal && (
                <DeleteConfirmation open={open?.modal} setOpen={setOpen} handleDelete={handleDelete} description={`Are you sure you want to ${open?.flight?.status === "hold" || open?.flight?.status === 'confirmed' || open?.flight?.status === 'voided' ? 'cancelled' : 'N/A'} this booking?`} flight={open?.flight} />
            )}
            {/* <OtpModal {...{ open: openOtpModal?.value, setOpen: setOpenOtpModal, flightId: openOtpModal?.flightId, apiName: openOtpModal?.flightApi, handleSubmit: issueTicketFunction, otp, setOtp, email: agentData?.email }} /> */}
            <PnrModal {...{ open: openPnrUpdation, setOpen: setOpenPnrUpdation, refetch: fetchAllFlightBookings }} />
            {state?.value && (
                <ViewBooking {...{ state: state?.value, setState, toggleDrawer, id: state?.id, api: state?.api }} />
            )}

            {openCreditModal?.value && (
                <CreditModal {...{ open: openCreditModal?.value, setOpen: setOpenCreditModal, pnr: openCreditModal?.pnr, isEdit: openCreditModal?.isEdit }} />
            )}
        </>
    )
}

export default FlightBooking