import React, { useRef, useCallback, useState, useEffect } from "react";
import Divider from "@mui/joy/Divider";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Link from "@mui/joy/Link";
import Checkbox from "@mui/joy/Checkbox";
import InputField from "../../components/common/InputField";
import FormSelect from "../../components/common/FormSelect";
import FormCheckBox from "../../components/common/Checkbox";
import Tooltip from '@mui/joy/Tooltip';
import Chip from '@mui/joy/Chip';
import AppButton from "../../components/common/AppButton";
import { cancelBooking, getAllBookings, getFlightBooking, issueTicket, refundFlight, resendOtp, viewItinary, voidFlight, hititCancelBooking, hititVoidTicket } from "../../server/api";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { formatDate } from "../../components/utils";
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import IconButton from '@mui/joy/IconButton';
import { generatePDFInvoice } from "../../components/Invoice";
import { copyToClipboard, truncateString } from "../../utils/HelperFunctions";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { NEXT_PUBLIC_PROD_IMAGE_URL } from '../../env';
import DeleteConfirmation from "../../components/modals/DeleteConfirmation";
import { setLoading } from "../../redux/reducer/loaderSlice";
import PrintIcon from '@mui/icons-material/Print';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { generatePDFTicket } from "../../components/utils/Ticket";
import OtpModal from "../../components/OtpModal";
import PnrModal from "../../components/modals/PnrStatus";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ViewBooking from "../../components/Drawers/ViewBooking";
import { Typography } from "@mui/joy";
import CreditModal from "../../components/modals/CreditModal";
import AddCardIcon from '@mui/icons-material/AddCard';

