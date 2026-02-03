import React, { useCallback, useState } from "react";
import InputField from "../common/InputField";
import {
  Box,
  Button,
  Checkbox,
  FormLabel,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
  Typography,
} from "@mui/joy";
import SearchSelect from "../common/SearchSelect";
import axios from "axios";
import { generatePDFInvoice } from "../../pages-components/Accounts/InvoicePdf";
import { NEXT_PUBLIC_PROD_URL } from "../../env";

const ModalTableTicket = ({ open, onClose }) => {
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
          <Typography>Conjuction Ticket</Typography>
        </Box>
        <Box sx={{ borderBottom: "1px solid black" }}>
          <InputField label="Ticket Number" width="300px" />
          <table
            style={{
              border: "1px solid #185ea5",
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#185ea5" }}>
                <th style={{ border: "1px solid #185ea5", color: "white" }}>
                  City
                </th>
                <th style={{ border: "1px solid #185ea5", color: "white" }}>
                  FI.No
                </th>
                <th style={{ border: "1px solid #185ea5", color: "white" }}>
                  CI
                </th>
                <th style={{ border: "1px solid #185ea5", color: "white" }}>
                  Dep.Date
                </th>
                <th style={{ border: "1px solid #185ea5", color: "white" }}>
                  Dep.Time
                </th>
                <th style={{ border: "1px solid #185ea5", color: "white" }}>
                  Arr.Time
                </th>
                <th style={{ border: "1px solid #185ea5", color: "white" }}>
                  Fare Basis
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index} style={{ height: "30px" }}>
                  <td style={{ border: "1px solid #185ea5" }}></td>
                  <td style={{ border: "1px solid #185ea5" }}></td>
                  <td style={{ border: "1px solid #185ea5" }}></td>
                  <td style={{ border: "1px solid #185ea5" }}></td>
                  <td style={{ border: "1px solid #185ea5" }}></td>
                  <td style={{ border: "1px solid #185ea5" }}></td>
                  <td style={{ border: "1px solid #185ea5" }}></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button sx={{ marginTop: "20px", marginBottom: "30px" }}>
              Add
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

const ticketBooking = ({
  ticketData,
  setTicketInf,
  ticketInf,
  handleTicketInf,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [selectedDocType, setSelectedDocType] = useState();
  const [rowCount, setRowCount] = useState(2);
  const [rowCount1, setRowCount1] = useState(2);
  const [fareDetails, setFareDetails] = useState({
    RN: { amount: "" },
    APT: { amount: "" },
    CVT: { amount: "" },
    PK: { amount: "" },
    YR: { amount: "" },
    YQ: { amount: "" },
    XZ: { amount: "" },
    YD: { amount: "" },
    YI: { amount: "" },
    WHT: { percentage: "", amount: "" },
    DIS: { percentage: "", amount: "" },
    COM: { percentage: "", amount: "" },
    PSF: { percentage: "", amount: "" },
  });

  const addRow = () => {
    setRowCount((prevCount) => prevCount + 1);
  };
  const addRow1 = () => {
    setRowCount1((prevCount) => prevCount + 1);
  };

  const removeRow = () => {
    setRowCount((prevCount) => (prevCount > 2 ? prevCount - 1 : prevCount));
  };
  const removeRow1 = () => {
    setRowCount1((prevCount) => (prevCount > 2 ? prevCount - 1 : prevCount));
  };

  const [selectedPaxType, setSelectedPaxType] = useState();
  const handlePaxType = (selectedPaxType) => {
    setTicketInf((prevData) => ({
      ...prevData,
      paxType: selectedPaxType,
    }));
    setSelectedPaxType(selectedPaxType);
  };
  const handleDocTypeSelection = (selectedOption) => {
    if (selectedOption) {
      setSelectedDocType(selectedOption.value);
    } else {
      setSelectedDocType({ title: "", description: "" });
    }
  };
  const [selectedCategory, setSelectedCategory] = useState();

  const handleCategorySelection = (selectedOption) => {
    if (selectedOption) {
      setSelectedCategory(selectedOption.value);
      setTicketInf((prevData) => ({
        ...prevData,
        category: selectedOption.value,
      }));
    } else {
      setSelectedCategory({ title: "", description: "" });
    }
  };

  const [selectedSupplier, setSelectedSupplier] = useState();

  const loadCSupplierOptions = useCallback(async (inputValue) => {
    if (inputValue.length < 3) return [];
    try {
      const response = await axios.get(
        `${NEXT_PUBLIC_PROD_URL}supplier/getAll`
      );
      console.log(response.data.result, "123456890");
      return response.data.result.map((data) => ({
        label: `${data.title} ${data.code}`,
        value: { title: data.title, code: data.code },
      }));
    } catch (error) {
      console.error("Error fetching customer options:", error);
      return [];
    }
  }, []);

  const handleSupplierSelection = (selectedOption) => {
    if (selectedOption) {
      setSelectedSupplier(selectedOption.value);
      setTicketInf((prevData) => ({
        ...prevData,
        supplier: selectedOption.value,
      }));
    } else {
      setSelectedSupplier({ title: "", code: "" });
    }
  };

  const [totalFare, setTotalFare] = useState(0);

  // Handle changes for flat amount fields
  const handleAmountChangeFlat = (field, value) => {
    setFareDetails((prev) => {
      const updatedDetails = {
        ...prev,
        [field]: { amount: value },
      };

      const newTotal = ["APT", "CVT", "PK", "YR", "YQ", "XZ", "YD", "YI", "RN"]
        .map((key) => parseInt(updatedDetails[key]?.amount) || 0)
        .reduce((acc, num) => acc + num, 0);

      setTotalFare(newTotal);
      return updatedDetails;
    });
  };

  // Handle percentage change for nested fields
  const handlePercentageChange = (field, percentage) => {
    setFareDetails((prev) => {
      const calculatedAmount =
        (parseInt(percentage) / 100) *
        (ticketData?.fare || ticketInf?.fare || 0);
      return {
        ...prev,
        [field]: { percentage, amount: calculatedAmount.toFixed(2) },
      };
    });
  };

  // Handle amount change for nested fields
  const handleAmountChangeNested = (field, amount) => {
    setFareDetails((prev) => {
      const calculatedPercentage =
        (parseInt(amount) / (ticketData?.fare || ticketInf?.fare || 0)) * 100;
      return {
        ...prev,
        [field]: { amount, percentage: calculatedPercentage.toFixed(2) },
      };
    });
    setTicketInf((prevData) => ({
      ...prevData,
      totalFare: totalFare,
      taxes: fareDetails,
    }));
  };
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        // border: "1px solid lightgrey",
        padding: "5px 10px",
        marginTop: "10px",
      }}
    >
      <Box sx={{ width: "45%" }}>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <InputField
            label="Template"
            width="300px"
            value={"Catalyst template"}
          />
          <SearchSelect
            label="Supplier"
            width="300px"
            loadOptions={loadCSupplierOptions}
            onChange={handleSupplierSelection}
            size="sm"
          />
          <InputField
            label="Pax"
            width="300px"
            value={ticketData?.pax}
            onChange={(e) => handleTicketInf("pax", e.target.value)}
          />

          <Select
            onChange={handlePaxType}
            sx={{ width: "300px", height: "30px", mt: "25px" }}
            label="Pax Type"
            defaultValue={"A(Adult)"}
          >
            <Option sx={{ height: "14px" }} value="A(Adult)">
              A (Adult)
            </Option>
            <Option sx={{ height: "14px" }} value="C(Child)">
              C (Child)
            </Option>
            <Option sx={{ height: "14px" }} value="I(Infant)">
              I (Infant)
            </Option>
          </Select>

          <InputField
            label="Ticket No."
            width="300px"
            value={ticketData?.ticketNo}
            onChange={(e) => handleTicketInf("ticketNo", e.target.value)}
          />
          <InputField
            label="PNR"
            width="300px"
            value={ticketData?.pnr}
            onChange={(e) => handleTicketInf("pnr", e.target.value)}
          />
          <InputField
            label="Auto No."
            width="300px"
            onChange={(e) => handleTicketInf("autoNo", e.target.value)}
          />
          <Select
            onChange={handleDocTypeSelection}
            sx={{ width: "300px", height: "30px", mt: "25px" }}
            label="Doc"
            defaultValue={"BSPE"}
          >
            <Option sx={{ height: "14px" }} value="MAN">
              Manual
            </Option>
            <Option sx={{ height: "14px" }} value="AUT">
              Auto
            </Option>
            <Option sx={{ height: "14px" }} value="ET">
              E-Ticket
            </Option>
            <Option sx={{ height: "14px" }} value="BSP">
              BSP
            </Option>
            <Option sx={{ height: "14px" }} value="BSPE">
              BSP E-Ticket
            </Option>
            <Option sx={{ height: "14px" }} value="BSPO">
              BSP D
            </Option>
            <Option sx={{ height: "14px" }} value="IA">
              IA
            </Option>
            <Option sx={{ height: "14px" }} value="VTO">
              VTO
            </Option>
            <Option sx={{ height: "14px" }} value="E_TAT">
              E-TAT
            </Option>
            <Option sx={{ height: "14px" }} value="SOTO_TICKET">
              SOTO TICKET
            </Option>
          </Select>

          <InputField label="Type" width="300px" value={"Auto"} />
          <InputField
            label="Sector"
            width="300px"
            value={ticketData?.sector}
            onChange={(e) => handleTicketInf("sector", e.target.value)}
          />
          <InputField
            label="GDS"
            width="300px"
            value={ticketData?.gds}
            onChange={(e) => handleTicketInf("gds", e.target.value)}
          />
          <InputField
            label="Airline"
            width="300px"
            value={ticketData?.airline}
            onChange={(e) => handleTicketInf("airline", e.target.value)}
          />
          <InputField
            label="Issue Date"
            width="300px"
            onChange={(e) => handleTicketInf("issueDate", e.target.value)}
          />
          <Select
            onChange={handleCategorySelection}
            sx={{ width: "300px", height: "30px", mt: "25px" }}
            label="Category"
            defaultValue={"Visitor"}
          >
            <Option sx={{ height: "14px" }} value="Hajj">
              Hajj
            </Option>
            <Option sx={{ height: "14px" }} value="Holiday">
              Holiday
            </Option>
            <Option sx={{ height: "14px" }} value="Tour">
              Tour
            </Option>
            <Option sx={{ height: "14px" }} value="Umrah">
              Umrah
            </Option>
            <Option sx={{ height: "14px" }} value="Visitor">
              Visitor
            </Option>
          </Select>
          <Button
            onClick={() => {
              console.log(ticketInf, "ticket");
              setTicketInf((prevData) => ({
                ...prevData,
                totalFare: totalFare,
                taxes: fareDetails,
              }));
            }}
          >
            Ok
          </Button>
        </Box>
        <Box sx={{ marginTop: "10px" }}>
          <table
            style={{
              border: "1px solid #185ea5",
              width: "88%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#185ea5" }}>
                <th style={{ border: "1px solid #185ea5", color: "white" }}>
                  City
                </th>
                <th style={{ border: "1px solid #185ea5", color: "white" }}>
                  FI.No
                </th>
                <th style={{ border: "1px solid #185ea5", color: "white" }}>
                  CI
                </th>
                <th style={{ border: "1px solid #185ea5", color: "white" }}>
                  Dep.Date
                </th>
                <th style={{ border: "1px solid #185ea5", color: "white" }}>
                  Dep.Time
                </th>
                <th style={{ border: "1px solid #185ea5", color: "white" }}>
                  Arr.Time
                </th>
                <th style={{ border: "1px solid #185ea5", color: "white" }}>
                  Fare Basis
                </th>
              </tr>
            </thead>
            <tbody>
              {ticketData?.sectorDetails.map((sector, index) => (
                <tr key={index} style={{ height: "30px" }}>
                  <td style={{ border: "1px solid #185ea5" }}>
                    {sector.departure.iataCode}
                  </td>
                  <td style={{ border: "1px solid #185ea5" }}></td>
                  <td style={{ border: "1px solid #185ea5" }}></td>
                  <td style={{ border: "1px solid #185ea5" }}>
                    {" "}
                    {new Date(sector.departure.at).toLocaleDateString()}
                  </td>
                  <td style={{ border: "1px solid #185ea5" }}>
                    {" "}
                    {new Date(sector.departure.at).toLocaleTimeString()}
                  </td>
                  <td style={{ border: "1px solid #185ea5" }}>
                    {" "}
                    {new Date(sector.arrival.at).toLocaleDateString()}
                  </td>
                  <td style={{ border: "1px solid #185ea5" }}></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
        {/* <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "88%",
            marginTop: "10px",
          }}
        >
          <Typography>Conjuction Ticket</Typography>
          <Box>
          <img
        src={require("../../images/table.png")}
        width="30px"
        alt="Open Table Modal"
        onClick={handleOpen}
        style={{ cursor: "pointer" }}
      />
      <ModalTableTicket open={open} onClose={handleClose} />
            <img
              src={`${require("../../images/table.png")}`}
              width="30px"
            />
          </Box>
        </Box>
        <table
          style={{
            border: "1px solid #185ea5",
            width: "88%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <th>Ticket No.</th>
            <th>Route Details</th>
          </thead>
          <tbody>
            {[...Array(3)].map((_, index) => (
              <tr key={index} style={{ height: "30px" }}>
                <td style={{ border: "1px solid lightgrey" }}></td>
                <td style={{ border: "1px solid lightgrey" }}></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Box
          style={{
            border: "2px solid lightgrey",
            width: "88%",
            display: "flex",
            flexWrap: "wrap",
            padding: "5px",
            marginTop: "10px",
          }}
        >
          <Typography sx={{ width: "50%" }}>Created By : N/A</Typography>
          <Typography sx={{ width: "50%" }}>On : N/A</Typography>
          <Typography sx={{ width: "50%" }}>Modified By : N/A</Typography>
          <Typography sx={{ width: "50%" }}>On: N/A</Typography>
        </Box>
      </Box> */}
      </Box>
      <Box sx={{ width: "55%" }}>
        {/* <Box sx={{ width: "100%", display: "flex" }}>
        <Box sx={{ width: "50%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "90%",
              marginTop: "10px",
            }}
          >
            <Typography sx={{ color: "#185ea5" }}>Arline City Tax</Typography>
            <Box sx={{display:"flex"}}>
              <img
                src={`${require("../../images/table.png")}`}
                width="30px"
                onClick={addRow}
              />
              <img
                src={`${require("../../images/table.png")}`}
                width="30px"
                onClick={removeRow}
              />
            </Box>
          </Box>
          <table
            style={{
              border: "1px solid #185ea5",
              width: "88%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <th style={{ border: "1px solid #185ea5" }}>Airline Tax.</th>
              <th style={{ border: "1px solid #185ea5" }}>Amount</th>
            </thead>
            <tbody>
            {[...Array(rowCount)].map((_, index) => (
            <tr key={index} style={{ height: "30px" }}>
              <td
                style={{ border: "1px solid #185ea5", padding: "4px" }}
              ></td>
              <td
                style={{ border: "1px solid #185ea5", padding: "4px" }}
              ></td>
            </tr>
          ))}
        </tbody>
          </table>
        </Box>
        <Box sx={{ width: "50%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "88%",
              marginTop: "10px",
            }}
          >
            <Typography sx={{ color: "#185ea5" }}> City Tax</Typography>
            <Box sx={{display:"flex"}}>
              <img
                src={`${require("../../images/table.png")}`}
                width="30px"
                onClick={addRow1}
              />
              <img
                src={`${require("../../images/table.png")}`}
                width="30px"
                onClick={removeRow1}
             
              />
            </Box>
          </Box>
          <table
            style={{
              border: "1px solid #185ea5",
              width: "88%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <th style={{ border: "1px solid #185ea5" }}>City Tax.</th>
              <th style={{ border: "1px solid #185ea5" }}>Amount</th>
            </thead>
            <tbody>
              {[...Array(rowCount1)].map((_, index) => (
                <tr key={index} style={{ height: "30px" }}>
                  <td
                    style={{ border: "1px solid #185ea5", padding: "4px" }}
                  ></td>
                  <td
                    style={{ border: "1px solid #185ea5", padding: "4px" }}
                  ></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box> */}
        <Box
          sx={{
            width: "94%",
            marginTop: "25px",
          }}
        >
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              marginTop: "10px",
            }}
          >
            <tbody
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "space-between",
              }}
            >
              <tr style={{ width: "48%", display: "flex" }}>
                <td
                  style={{
                    backgroundColor: "#185ea5",
                    color: "white",
                    border: "1px solid #185ea5",
                    padding: "4px",
                    width: "30%",
                  }}
                >
                  Fare
                </td>
                <td style={{ border: "1px solid #185ea5", width: "70%" }}>
                  <input
                    type="number"
                    value={ticketData?.fare || ticketInf?.fare}
                    style={{ width: "100%", height: "100%", padding: "2px" }}
                    onChange={(e) => {
                      setTicketInf((prevState) => ({
                        ...prevState,
                        fare: e.target.value,
                      }));
                      handleTicketInf("fare", e.target.value);
                    }}
                  />
                </td>
              </tr>
              <tr style={{ width: "48%", display: "flex" }}>
                <td
                  style={{
                    backgroundColor: "#185ea5",
                    color: "white",
                    border: "1px solid #185ea5",
                    padding: "4px",
                    width: "30%",
                  }}
                >
                  RN
                </td>
                <td style={{ border: "1px solid #185ea5", width: "70%" }}>
                  <input
                    type="number"
                    value={fareDetails["RN"]?.amount || ""}
                    onChange={(e) =>
                      handleAmountChangeFlat("RN", e.target.value)
                    }
                    style={{ width: "100%", height: "100%" }}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              marginTop: "15px",
            }}
          >
            <tbody
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                justifyContent: "space-between",
              }}
            >
              {["APT", "CVT", "PK", "YR", "YQ", "XZ", "YD", "YI"].map(
                (field, index) => (
                  <tr key={index} style={{ width: "48%", display: "flex" }}>
                    <td
                      style={{
                        backgroundColor: "#185ea5",
                        color: "white",
                        border: "1px solid #185ea5",
                        padding: "4px",
                        width: "30%",
                      }}
                    >
                      {field}
                    </td>
                    <td style={{ border: "1px solid #185ea5", width: "70%" }}>
                      <input
                        type="number"
                        value={fareDetails[field].amount}
                        onChange={(e) =>
                          handleAmountChangeFlat(field, e.target.value)
                        }
                        style={{ width: "100%", height: "100%" }}
                      />
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>

          <table
            style={{
              border: "1px solid #185ea5",
              borderCollapse: "collapse",
              width: "100%",
              marginTop: "15px",
            }}
          >
            <thead style={{ backgroundColor: "#185ea5" }}>
              <tr>
                {["Field", "%", "Amount"].map((header, index) => (
                  <th
                    key={index}
                    style={{
                      border: "1px solid #185ea5",
                      color: "white",
                      padding: "4px",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { field: "WHT" },
                { field: "DIS" },
                { field: "COM" },
                { field: "PSF" },
                //  { field: "PSFP" }
              ].map(({ field }, index) => (
                <tr key={index}>
                  <td
                    style={{
                      backgroundColor: "#185ea5",
                      color: "white",
                      border: "1px solid #185ea5",
                      padding: "4px",
                    }}
                  >
                    {field}
                  </td>
                  <td style={{ border: "1px solid #185ea5", padding: "4px" }}>
                    <input
                      type="number"
                      placeholder="%"
                      value={fareDetails[field].percentage}
                      onChange={(e) =>
                        handlePercentageChange(field, e.target.value)
                      }
                    />
                  </td>
                  <td style={{ border: "1px solid #185ea5", padding: "4px" }}>
                    <input
                      type="number"
                      placeholder="Amount"
                      value={fareDetails[field].amount}
                      onChange={(e) =>
                        handleAmountChangeNested(field, e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* <Checkbox label="Auto Update" sx={{ marginTop: "20px" }} /> */}

          {/* <Box
          style={{
            border: " 1px solid lightgrey",
            padding: "5px",
            marginTop: "15px",
          }}
        >
          <Typography sx={{ fontSize: "22px" }}>
            Cancellation Changes
          </Typography>
          <Box
            sx={{
              display: {xs:"block",lg:"flex"},
              gap: 1,
              padding: "4px",
              justifyContent: "center",
            }}
          >
            <InputField label="Self" sx={{width:{xs:"300", lg:"350px"} }}/>
            <InputField label="Supplier" sx={{width:{xs:"300", lg:"350px"} }} />
          </Box>
        </Box> */}

          <Box
            style={{
              border: " 1px solid lightgrey",
              padding: "5px",
              marginTop: "20px",
            }}
          >
            <Typography sx={{ fontSize: "22px" }}>Totals</Typography>
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
                  Customer Gross{" "}
                </Typography>
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  {(parseInt(ticketData?.fare || ticketInf?.fare) || 0) +
                    (parseInt(totalFare) || 0) +
                    (parseInt(fareDetails.PSF.amount) || 0)}
                </Typography>
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  Invoice Rec. Gross{" "}
                </Typography>
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  {(parseInt(ticketData?.fare || ticketInf?.fare) || 0) +
                    (parseInt(totalFare) || 0) +
                    (parseInt(fareDetails.PSF.amount) || 0)}
                </Typography>
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  Supplier Gross{" "}
                </Typography>
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  {(parseInt(ticketData?.fare || ticketInf?.fare) || 0) +
                    (parseInt(totalFare) || 0) +
                    (parseInt(fareDetails.WHT.amount) || 0)}{" "}
                </Typography>
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  Invoice Pay. Gross{" "}
                </Typography>
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  {(parseInt(ticketData?.fare || ticketInf?.fare) || 0) +
                    (parseInt(totalFare) || 0) +
                    (parseInt(fareDetails.WHT.amount) || 0)}{" "}
                </Typography>
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  Supplier Gross W/o WHT
                </Typography>
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  {(ticketData?.fare || ticketInf?.fare) + totalFare}{" "}
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
                  Customer Net{" "}
                </Typography>
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  {(parseInt(ticketData?.fare || ticketInf?.fare) || 0) +
                    (parseInt(totalFare) || 0) -
                    (parseInt(fareDetails.DIS.amount) || 0) +
                    (parseInt(fareDetails.PSF.amount) || 0)}
                </Typography>
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  Invoice Rec. Net{" "}
                </Typography>
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  {(parseInt(ticketData?.fare || ticketInf?.fare) || 0) +
                    (parseInt(totalFare) || 0) -
                    (parseInt(fareDetails.DIS.amount) || 0) +
                    (parseInt(fareDetails.PSF.amount) || 0)}
                </Typography>
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  Supplier Net{" "}
                </Typography>
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  {(parseInt(ticketData?.fare || ticketInf?.fare) || 0) +
                    (parseInt(totalFare) || 0) +
                    (parseInt(fareDetails.WHT.amount) || 0) -
                    (parseInt(fareDetails.COM.amount) || 0)}
                </Typography>
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  Invoice Pay Net{" "}
                </Typography>
                <Typography width="50%" sx={{ fontWeight: "500" }}>
                  {(parseInt(ticketData?.fare || ticketInf?.fare) || 0) +
                    (parseInt(totalFare) || 0) +
                    (parseInt(fareDetails.WHT.amount) || 0) -
                    (parseInt(fareDetails.COM.amount) || 0)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "5px",
            width: "94%",
            height: "4rem",
            alignItems: "flex-end",
          }}
        >
          <Button
            onClick={() => {
              generatePDFInvoice(ticketData);
              console.log(ticketData, "0000");
            }}
          >
            Print Invoice
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ticketBooking;
