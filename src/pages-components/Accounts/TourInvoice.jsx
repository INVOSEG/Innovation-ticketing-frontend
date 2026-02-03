import { Box, Button, ModalDialog, Option, Select, Typography } from "@mui/joy";
import React, { useCallback, useEffect, useState } from "react";
import InputField from "../../components/common/InputField";
import AppTextArea from "../../components/common/AppTextArea";
import TicketBooking from "../../components/utils/ticketBooking";
import Checkbox from "@mui/joy/Checkbox";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import SearchSelect from "../../components/common/SearchSelect";
import axios from "axios";
import { NEXT_PUBLIC_PROD_URL } from "../../env";
import AppDatePicker from "../../components/common/AppDatePicker";

const InvoiceTable = ({ Heading, Type, TypeA, data }) => {
  return (
    <Box sx={{ width: "48%" }}>
      <Typography
        sx={{
          padding: "8px",
          backgroundColor: "#185ea5",
          color: "white",
          marginTop: "20px",
          borderRadius: "10px",
        }}
      >
        {Heading}
      </Typography>
      <table
        style={{ borderCollapse: "collapse", width: "100%", marginTop: "20px" }}
      >
        <thead>
          <tr>
            <th>{TypeA}</th>
            <th>Pax</th>
            <th>Client Receivable</th>
            <th>Supplier Payable</th>
            <th>Income</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index} style={{ height: "30px" }}>
                <td style={{ textAlign: "center", padding: "8px" }}>
                  {item.refNo || "N/A"}
                </td>
                <td style={{ textAlign: "center", padding: "8px" }}>
                  {item.pax || "N/A"}
                </td>
                <td style={{ textAlign: "center", padding: "8px" }}>
                  {item.receivable || "00.00"}
                </td>
                <td style={{ textAlign: "center", padding: "8px" }}>
                  {item.payable || "00.00"}
                </td>
                <td style={{ textAlign: "center", padding: "8px" }}>
                  {item.total || "00.00"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "8px" }}>
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Box>
  );
};
const handleSave = async (genInf, ticketInf, hotelInf, otherInf, visaInf) => {
  try {
    const response = await axios.post(
      `${NEXT_PUBLIC_PROD_URL}tourInvoice/create`,
      {
        generalInformation: genInf,
        ticket: ticketInf,
        hotel: hotelInf,
        transport: {},
        visa: visaInf,
        otherServices: otherInf,
        invoiceSummery: {},
      }
    );
    alert("Invoice Saved Successfully!");
  } catch (error) {
    console.error("Error saving invoice:", error);
    alert("Error saving invoice.");
  }
};