const FlightBooking = () => {
  const flightBookingRef = useRef({ bookingId: "", pnr: "" });
  const [formValues, setFormValues] = useState({
    pnr: "",
    bookingId: "",
  });

  const initialized = useRef(false)
  const [errors, setErrors] = useState({});
  const agentData = useSelector((state) => state.user.loginUser);
  const [selected, setSelected] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [flightBooking, setFlightBooking] = useState([])
  const [allFlightBooking, setAllFlightBooking] = useState([])
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value, // dynamically update the specific field
    }));
  };


  const validateForm = () => {
    return Object.keys(flightBookingRef.current).length === 0;
  };

  const handleFlightBookingSearch = async () => {
    if (validateForm()) {
      enqueueSnackbar("Please fill in any field.", {
        variant: "error",
      });
      return;
    }

    const bookingId = formValues?.bookingId;
    const pnr = formValues?.pnr;

    // Filter based on bookingId (_id) and pnr (id or reference)
    const filterBookings = flightBooking?.filter((item) => {
      if (bookingId && pnr) {
        // If both bookingId and pnr exist, check both
        return item?._id === bookingId && (item?.id === pnr || item?.reference === pnr);
      } else if (bookingId) {
        // If only bookingId exists, filter based on _id
        return item?._id === bookingId;
      } else if (pnr) {
        // If only pnr exists, filter based on id or reference
        return item?.id === pnr || item?.reference === pnr;
      }
      return false; // Default case if neither bookingId nor pnr exist
    });

    setFlightBooking(filterBookings)
  };

  const handleReset = () => {
    setFlightBooking(allFlightBooking); // Reset flightBooking state
    flightBookingRef.current = { bookingId: "", pnr: "" }; // Reset the ref

    // Reset form field values
    setFormValues({
      pnr: "",
      bookingId: "",
    });
  };


  const fetchAllFlightBookings = async (refetch) => {
    try {
      dispatch(setLoading(true))
      const res = await getAllBookings();
      setFlightBooking(res.result)
      setAllFlightBooking(res.result)
      // console.log("flight booking is ", res.result)
      if (!refetch) {
        enqueueSnackbar("Flight Search Successful!", { variant: "success" });
      }
      // Reset form or handle any post-submit actions
    } catch (error) {
      console.error("Error searching flight:", error);
      dispatch(setLoading(false))
      if (!refetch) {
        enqueueSnackbar("Error searching flight", { variant: "error" });
      }
    } finally {
      dispatch(setLoading(false))
    }
  }

  const issueTicketFunction = async (id, apiName, otp, ticketData) => {
    let resData;
    try {
      dispatch(setLoading(true)); // Start loading
      // Make the API call
      viewItinary(id, apiName)
        .then((res) => {
          if (res?.status === "fail") {
            // If the response has a status 'fail', handle it accordingly
            console.error("Error:", res.message);
            resData = null;
            // Clear previous data or set it as appropriate
          } else {
            // Handle success case
            // console.log(res);
            resData = res?.result;

            // Set response data
          }
        })
        .catch((error) => {
          // Handle network or other unexpected errors
          console.error("API call failed:", error);
          resData = null;  // Handle error appropriately
        }).finally(async () => {
          const body = { pnr: id };
          const res = await issueTicket(body, (apiName === "amadeus" || apiName === "amadus") ? "flights" : apiName);
          // console.log(res, "RES");
          // console.log(ticketData, '*************************', "RES DATA:", resData)
          const agencyLogoUrl = `${NEXT_PUBLIC_PROD_IMAGE_URL}${ticketData?.agencyId?.logo}`;
          await generatePDFTicket(ticketData, agencyLogoUrl, flightBooking, resData);
          setOpenOtpModal(false)
          setOtp(["", "", "", "", "", ""])
          enqueueSnackbar(`Ticket of PNR: ${id} of ${apiName} has been issued successfully!`, { variant: "success" });
          setOpenCreditModal({ value: true, pnr: id });
        })
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

  const handleOpenOtpModal = async (id, apiName, flight) => {
    const res = await resendOtp({ email: agentData?.email });
    if (res?.message) {
      enqueueSnackbar(res?.message, { variant: "success" });
    }
    setOpenOtpModal({ value: true, flightId: id, flightApi: apiName, flight })
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
    const resData = await viewItinary(invoiceData?.id, (invoiceData?.api === "amadeus" || invoiceData?.api === "amadus") ? "flights" : 'sabre')
    const agencyLogoUrl = `${NEXT_PUBLIC_PROD_IMAGE_URL}${invoiceData?.agencyId?.logo}`; // Replace with actual logo URL
    try {
      await generatePDFTicket(invoiceData, agencyLogoUrl, null, resData?.result, null, invoiceData?.api === "amadeus" || invoiceData?.api === "amadus");
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
      let res;
      let statusName;
      if (isToday(flight?.createdAt) && flight?.status === 'confirmed') { //Check if ticket is cancelling it on today then hit this API
        res = await voidFlight(flight?.id, flight?.api === 'Sabre' ? 'sabre' : 'flights')
        statusName = 'Voided'
      } else if (!isToday(flight?.createdAt) && flight?.status === 'confirmed') {
        res = await refundFlight(flight?.id, flight?.api === 'Sabre' ? 'sabre' : 'flights')
        statusName = 'Refunded'
      } else if (flight?.status === "hold") {
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
      } else {
        enqueueSnackbar('Flight Status are not available', { variant: "error" });
        return;
      }
      if (res?.status === "success") {
        enqueueSnackbar(`Flight Booking ${statusName} Successful!`, { variant: "success" });
        fetchAllFlightBookings(true)
      } else {
        enqueueSnackbar(res?.status || 'Something went wrong 1', { variant: "error" });
      }
    } catch (e) {
      console.log(e)
      enqueueSnackbar(e || `Something went wrong!`, { variant: "error" });
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
    // console.log(flight, '******************')
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

        {!['canceled', 'confirmed', 'voided']?.includes(flight?.status) && (
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
    <div>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {formFields.map(
          ({ component: Field, label, name, error, placeholder }, index) => (
            <Box
              key={index}
              sx={{
                flexBasis: "calc(33.333% - 16px)",
                flexGrow: 0,
                flexShrink: 0,
              }}
            >
              <Field
                label={label}
                name={name}
                fullWidth
                value={formValues[name]} // bind value to formValues state
                onChange={handleInputChange} // handle input changes
                error={error}
                placeholder={placeholder}
              />
            </Box>
          )
        )}

        <AppButton
          text="Search"
          variant="solid"
          color="#fff"
          bgColor="#185ea5"
          onClick={handleFlightBookingSearch}
        />

        <AppButton
          text="Reset"
          variant="solid"
          color="#fff"
          bgColor="#185ea5"
          onClick={handleReset}
        />
      </Box>
      {/* <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          mt: 3,
        }}
      >
        <FormCheckBox label="Is Pay at Agency" />
        <FormCheckBox label="Is Import PNR" />
        <FormCheckBox label="Is Promo Code Applied" />
      </Box> */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mt: 3,
          justifyContent: 'flex-end'
        }}
      >
        {/* <AppButton
          text="Reset"
          variant="outlined"
          color="#185ea5"
          bgColor="#185ea5"
        /> */}

        <AppButton
          text="Update PNR Status"
          variant="solid"
          color="#fff"
          bgColor="#185ea5"
          onClick={handleOpenPnrStatusModal}
        />
      </Box>
      {/* {console.log(flightBookingRef)} */}

      <Divider sx={{ mt: 3 }} />

      <Sheet
        className="OrderTableContainer"
        // variant="outlined"
        sx={{
          display: { xs: "none", sm: "initial" },
          width: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
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
                    <td style={{ textAlign: 'center' }}>{row.flightOffers[0]?.itineraries[0]?.segments[0]?.departure?.at ? formatDate(row.flightOffers[0]?.itineraries[0]?.segments[0]?.departure?.at) : 'N/A'}</td>
                    <td style={{ textAlign: 'center' }}>{row.createdAt ? formatDate(row.createdAt) : 'N/A'}</td>
                    <td style={{ textAlign: 'center' }}>{(row?.api === "amadeus" || row?.api === "amadus") ? `${row.flightOffers[0]?.itineraries[0]?.segments[0]?.carrierCode}-${row.flightOffers[0]?.itineraries[0]?.segments[0].number}` : row.flightOffers[0]?.itineraries[0]?.segments[0]?.operating?.carrierCode && row.flightOffers[0]?.itineraries[0]?.segments[0].carrierCode ? `${row.flightOffers[0]?.itineraries[0]?.segments[0]?.operating?.carrierCode}-${row.flightOffers[0]?.itineraries[0]?.segments[0].carrierCode}` : 'N/A'}</td>
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
                      {(row?.api === "amadeus" || row?.api === "amadus") && row?.reference ? truncateString(row.reference, 17) : row?.api === "Sabre" && row?.id ? truncateString(row.id, 17) : 'N/A'}
                      {((row?.api === "amadeus" || row?.api === "amadus") && row?.reference || row?.api === "Sabre" && row?.id) && (
                        <ContentCopyIcon sx={{ marginLeft: '5x', cursor: 'pointer' }} onClick={() => copyToClipboard((row?.api === "amadeus" || row?.api === "amadus") && row?.reference ? row?.reference : row?.api === "Sabre" && row?.id ? row.id : null, 'PNR number')} />
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
      </Sheet>
      {open?.modal && (
        <DeleteConfirmation open={open?.modal} setOpen={setOpen} handleDelete={handleDelete} description={`Are you sure you want to ${open?.flight?.status === "hold" || open?.flight?.status === 'confirmed' ? 'cancelled' : 'N/A'} this booking?`} flight={open?.flight} />
      )}
      {/* <OtpModal {...{ open: openOtpModal?.value, setOpen: setOpenOtpModal, flightId: openOtpModal?.flightId, apiName: openOtpModal?.flightApi, handleSubmit: issueTicketFunction, otp, setOtp, email: agentData?.email, flight: openOtpModal?.flight }} /> */}
      <PnrModal {...{ open: openPnrUpdation, setOpen: setOpenPnrUpdation, refetch: fetchAllFlightBookings }} />
      {state?.value && (
        <ViewBooking {...{ state: state?.value, setState, toggleDrawer, id: state?.id, api: state?.api }} />
      )}

      {openCreditModal?.value && (
        <CreditModal {...{ open: openCreditModal?.value, setOpen: setOpenCreditModal, pnr: openCreditModal?.pnr, isEdit: openCreditModal?.isEdit }} />
      )}
    </div>
  );
};

export default FlightBooking;



const formFields = [
  // {
  //   component: InputField,
  //   label: "Traveller Name",
  //   name: "tripID",
  //   // error: errors.tripID,
  // },
  // {
  //   component: InputField,
  //   label: "Booking ID",
  //   name: "bookingID",
  //   error: errors.bookingID,
  // },
  // {
  //   component: InputField,
  //   label: "Session ID",
  //   name: "sessionID",
  //   error: errors.sessionID,
  // },
  // {
  //   component: InputField,
  //   label: "Payment Transaction ID",
  //   name: "paymentTransactionID",
  //   error: errors.paymentTransactionID,
  // },
  // {
  //   component: FormSelect,
  //   label: "Agency Type",
  //   name: "agencyType",
  //   error: errors.agencyType,
  // },
  // {
  //   component: FormSelect,
  //   label: "Agency",
  //   name: "agency",
  //   error: errors.agency,
  //   placeholder: "Please enter 3 or more characters",
  // },
  // {
  //   component: InputField,
  //   label: "Supplier Ref/PNR",
  //   name: "supplierRefPNR",
  //   error: errors.supplierRefPNR,
  // },
  // {
  //   component: InputField,
  //   label: "Ticket Number",
  //   name: "ticketNumber",
  //   error: errors.ticketNumber,
  // },
  // {
  //   component: FormSelect,
  //   label: "Suppliers",
  //   name: "suppliers",
  //   error: errors.suppliers,
  //   placeholder: "All supplier",
  // },
  // {
  //   component: InputField,
  //   label: "Pax Name",
  //   name: "paxName",
  //   error: errors.paxName,
  // },
  // {
  //   component: InputField,
  //   label: "Contact No.",
  //   name: "contactNo",
  //   error: errors.contactNo,
  // },
  {
    component: InputField,
    label: "PNR",
    name: "pnr",
    // error: errors.email,
  },
  {
    component: InputField,
    label: "Booking ID",
    name: "bookingId",
    // error: errors.email,
  },
  // {
  //   component: FormSelect,
  //   label: "Ancillary Booking Status",
  //   name: "ancillaryBookingStatus",
  //   error: errors.ancillaryBookingStatus,
  // },
  // {
  //   component: FormSelect,
  //   label: "Booking Status",
  //   name: "bookingStatus",
  //   error: errors.bookingStatus,
  // },
  // {
  //   component: FormSelect,
  //   label: "Invoice Status",
  //   name: "invoiceStatus",
  //   error: errors.invoiceStatus,
  // },
  // {
  //   component: FormSelect,
  //   label: "Payment Mode",
  //   name: "paymentMode",
  //   error: errors.paymentMode,
  // },
  // {
  //   component: FormSelect,
  //   label: "Payment Status",
  //   name: "paymentStatus",
  //   error: errors.paymentStatus,
  // },
  // {
  //   component: FormSelect,
  //   label: "Fare Type",
  //   name: "fareType",
  //   error: errors.fareType,
  // },
  // {
  //   component: FormSelect,
  //   label: "Date Type",
  //   name: "dateType",
  //   error: errors.dateType,
  //   placeholder: "Booking Date",
  // },
  // {
  //   component: InputField,
  //   label: "From Date",
  //   name: "fromDate",
  //   error: errors.fromDate,
  //   placeholder: "Select Date",
  // },
  // {
  //   component: InputField,
  //   label: "To Date",
  //   name: "toDate",
  //   error: errors.toDate,
  //   placeholder: "Select Date",
  // },
  // {
  //   component: InputField,
  //   label: "Promo Code",
  //   name: "promoCode",
  //   error: errors.promoCode,
  // },
  // {
  //   component: FormSelect,
  //   label: "Risk Criteria",
  //   name: "riskCriteria",
  //   error: errors.riskCriteria,
  // },
  // {
  //   component: FormSelect,
  //   label: "Assign User",
  //   name: "assignUser",
  //   error: errors.assignUser,
  //   placeholder: "Search",
  // },
];
