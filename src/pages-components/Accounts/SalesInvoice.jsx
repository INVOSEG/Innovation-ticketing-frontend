import {
  Box,
  Button,
  FormControl,
  Modal,
  ModalClose,
  Option,
  Select,
  Sheet,
  Typography,
} from "@mui/joy";
import React, { useState, useCallback, useEffect } from "react";
import InputField from "../../components/common/InputField";
import SearchSelect from "../../components/common/SearchSelect";
import TicketBooking from "../../components/utils/ticketBooking";
import axios from "axios";
import AppDatePicker from "../../components/common/AppDatePicker";
import SearchIcon from "@mui/icons-material/Search";
import AddEditForm from "../../components/utils/AddEditFormTraveller";
import { NEXT_PUBLIC_PROD_URL } from "../../env";

const SalesInvoice = () => {
  const [selectedPayMode, setSelectedPayMode] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [modalType, setModalType] = useState("Add"); // Add or Edit
  const [ticketData, setTicketData] = useState({
    code: "",
    pnr: "",
    pax: "",
    sector: "",
    type: "",
    gds: "",
    commision: "",
    fare: "",
    markup: "",
    markupType: "",
    adjDate: "",
    invDate: "",
    airline: "",
    ticketNo: "",
    sectorDetails: [],
    invNo: "",
    NTNnumber: "",
    departureDate: "",
    fare: "",
  });
  const [selectedVisitType, setSelectedVisitType] = useState();
  const [selectedCustomer, setSelectedCustomer] = useState({
    title: "",
    code: "",
  });
  const [open, setOpen] = useState(false);
  const [currentTraveller, setCurrentTraveller] = useState(null);

  useEffect(() => {
    getInvNumber();

    setTicketData((prevState) => ({
      ...prevState,
      invDate: prevState.invDate || new Date().toDateString(),
    }));
    console.log(ticketData?.invDate);
  }, []);
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setTicketData((prevState) => ({
      ...prevState,
      invDate: today, // Set today's date
    }));
  }, []);
  console.log("ticketData", ticketData);

  const getInvNumber = async () => {
    const response = await axios.get(
      `${NEXT_PUBLIC_PROD_URL}sale/getInvoiceNumber`
    );
    const invoiceNumber = response.data.result.latestInvoice;
    setTicketData((prevState) => ({
      ...prevState,
      invNo: invoiceNumber,
    }));
  };

  const handlePayModeChange = (selectedPayMode) => {
    setSelectedPayMode(selectedPayMode);
    console.log("Selected:", selectedPayMode);
  };

  const handleStatusChange = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    console.log("Selected:", selectedStatus);
  };

  const loadCustomerOptions = useCallback(async (inputValue) => {
    if (inputValue.length < 3) return [];
    try {
      const response = await axios.get(
        `${NEXT_PUBLIC_PROD_URL}customer/getAllCustomer`
      );
      console.log("Customer API Response:", response);

      return response.data.result.map((data) => ({
        label: `${data.title} ${data.code}`,
        value: {
          title: data.title,
          code: data.code,
          NTNnumber: data.NTNNumber,
        },
      }));
    } catch (error) {
      console.error("Error fetching customer options:", error);
      return [];
    }
  }, []);

  const handleCustomerSelection = (selectedOption) => {
    if (selectedOption) {
      const { title, code, NTNnumber } = selectedOption.value;
      setSelectedCustomer({ title, code });

      setTicketData((prevState) => ({
        ...prevState,
        NTNnumber: NTNnumber || "",
      }));
    } else {
      setSelectedCustomer({ title: "", code: "" });
      setTicketData((prevState) => ({
        ...prevState,
        NTNnumber: "",
      }));
    }
  };

  const loadVisitTypeOptions = useCallback(async () => {
    try {
      const response = await axios.get(
        `${NEXT_PUBLIC_PROD_URL}visitType/getAll`
      );

      return response.data.result.map((data) => ({
        label: `${data.title} ${data.description}`,
        value: { title: data.title, code: data.description },
      }));
    } catch (error) {
      console.error("Error fetching customer options:", error);
      return [];
    }
  }, []);

  const handleVisitTypeSelection = (selectedOption) => {
    if (selectedOption) {
      setSelectedVisitType(selectedOption.value);
    } else {
      setSelectedVisitType({ title: "", description: "" });
    }
  };

  const loadTicketDetails = useCallback(async (currentTicketNo) => {
    if (!currentTicketNo) {
      console.error("No ticket number provided");
      return;
    }

    try {
      const response = await axios.get(
        `${NEXT_PUBLIC_PROD_URL}sabre/ticketStatus/${currentTicketNo}`
      );

      console.log("API Response for Ticket Details:", response.data.result);
      const ticketResponse = response.data.result;
      console.log(
        ticketResponse.flightOffers[0]?.itineraries[0]?.segments[0]?.departure
          ?.at
      );

      setTicketData((prevState) => ({
        ...prevState,
        pnr: ticketResponse.pnr || "",
        pax: ticketResponse.userDetails?.firstName || "",
        sector:
          ticketResponse.flightOffers[0]?.itineraries[0]?.segments?.length ||
          "",
        gds: ticketResponse.GDS || "",
        airline: ticketResponse.airline || "",
        commision: ticketResponse.commission || "",
        fare: ticketResponse.finalPrice || "",
        markup: ticketResponse.markupAmount || "",
        markupType: ticketResponse.markupType || "",
        sectorDetails:
          ticketResponse.flightOffers[0]?.itineraries[0]?.segments || "",
        departureDate:
          ticketResponse.flightOffers[0]?.itineraries[0]?.segments[0]?.departure
            ?.at,
      }));
    } catch (error) {
      console.error("Error fetching ticket details:", error);
    }
  }, []);

  const loadTravellerDetails = useCallback(async () => {
    const { code } = ticketData;

    if (!code) {
      console.error("No code number provided");
      return;
    }

    try {
      const response = await axios.get(
        `${NEXT_PUBLIC_PROD_URL}traveller/search?query=${code}`
      );

      console.log("API Response for Ticket Details:", response.data.result);

      const codeResponse = response.data.result[0];
      console.log(codeResponse);
      setTicketData((prevState) => ({
        ...prevState,
        pax: `${codeResponse.firstname} ${codeResponse.lastname}`,
        type: codeResponse.paxType,
      }));
      console.log(ticketData.pax, ticketData.type);
    } catch (error) {
      console.error("Error fetching ticket details:", error);
    }
  }, [ticketData]);

  const handleDateChange = (value, name) => {
    const formattedDate = new Date(value).toISOString().split("T")[0]; // Convert to YYYY-MM-DD
    setTicketData((prevState) => ({
      ...prevState,
      [name]: formattedDate,
    }));
  };

  const handleAdd = () => {
    setModalType("Add");
    setCurrentTraveller(null);
    setOpen(true);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ width: "100%", height: "60px", display: "flex", gap: 1 }}>
          <InputField label="Invoice Number" />
          <InputField
            label="Ticket Number"
            value={ticketData.ticketNo}
            onChange={(e) => {
              const { value } = e.target;
              setTicketData((prevState) => ({
                ...prevState,
                ticketNo: value,
              }));
            }}
            startDecorator={
              <SearchIcon
                onClick={() => {
                  const currentTicketNo = ticketData.ticketNo;
                  if (currentTicketNo) {
                    loadTicketDetails(currentTicketNo);
                  } else {
                    console.error("Ticket number is empty.");
                  }
                }}
                style={{ cursor: "pointer" }}
              />
            }
          />

          <InputField
            label="Traveller Code"
            value={ticketData.code}
            onChange={(e) => {
              const { value } = e.target;
              setTicketData((prevState) => ({
                ...prevState,
                code: value,
              }));
            }}
            startDecorator={
              <SearchIcon
                onClick={() => {
                  if (ticketData.code) {
                    loadTravellerDetails();
                  } else {
                    console.error("Code is empty.");
                  }
                }}
                style={{ cursor: "pointer" }}
              />
            }
          />
        </Box>
        <Box>
          <Button sx={{ width: "150px" }} onClick={() => handleAdd()}>
            Add Traveller
          </Button>
          <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={open}
            onClose={() => setOpen(false)}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Sheet
              variant="outlined"
              sx={{ maxWidth: 700, borderRadius: "md", p: 3, boxShadow: "lg" }}
            >
              <ModalClose variant="plain" sx={{ m: 1 }} />
              <AddEditForm type={modalType} onClose={() => setOpen(false)} />
            </Sheet>
          </Modal>
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        <AppDatePicker
          label="Inv.Date"
          required
          width="300px"
          size="sm"
          value={ticketData.invDate}
          date={ticketData.invDate}
          handleChange={(value) => {
            setTicketData((prevState) => ({
              ...prevState,
              invDate: value,
            }));
            handleDateChange(value, "invDate");
          }}
        />
        <SearchSelect
          size="sm"
          label="Customer"
          required
          width="300px"
          loadOptions={loadCustomerOptions}
          onChange={handleCustomerSelection}
        />
        <Select
          onChange={handlePayModeChange}
          sx={{ width: "300px", height: "30px", mt: "25px" }}
          label="Pay Mode"
          defaultValue={"Cash"}
        >
          <Option sx={{ height: "14px" }} value="Cash">
            CASH ( Cash )
          </Option>
          <Option sx={{ height: "14px" }} value="Credit Card">
            CC ( Credit Card )
          </Option>
          <Option sx={{ height: "14px" }} value="Credit">
            CC ( Credit )
          </Option>
          <Option sx={{ height: "14px" }} value="Adjustment">
            AD ( Adjustment )
          </Option>
        </Select>
        <InputField label="CC No." width="300px" />
        <InputField label="Our XO" width="300px" />
        <AppDatePicker
          label="Adj.Date"
          width="300px"
          size="sm"
          value={ticketData.adjDate}
          date={ticketData.adjDate}
          handleChange={(value) => {
            setTicketData((prevState) => ({
              ...prevState,
              adjDate: value,
            }));
            handleDateChange(value, "adjDate");
          }}
        />
        <InputField label="Print Name" required width="300px" />
        <InputField label="SPO" width="300px" />
        <Select
          onChange={handleStatusChange}
          sx={{ width: "300px", height: "30px", mt: "25px" }}
          label="Status"
          defaultValue={"Confirmed"}
        >
          <Option sx={{ height: "14px" }} value="Quotaion">
            Q (Quotaion)
          </Option>
          <Option sx={{ height: "14px" }} value="Booking">
            B (Booking)
          </Option>
          <Option sx={{ height: "14px" }} value="Confirmed">
            C (Confirmed)
          </Option>
          <Option sx={{ height: "14px" }} value="Refunded">
            R (Refunded)
          </Option>
        </Select>{" "}
        <InputField label="Clear XO" width="300px" />
        <InputField
          label="Inv.No."
          required
          width="300px"
          value={ticketData.invNo}
        />
        <InputField label="Cost Center" width="300px" />
        <SearchSelect
          size="sm"
          label="Visit Type"
          required
          width="300px"
          loadOptions={loadVisitTypeOptions}
          onChange={handleVisitTypeSelection}
        />
        <InputField label="Shift." width="300px" />
        <InputField label="Staff" width="300px" />
        <InputField label="Remarks." width="300px" />
        <InputField label="Iata No" width="300px" />
      </Box>

      <TicketBooking ticketData={ticketData} setTicketData={setTicketData} />
    </Box>
  );
};

export default SalesInvoice;