const ModalTable = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog sx={{ width: { xs: "50%", lg: "30%" } }}>
        <ModalClose onClick={onClose} />
        <Box
          sx={{
            height: "5rem",
            width: "100%",
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid black",
          }}
        >
          <Typography>Pax Selection</Typography>
        </Box>
        <Box sx={{ borderBottom: "1px solid black" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <th
                style={{
                  borderRight: "1px solid lightgrey",
                  borderBottom: "1px solid lightgrey",
                  padding: "4px",
                }}
              >
                Name
              </th>
              <th
                style={{
                  borderRight: "1px solid lightgrey",
                  borderBottom: "1px solid lightgrey",
                  padding: "4px",
                }}
              >
                Passport/NIC
              </th>
              <th
                style={{
                  borderRight: "1px solid lightgrey",
                  borderBottom: "1px solid lightgrey",
                  padding: "4px",
                }}
              >
                Pax Type
              </th>
              <th
                style={{
                  borderRight: "1px solid lightgrey",
                  borderBottom: "1px solid lightgrey",
                  padding: "4px",
                }}
              >
                Nationality
              </th>
            </thead>
            <tbody>
              {[...Array(6)].map((_, index) => (
                <tr key={index} style={{ height: "30px" }}>
                  <td
                    style={{
                      borderRight: "1px solid lightgrey",
                      borderBottom: "1px solid lightgrey",
                      padding: "4px",
                    }}
                  ></td>
                  <td
                    style={{
                      borderRight: "1px solid lightgrey",
                      borderBottom: "1px solid lightgrey",
                      padding: "4px",
                    }}
                  ></td>
                  <td
                    style={{
                      borderRight: "1px solid lightgrey",
                      borderBottom: "1px solid lightgrey",
                      padding: "4px",
                    }}
                  ></td>
                  <td
                    style={{
                      borderRight: "1px solid lightgrey",
                      borderBottom: "1px solid lightgrey",
                      padding: "4px",
                    }}
                  ></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button sx={{ marginTop: "20px", marginBottom: "30px" }}>
              Select All
            </Button>
            <Button sx={{ marginTop: "20px", marginBottom: "30px" }}>
              Add
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

const ModalTableGeneral = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog sx={{ width: { xs: "60%", lg: "30%" } }}>
        <ModalClose onClick={onClose} />
        <Box
          sx={{
            height: "5rem",
            width: "100%",
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid black",
          }}
        >
          <Typography>Pax Details</Typography>
        </Box>
        <Box
          sx={{
            borderBottom: "1px solid black",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "space-between",
          }}
        >
          <InputField label="Pax Name" width="250px" />
          <InputField label="Pax Type" width="250px" />
          <InputField label="Passport No." width="250px" />
          <InputField label="CNIC" width="250px" />
          <InputField label="Issue Date" width="250px" />
          <InputField label="NTN" width="250px" />
          <InputField label="Nationality" width="250px" />
          <InputField label="POI" width="250px" />
          <Box
            sx={{ height: "10px", width: "100%", marginBottom: "20px" }}
          ></Box>
        </Box>
        <Button sx={{ marginTop: "20px", marginBottom: "30px" }}>Add</Button>
      </ModalDialog>
    </Modal>
  );
};

const TourInvoice = ({ ticketData }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [activeDisplay, setActiveDisplay] = useState("General Information");
  const [genInf, setGetInf] = useState({
    invNo: "",
    remarks: "",
    status: "Confirmed",
    spo: "",
    invDate: "",
    visitType: "",
    paymentMode: "Cash",
    customer: "",
    name: "",
  });
  const [hotelInf, setHotelInf] = useState({
    checkInDate: "",
    checkOutDate: "",
    supplier: "",
    hotel: "",
    room: "",
    roomView: "",
    currency: "",
    packages: "",
    refNo: "",
    nights: "",
    costingOptions: "",
    inventory: "",
    roomQty: "",
    extraBed: "",
    bookingStatus: "",
    category: "",
    bookingName: "",
    availableInventory: "",
    remarks: "",
    receivable: "",
    payable: "",
    total: "",
    discounts: "",
  });
  const [visaInf, setVisaInf] = useState({
    paxType: "",
    supplier: "",

    visaAgent: "",

    visaAgency: "",

    visaType: "",

    visaApplyDate: "",

    visaExpiryDate: "",

    visaRate: "",

    currency: "",

    refNo: "",

    category: "",

    receivable: "",
    payable: "",

    discounts: "",

    total: "",

    remarks: "",
  });
  const [otherInf, setOtherInf] = useState({
    pax: "",
    supplier: "",
    vendor: "",
    date: "",
    remarks: "",
    refNo: "",
    category: "",
    receivable: "",
    payable: "",
    grossIncome: "",
    total: "",
    discounts: "",
  });
  const [ticketInf, setTicketInf] = useState({
    pax: "",
    paxType: "",
    sector: "",
    gds: "",
    airline: "",
    issueDate: "",
    autoNo: "",
    pnr: "",
    ticketNo: "",
    category: "",
    fare: "",
    type: "Auto",
    totalFare: "",
    taxes: "",
  });

  const handleTicketInf = (name, value) => {
    setTicketInf((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleHotelInf = (name, value) => {
    setHotelInf((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleVisaInf = (name, value) => {
    setVisaInf((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleOtherInf = (name, value) => {
    setOtherInf((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleStatusChange = (event, newValue) => {
    setGetInf((prevState) => ({
      ...prevState,
      status: newValue,
    }));
  };

  const handlePayModeChange = (event, newValue) => {
    console.log(newValue);
    setGetInf((prevState) => ({
      ...prevState,
      paymentMode: newValue,
    }));
  };

  useEffect(() => {
    getInvNumber();

    setGetInf((prevState) => ({
      ...prevState,
      invDate: prevState.invDate || new Date().toDateString(),
    }));
    console.log(genInf?.invDate);
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setGetInf((prevState) => ({
      ...prevState,
      invDate: today,
    }));
  }, []);

  console.log("genData");

  const getInvNumber = async () => {
    const response = await axios.get(
      `${NEXT_PUBLIC_PROD_URL}sale/getInvoiceNumber`
    );
    const invoiceNumber = response.data.result.latestInvoice;
    setGetInf((prevState) => ({
      ...prevState,
      invNo: invoiceNumber,
    }));
  };

  const handleDateChange = (value, name) => {
    const formattedDate = new Date(value).toISOString().split("T")[0]; // Convert to YYYY-MM-DD
    setTicketInf((prevState) => ({
      ...prevState,
      [name]: formattedDate,
    }));
  };

  const handleGenInf = (name, value) => {
    setGetInf((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCustomerSelection = (selectedOption) => {
    if (selectedOption) {
      const { title, code, NTNnumber } = selectedOption.value;

      setGetInf((prevState) => ({
        ...prevState,
        customer: code || "",
      }));
    } else {
      setGetInf((prevState) => ({
        ...prevState,
        customer: "",
      }));
    }
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

  const loadVisitTypeOptions = useCallback(async () => {
    try {
      const response = await axios.get(
        `${NEXT_PUBLIC_PROD_URL}visitType/getAll`
      );

      return response.data.result.map((data) => ({
        label: `${data?.title} ${data?.description}`,
        value: {
          title: data.title,
          //  code: data.description
        },
      }));
    } catch (error) {
      console.error("Error fetching customer options:", error);
      return [];
    }
  }, []);

  const handleVisitTypeSelection = (selectedOption) => {
    if (selectedOption) {
      setGetInf((prevState) => ({
        ...prevState,
        visitType: selectedOption || "",
      }));
    }
  };

  const loadSPOOptions = useCallback(async (inputValue) => {
    if (inputValue.length < 3) return [];
    try {
      const response = await axios.get(`${NEXT_PUBLIC_PROD_URL}spo/getAll`);

      return response.data.result.map((data) => ({
        label: `${data.firstName} ${data.lastName} ${data.code} `,
        value: {
          firstName: data.firstName,
          lastName: data.lastName,
          code: data.code,
          _id: data._id,
        },
      }));
    } catch (error) {
      console.error("Error fetching customer options:", error);
      return [];
    }
  }, []);

  const handleSPOSelection = (selectedOption) => {
    if (selectedOption) {
      setGetInf((prevState) => ({
        ...prevState,
        spo: selectedOption.value || "",
      }));
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", width: "100%" }}>
        <Box
          sx={{
            width: "14%",
            textAlign: "center",
            borderRight: "1px solid lightgrey",
            padding: "4px 8px",
            backgroundColor:
              activeDisplay == "General Information" ? "#185ea5" : "none",
            color: activeDisplay == "General Information" ? "white" : "#185ea5",
            border: "1px solid lightgrey",
          }}
          onClick={() => {
            setActiveDisplay("General Information");
          }}
        >
          General Information
        </Box>
        <Box
          sx={{
            width: "14%",
            textAlign: "center",
            borderRight: "1px solid lightgrey",
            padding: "4px 8px",
            backgroundColor: activeDisplay == "Ticket" ? "#185ea5" : "none",
            color: activeDisplay == "Ticket" ? "white" : "#185ea5",
            border: "1px solid lightgrey",
          }}
          onClick={() => {
            setActiveDisplay("Ticket");
          }}
        >
          Ticket
        </Box>
        <Box
          sx={{
            width: "14%",
            textAlign: "center",
            borderRight: "1px solid lightgrey",
            padding: "4px 8px",
            backgroundColor: activeDisplay == "Hotel" ? "#185ea5" : "none",
            color: activeDisplay == "Hotel" ? "white" : "#185ea5",
            border: "1px solid lightgrey",
          }}
          onClick={() => {
            setActiveDisplay("Hotel");
          }}
        >
          Hotel
        </Box>
        <Box
          sx={{
            width: "14%",
            textAlign: "center",
            borderRight: "1px solid lightgrey",
            padding: "4px 8px",
            backgroundColor: activeDisplay == "Transport" ? "#185ea5" : "none",
            color: activeDisplay == "Transport" ? "white" : "#185ea5",
            border: "1px solid lightgrey",
          }}
          onClick={() => {
            setActiveDisplay("Transport");
          }}
        >
          Transport
        </Box>
        <Box
          sx={{
            width: "14%",
            textAlign: "center",
            borderRight: "1px solid lightgrey",
            padding: "4px 8px",
            backgroundColor: activeDisplay == "Visa" ? "#185ea5" : "none",
            color: activeDisplay == "Visa" ? "white" : "#185ea5",
            border: "1px solid lightgrey",
          }}
          onClick={() => {
            setActiveDisplay("Visa");
          }}
        >
          Visa
        </Box>
        <Box
          sx={{
            width: "14%",
            textAlign: "center",
            borderRight: "1px solid lightgrey",
            padding: "4px 8px",
            backgroundColor:
              activeDisplay == "Other Services" ? "#185ea5" : "none",
            color: activeDisplay == "Other Services" ? "white" : "#185ea5",
            border: "1px solid lightgrey",
          }}
          onClick={() => {
            setActiveDisplay("Other Services");
          }}
        >
          Other Services
        </Box>
        <Box
          sx={{
            width: "14%",
            padding: "4px 8px",
            backgroundColor:
              activeDisplay == "Invoice Summary" ? "#185ea5" : "none",
            color: activeDisplay == "Invoice Summary" ? "white" : "#185ea5",
            border: "1px solid lightgrey",
          }}
          onClick={() => {
            setActiveDisplay("Invoice Summary");
          }}
        >
          Invoice Summary
        </Box>
      </Box>

      {activeDisplay == "General Information" && (
        <Box>
          <Box
            sx={{
              width: { xs: "90%", lg: "40%" },
              padding: "5px",
              marginTop: "20px",
            }}
          >
            <Typography>Search Invoice</Typography>
            <Box
              sx={{ display: "flex", gap: 1, padding: "4px", width: "100%" }}
            >
              <InputField label="Search by Invoice Number" width="300px" />
              <InputField label="Ticket Number" width="300px" />
            </Box>
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "auto",
              marginTop: "20px",
              display: "flex",
              gap: "15px",
            }}
          >
            <Box
              sx={{
                width: "50%",
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                padding: "8px",
              }}
            >
              <InputField
                label="Invoice Number"
                value={genInf?.invNo}
                width="300px"
              />
              <Box sx={{ display: { xs: "block", lg: "flex" }, gap: 1 }}>
                <AppDatePicker
                  label="Invoice Date"
                  required
                  width="300px"
                  size="sm"
                  value={genInf?.invDate}
                  date={genInf?.invDate}
                  handleChange={(value) => {
                    setGetInf((prevState) => ({
                      ...prevState,
                      invDate: value,
                    }));
                    handleDateChange(value, "invDate");
                  }}
                />
              </Box>
              <SearchSelect
                size="sm"
                label="Customer"
                required
                width="300px"
                loadOptions={loadCustomerOptions}
                onChange={handleCustomerSelection}
              />
              <Select
                // value={genInf.paymentMode}
                onChange={handlePayModeChange}
                sx={{ width: "300px", height: "30px", mt: "25px" }}
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

              <Select
                // value={genInf.status}
                onChange={handleStatusChange}
                sx={{ width: "300px", height: "30px", mt: "25px" }}
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
              </Select>

              <SearchSelect
                label="SPO"
                onChange={handleSPOSelection}
                loadOptions={loadSPOOptions}
                width="300px"
              />

              <SearchSelect
                size="sm"
                label="Visit Type"
                required
                width="300px"
                loadOptions={loadVisitTypeOptions}
                onChange={handleVisitTypeSelection}
              />
              <InputField
                label="Name on Invoice"
                onChange={(e) => handleGenInf("name", e.target.value)}
                width="300px"
              />

              <AppTextArea
                label="Remarks"
                minRows="6"
                onChange={(e) => handleGenInf("remarks", e.target.value)}
                width="610px"
              />
            </Box>

            {/* <Box sx={{width:"73%"}}>
       <Box sx={{display:"flex", justifyContent:"flex-end"}}><Button>Documents</Button></Box>
    

       </Box> */}
          </Box>
          {/* <Box sx={{width:"100%", height:"auto",  display:"flex", justifyContent: "space-between", marginTop:"20px"}}>
        <Typography sx={{color:"#185ea5"}}>Pax Details</Typography>
      <Box >
      <img
        src={require("../../images/table.png")}
        width="30px"
        alt="Open Table Modal"
        onClick={handleOpen}
        style={{ cursor: "pointer" }}
      />
      <ModalTableGeneral open={open} onClose={handleClose} />                
        <img src={`${require('../../images/table.png')}`} width="30px"/>
      
      </Box>
       </Box>
       <Box sx={{width:"100%", display:"flex", alignItems:"flex-end" , flexDirection:"column" , gap:"5px"}}>
         <Button onClick={()=>{
          console.log(genInf,"general information")
         }}>Advance</Button>
         <Button>General Passengers</Button>

       </Box>
       <Box>
        <table style={{width:"100%", border: "1px solid #185ea5", borderCollapse:"collapse", marginTop:"15px"}}>
          <thead>
            <th style={{ border: "1px solid #185ea5" }}>Name</th>
            <th style={{ border: "1px solid #185ea5" }}>Passport/NIC</th>
            <th style={{ border: "1px solid #185ea5" }}>Pax Type</th>
            <th style={{ border: "1px solid #185ea5" }}>Nationality</th>

          </thead>
          <tbody>
          {[...Array(7)].map((_, index) => (
      <tr key={index} style={{ height:"30px"}}>
        <td style={{ border: "1px solid #185ea5" }}></td>
        <td style={{ border: "1px solid #185ea5" }}></td>
        <td style={{ border: "1px solid #185ea5" }}></td>
        <td style={{ border: "1px solid #185ea5" }}></td>
        
      </tr>
    ))}
          </tbody>
        </table>
       </Box> */}
        </Box>
      )}
      {activeDisplay == "Ticket" && (
        <TicketBooking
          setTicketInf={setTicketInf}
          ticketInf={ticketInf}
          handleTicketInf={handleTicketInf}
        />
      )}
      {activeDisplay == "Hotel" && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "20px",
            }}
          >
            <Button>Flight Details</Button>
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ width: "45%", padding: "8px" }}>
              <InputField
                label="Template"
                width="100%"
                value={"Catalyst template"}
              />
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  width: "100%",
                  gap: "15px",
                }}
              >
                <InputField
                  label="Check-in-Date"
                  width="220px"
                  onChange={(e) =>
                    handleHotelInf("checkInDate", e.target.value)
                  }
                />
                <InputField
                  label="Check-out-Date"
                  width="220px"
                  onChange={(e) =>
                    handleHotelInf("checkOutDate", e.target.value)
                  }
                />
                <InputField
                  label="Supplier"
                  width="220px"
                  onChange={(e) => handleHotelInf("supplier", e.target.value)}
                />
                <InputField
                  label="Hotel"
                  width="220px"
                  onChange={(e) => handleHotelInf("hotel", e.target.value)}
                />
                <InputField
                  label="Room"
                  width="220px"
                  onChange={(e) => handleHotelInf("room", e.target.value)}
                />
                <InputField
                  label="Room View"
                  width="220px"
                  onChange={(e) => handleHotelInf("roomview", e.target.value)}
                />
                <InputField
                  label="Packages"
                  width="220px"
                  onChange={(e) => handleHotelInf("packages", e.target.value)}
                />
                <InputField
                  label="Currency"
                  width="220px"
                  onChange={(e) => handleHotelInf("currency", e.target.value)}
                />
                <InputField
                  label="Ref.Number"
                  width="220px"
                  onChange={(e) => handleHotelInf("refNo", e.target.value)}
                />
                <InputField
                  label="Nights"
                  width="220px"
                  onChange={(e) => handleHotelInf("nights", e.target.value)}
                />
                <InputField
                  label="Costing Options"
                  width="220px"
                  onChange={(e) =>
                    handleHotelInf("costingOptions", e.target.value)
                  }
                />
                <InputField
                  label="Inventory"
                  width="220px"
                  onChange={(e) => handleHotelInf("inventory", e.target.value)}
                />
                <InputField
                  label="Room Qty"
                  width="220px"
                  onChange={(e) => handleHotelInf("roomQty", e.target.value)}
                />
                <InputField
                  label="Available Inventory"
                  width="220px"
                  onChange={(e) =>
                    handleHotelInf("availableInventory", e.target.value)
                  }
                />
                <InputField
                  label="Extra Bed Qty"
                  width="220px"
                  onChange={(e) => handleHotelInf("extraBed", e.target.value)}
                />
                <InputField
                  label="Booking Status"
                  width="220px"
                  onChange={(e) =>
                    handleHotelInf("bookingStatus", e.target.value)
                  }
                />
                <InputField
                  label="Category"
                  width="220px"
                  onChange={(e) => handleHotelInf("category", e.target.value)}
                />
                <InputField
                  label="Booking Name"
                  width="220px"
                  onChange={(e) =>
                    handleHotelInf("bookingName", e.target.value)
                  }
                />
              </Box>
              <AppTextArea
                label="Remarks"
                width="100%"
                onChange={(e) => handleHotelInf("remarks", e.target.value)}
              />
              <Button onClick={() => console.log(hotelInf, "oooooooooooooo")}>
                Ok
              </Button>
              {/* <Box sx={{width:"100%", height:"auto",  display:"flex", justifyContent: "space-between", marginTop:"20px"}}>
   <Typography sx={{color:"#185ea5"}}>Pax</Typography>
 <Box >
      <img
        src={require("../../images/table.png")}
        width="30px"
        alt="Open Table Modal"
        onClick={handleOpen}
        style={{ cursor: "pointer" }}
      />
      <ModalTable open={open} onClose={handleClose} />
     <img src={`${require('../../images/table.png')}`} width="30px"/>
 
 </Box>
  </Box>
  <Box sx={{width:"100%", padding:"10px"}}>
   <table style={{width:"98%" , border: "1px solid #185ea5" , borderCollapse:"collapse"}}>
     <thead>
       <th style={{border:"1px solid #185ea5"}}>Name</th>
       <th style={{border:"1px solid #185ea5"}}>Pax Type</th> 
       </thead>
       <tbody>
       {[...Array(6)].map((_, index) => (
 <tr key={index} style={{ height:"30px"}}>
   <td style={{ border: "1px solid #185ea5" }}></td>
   <td style={{ border: "1px solid #185ea5" }}></td>
  
   
 </tr>
))}
       </tbody>
   </table>
   </Box> */}
            </Box>
            <Box sx={{ width: "50%", padding: "8px" }}>
              <Typography
                sx={{
                  color: "white",
                  backgroundColor: "#185ea5",
                  width: "100%",
                  borderRadius: "10px",
                  padding: "8px",
                  marginTop: "20px",
                }}
              >
                Charges
              </Typography>
              <InputField
                label={"Receivable"}
                onChange={(e) => handleHotelInf("receivable", e.target.value)}
              />
              <InputField
                label={"Payable"}
                onChange={(e) => handleHotelInf("payable", e.target.value)}
              />
              <InputField
                label={"Total (Local Currency)"}
                onChange={(e) => handleHotelInf("total", e.target.value)}
              />
              <InputField
                label={"Others Charges/Discounts"}
                onChange={(e) => handleHotelInf("discounts", e.target.value)}
              />
              {/* <Checkbox sx={{marginTop:"20px"}} label="Auto Update"/> */}
              <Typography sx={{ marginTop: "20px" }}>
                Net Total (Local Currency)
              </Typography>
              <table
                style={{
                  width: "100%",
                  border: "1px solid #185ea5",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <th
                    style={{
                      border: "1px solid #185ea5",
                      backgroundColor: "#185ea5",
                      color: "white",
                    }}
                  >
                    Receivable
                  </th>
                  <th
                    style={{
                      border: "1px solid #185ea5",
                      backgroundColor: "#185ea5",
                      color: "white",
                    }}
                  >
                    Payable
                  </th>
                  <th
                    style={{
                      border: "1px solid #185ea5",
                      backgroundColor: "#185ea5",
                      color: "white",
                    }}
                  >
                    Total
                  </th>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #185ea5",
                        textAlign: "center",
                      }}
                    >
                      {hotelInf?.receivable}
                    </td>
                    <td
                      style={{
                        border: "1px solid #185ea5",
                        textAlign: "center",
                      }}
                    >
                      {hotelInf?.payable}
                    </td>
                    <td
                      style={{
                        border: "1px solid #185ea5",
                        textAlign: "center",
                      }}
                    >
                      {hotelInf?.total}
                    </td>
                  </tr>
                </tbody>
              </table>
              <Typography
                sx={{
                  backgroundColor: "#185ea5",
                  color: "white",
                  padding: "8px",
                  borderRadius: "10px",
                  marginTop: "50px",
                }}
              >
                Totals
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  padding: "4px",
                  justifyContent: "center",
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "50%",
                    flexWrap: "wrap",
                  }}
                >
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    Customer Net{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    0.00{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    Invoice Rec. Gross{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    0.00{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    Invoice Rec. Net{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    0.00{" "}
                  </Typography>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "50%",
                    flexWrap: "wrap",
                  }}
                >
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    Supplier Net{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    0.00{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    Invoice Pay Gross{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    0.00{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    Invoice Pay Net{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    0.00{" "}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      )}

      {activeDisplay == "Transport" && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            height: "auto",
            marginTop: "20px",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ width: "45%" }}>
            <InputField
              label="Template"
              width="97.5%"
              value={"Catalyst template"}
            />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
              <InputField label="Check-in-Date" width="220px" />
              <InputField label="Check-out-Date" width="220px" />
              <InputField label="Supplier" width="220px" />
              <InputField label="Hotel" width="220px" />
              <InputField label="Room" width="220px" />
              <InputField label="Room View" width="220px" />
              <InputField label="Packages" width="220px" />
              <InputField label="Currency" width="220px" />
              <InputField label="Ref. Number" width="220px" />
              <InputField label="Nights" width="220px" />
              <InputField label="Costing Option" width="220px" />
              <InputField label="Inventory" width="220px" />
              <InputField label="Room Qty" width="220px" />
              <InputField label="Available Inventory" width="220px" />
              <InputField label="Extra Bed Qty" width="220px" />
              <InputField label="Booking Status" width="220px" />
              <InputField label="Category" width="220px" />
              <InputField label="Booking Name" width="220px" />
            </Box>
            <AppTextArea label="Remarks" width="97.5%" />

            {/* <Box sx={{width:"100%", height:"auto",  display:"flex", justifyContent: "space-between", marginTop:"20px"}}>
   <Typography sx={{color:"#185ea5"}}>Pax Details</Typography>
 <Box >
 <img
        src={require("../../images/table.png")}
        width="30px"
        alt="Open Table Modal"
        onClick={handleOpen}
        style={{ cursor: "pointer" }}
      />
      <ModalTable open={open} onClose={handleClose} />            
       <img src={`${require('../../images/table.png')}`} width="30px"/>
 
 </Box>
  </Box>
  <Box sx={{width:"100%", padding:"10px"}}>
   <table style={{width:"98%" , border: "1px solid #185ea5" , borderCollapse:"collapse"}}>
     <thead>
       <th style={{border:"1px solid #185ea5"}}>Ticket No.</th>
       <th style={{border:"1px solid #185ea5"}}>Route Details</th> 
       </thead>
       <tbody>
       {[...Array(6)].map((_, index) => (
 <tr key={index} style={{ height:"30px"}}>
   <td style={{ border: "1px solid #185ea5" }}></td>
   <td style={{ border: "1px solid #185ea5" }}></td>
  
   
 </tr>
))}
       </tbody>
   </table>
   </Box> */}
          </Box>
          <Box sx={{ width: "50%" }}>
            <Typography
              sx={{
                color: "white",
                padding: "5px",
                backgroundColor: "#185ea5",
                borderRadius: "10px",
              }}
            >
              Charges
            </Typography>
            <InputField
              label={"Receivable"}
              onChange={(e) => handleVisaInf("receivable", e.target.value)}
            />
            <InputField
              label={"Payable"}
              onChange={(e) => handleVisaInf("payable", e.target.value)}
            />
            <InputField
              label={"Total (Local Currency)"}
              onChange={(e) => handleVisaInf("total", e.target.value)}
            />
            <InputField
              label={"Others Charges/Discounts"}
              onChange={(e) => handleVisaInf("discounts", e.target.value)}
            />
            {/* <Checkbox sx={{marginTop:"20px"}} label="Auto Update"/> */}
            <Typography sx={{ marginTop: "20px" }}>
              Net Total(Local Currency)
            </Typography>
            <table
              style={{
                width: "98%",
                border: "1px solid #185ea5",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <th style={{ border: "1px solid #185ea5" }}>Receivable</th>
                <th style={{ border: "1px solid #185ea5" }}>Payable</th>
                <th style={{ border: "1px solid #185ea5" }}>Total</th>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{ border: "1px solid #185ea5", textAlign: "center" }}
                  >
                    {visaInf?.receivable}
                  </td>
                  <td
                    style={{ border: "1px solid #185ea5", textAlign: "center" }}
                  >
                    {visaInf?.payable}
                  </td>
                  <td
                    style={{ border: "1px solid #185ea5", textAlign: "center" }}
                  >
                    {visaInf?.total}
                  </td>
                </tr>
              </tbody>
            </table>

            <Typography
              sx={{
                color: "white",
                padding: "5px",
                backgroundColor: "#185ea5",
                borderRadius: "10px",
                marginTop: "20px",
              }}
            >
              Totals
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                padding: "4px",
                justifyContent: "center",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "50%",
                  flexWrap: "wrap",
                }}
              >
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  Customer Net{" "}
                </Typography>
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  0.00{" "}
                </Typography>
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  Invoice Rec. Gross{" "}
                </Typography>
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  0.00{" "}
                </Typography>
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  Invoice Rec. Net{" "}
                </Typography>
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  0.00{" "}
                </Typography>
              </Box>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "50%",
                  flexWrap: "wrap",
                }}
              >
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  Supplier Net{" "}
                </Typography>
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  0.00{" "}
                </Typography>
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  Invoice Pay Gross{" "}
                </Typography>
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  0.00{" "}
                </Typography>
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  Invoice Pay Net{" "}
                </Typography>
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  0.00{" "}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {activeDisplay == "Visa" && (
        <>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ width: "45%", padding: "8px" }}>
              <InputField label="Template" value={"Catalyst template"} />
              <Box
                sx={{
                  width: "100%",
                  display: { xs: "block", lg: "flex" },
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <InputField
                  label="Pax Type"
                  width="340px"
                  onChange={(e) => handleVisaInf("paxType", e.target.value)}
                />
                <InputField
                  label="Supplier"
                  width="340px"
                  onChange={(e) => handleVisaInf("supplier", e.target.value)}
                />
                <InputField
                  label="Visa Agency"
                  width="340px"
                  onChange={(e) => handleVisaInf("visaAgency", e.target.value)}
                />
                <InputField
                  label="Visa Type"
                  width="340px"
                  onChange={(e) => handleVisaInf("visaType", e.target.value)}
                />
                <InputField
                  label="Visa Apply Date"
                  width="340px"
                  onChange={(e) =>
                    handleVisaInf("visaApplyDate", e.target.value)
                  }
                />
                <InputField
                  label="Visa Expiry Date"
                  width="340px"
                  onChange={(e) =>
                    handleVisaInf("visaExpiryDate", e.target.value)
                  }
                />

                <InputField
                  label="Visa Rate"
                  width="340px"
                  onChange={(e) => handleVisaInf("visaRate", e.target.value)}
                />
                <InputField
                  label="Currency"
                  width="340px"
                  onChange={(e) => handleVisaInf("currecny", e.target.value)}
                />
                <InputField
                  label="Reference No."
                  width="340px"
                  onChange={(e) => handleVisaInf("refNo", e.target.value)}
                />
                <InputField
                  label="Category"
                  width="340px"
                  onChange={(e) => handleVisaInf("category", e.target.value)}
                />
              </Box>
              <Box
                sx={{
                  width: "100%",
                  height: "auto",
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                {/* <Typography sx={{color:"#185ea5"}}>Pax</Typography>
 <Box >
 <img
        src={require("../../images/table.png")}
        width="30px"
        alt="Open Table Modal"
        onClick={handleOpen}
        style={{ cursor: "pointer" }}
      />
      <ModalTable open={open} onClose={handleClose} />             <img src={`${require('../../images/table.png')}`} width="30px"/>
 
 </Box> */}
              </Box>
              <AppTextArea
                label="Remarks"
                minRows={4}
                onChange={(e) => handleVisaInf("remarks", e.target.value)}
              />
              <Button onClick={() => console.log(visaInf, "visa")}>Ok</Button>
              {/* <Box sx={{width:"100%", padding:"10px"}}>
   <table style={{width:"98%" , border: "1px solid #185ea5" , borderCollapse:"collapse"}}>
     <thead>
       <th style={{border:"1px solid #185ea5"}}>Name</th>
       <th style={{border:"1px solid #185ea5"}}>Pax Type</th> 
       </thead>
       <tbody>
       {[...Array(6)].map((_, index) => (
 <tr key={index} style={{ height:"30px"}}>
   <td style={{ border: "1px solid #185ea5" }}></td>
   <td style={{ border: "1px solid #185ea5" }}></td>
  
   
 </tr>
))}
       </tbody>
   </table>
   </Box> */}
            </Box>
            <Box sx={{ width: "50%", padding: "8px" }}>
              <Typography
                sx={{
                  color: "white",
                  backgroundColor: "#185ea5",
                  width: "100%",
                  borderRadius: "10px",
                  padding: "8px",
                  marginTop: "20px",
                }}
              >
                Charges
              </Typography>
              <InputField
                label={"Receivable"}
                onChange={(e) => handleVisaInf("receivable", e.target.value)}
              />
              <InputField
                label={"Payable"}
                onChange={(e) => handleVisaInf("payable", e.target.value)}
              />
              <InputField
                label={"Total (Local Currency)"}
                onChange={(e) => handleVisaInf("total", e.target.value)}
              />
              <InputField
                label={"Others Charges/Discounts"}
                onChange={(e) => handleVisaInf("discounts", e.target.value)}
              />
              {/* <Checkbox sx={{marginTop:"20px"}} label="Auto Update"/> */}
              <Typography sx={{ marginTop: "20px" }}>
                Net Total (Local Currency)
              </Typography>
              <table
                style={{
                  width: "100%",
                  border: "1px solid #185ea5",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <th
                    style={{
                      border: "1px solid #185ea5",
                      backgroundColor: "#185ea5",
                      color: "white",
                    }}
                  >
                    Receivable
                  </th>
                  <th
                    style={{
                      border: "1px solid #185ea5",
                      backgroundColor: "#185ea5",
                      color: "white",
                    }}
                  >
                    Payable
                  </th>
                  <th
                    style={{
                      border: "1px solid #185ea5",
                      backgroundColor: "#185ea5",
                      color: "white",
                    }}
                  >
                    Total
                  </th>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #185ea5",
                        textAlign: "center",
                      }}
                    >
                      {visaInf?.receivable}
                    </td>
                    <td
                      style={{
                        border: "1px solid #185ea5",
                        textAlign: "center",
                      }}
                    >
                      {visaInf?.payable}
                    </td>
                    <td
                      style={{
                        border: "1px solid #185ea5",
                        textAlign: "center",
                      }}
                    >
                      {visaInf?.total}
                    </td>
                  </tr>
                </tbody>
              </table>
              <Typography
                sx={{
                  backgroundColor: "#185ea5",
                  color: "white",
                  padding: "8px",
                  borderRadius: "10px",
                  marginTop: "50px",
                }}
              >
                Totals
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  padding: "4px",
                  justifyContent: "center",
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "50%",
                    flexWrap: "wrap",
                  }}
                >
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    Customer Net{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    0.00{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    Invoice Rec. Gross{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    0.00{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    Invoice Rec. Net{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    0.00{" "}
                  </Typography>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "50%",
                    flexWrap: "wrap",
                  }}
                >
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    Supplier Net{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    0.00{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    Invoice Pay Gross{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    0.00{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    Invoice Pay Net{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    0.00{" "}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      )}
      {activeDisplay == "Other Services" && (
        <>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <Box sx={{ width: "45%", padding: "8px" }}>
              <InputField label="Template" value={"Catalyst template"} />
              <Box
                sx={{
                  width: "100%",
                  display: { xs: "block", lg: "flex" },
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <InputField
                  label="Pax"
                  width="340px"
                  onChange={(e) => handleOtherInf("pax", e.target.value)}
                />
                <InputField
                  label="Supplier"
                  width="340px"
                  onChange={(e) => handleOtherInf("supplier", e.target.value)}
                />
                <InputField
                  label="Vendor"
                  width="340px"
                  onChange={(e) => handleOtherInf("vendor", e.target.value)}
                />
                <InputField
                  label="Date"
                  sx={{ width: { xs: "320px", lg: "340px" } }}
                  onChange={(e) => handleOtherInf("date", e.target.value)}
                />
                <InputField
                  label="Reference No."
                  sx={{ width: { xs: "320px", lg: "340px" } }}
                  onChange={(e) => handleOtherInf("refNo", e.target.value)}
                />
                <InputField
                  label="Category"
                  width="340px"
                  onChange={(e) => handleOtherInf("category", e.target.value)}
                />
              </Box>
              <AppTextArea
                label="Remarks"
                minRows="6"
                onChange={(e) => handleOtherInf("remarks", e.target.value)}
              />
              <Button onClick={() => console.log(otherInf, "others")}>
                Ok
              </Button>
            </Box>
            <Box sx={{ width: "50%" }}>
              <Typography
                sx={{
                  backgroundColor: "#185ea5",
                  color: "white",
                  padding: "8px",
                  borderRadius: "10px",
                  marginTop: "20px",
                }}
              >
                Charges
              </Typography>
              <Typography sx={{ marginTop: "10px" }}>
                Service Charges
              </Typography>
              <InputField
                label={"Receivable"}
                onChange={(e) => handleOtherInf("receivable", e.target.value)}
              />
              <InputField
                label={"Payable"}
                onChange={(e) => handleOtherInf("payable", e.target.value)}
              />
              <InputField
                label={"Gross Income"}
                onChange={(e) => handleOtherInf("grossIncome", e.target.value)}
              />

              <Typography sx={{ marginTop: "20px" }}>
                Other Charges/Discount
              </Typography>
              <InputField
                label={"Others"}
                onChange={(e) => handleOtherInf("discounts", e.target.value)}
              />
              <Typography sx={{ marginTop: "10px" }}>Total</Typography>
              <table
                style={{
                  width: "100%",
                  border: "1px solid #185ea5",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <th style={{ border: "1px solid #185ea5" }}>Receivable</th>
                  <th style={{ border: "1px solid #185ea5" }}>Payable</th>
                  <th style={{ border: "1px solid #185ea5" }}>Gross Income</th>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{
                        border: "1px solid #185ea5",
                        textAlign: "center",
                      }}
                    >
                      {otherInf?.receivable}
                    </td>
                    <td
                      style={{
                        border: "1px solid #185ea5",
                        textAlign: "center",
                      }}
                    >
                      {otherInf?.payable}
                    </td>
                    <td
                      style={{
                        border: "1px solid #185ea5",
                        textAlign: "center",
                      }}
                    >
                      {otherInf?.grossIncome}
                    </td>
                  </tr>
                </tbody>
              </table>
              <Typography
                sx={{
                  backgroundColor: "#185ea5",
                  color: "white",
                  padding: "8px",
                  borderRadius: "10px",
                  marginTop: "50px",
                }}
              >
                Totals
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  padding: "4px",
                  justifyContent: "center",
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "50%",
                    flexWrap: "wrap",
                  }}
                >
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    Customer Net{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    0.00{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    Invoice Rec. Gross{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    0.00{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    Invoice Rec. Net{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    0.00{" "}
                  </Typography>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "50%",
                    flexWrap: "wrap",
                  }}
                >
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    Supplier Net{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    0.00{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    Invoice Pay Gross{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    0.00{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    Invoice Pay Net{" "}
                  </Typography>
                  <Typography width="50%" sx={{ fontWeight: "500" }}>
                    0.00{" "}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      )}
      {activeDisplay == "Invoice Summary" && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <InvoiceTable
            Type="Ticket"
            Heading="Ticket Booking"
            TypeA="Ticket No."
            data={[ticketInf]}
          />
          <InvoiceTable
            Type="Hotel"
            Heading="Hotel Booking"
            TypeA="Hotel"
            data={[hotelInf]}
          />
          <InvoiceTable
            Type="Transport"
            Heading="Transport Booking"
            TypeA="Transporter"
            data={[otherInf]}
          />
          <InvoiceTable
            Type="Visa"
            Heading="Visa Booking"
            TypeA="Visa Agency"
            data={[visaInf]}
          />
          <InvoiceTable
            Type="General"
            Heading="General Booking"
            TypeA="General Vendor"
            data={[otherInf]}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: "30px",
            }}
          >
            <Box>
              <Typography
                sx={{ fontWeight: "500" }}
              >{`Total Sale Invoice Receivable : ${hotelInf.receivable || "00.00"
                }`}</Typography>
              <Typography
                sx={{ fontWeight: "500" }}
              >{`Total Sale Invoice Payable : ${hotelInf.payable || "00.00"
                }`}</Typography>
              <Typography
                sx={{ fontWeight: "500" }}
              >{`Total Sale Invoice Income : ${hotelInf.total || "00.00"
                }`}</Typography>
            </Box>
            <Box>
              <Button
                onClick={() =>
                  handleSave(genInf, ticketInf, hotelInf, otherInf, visaInf)
                }
              >
                Save
              </Button>
              <Button sx={{ mx: "20px" }}>Print</Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TourInvoice;
