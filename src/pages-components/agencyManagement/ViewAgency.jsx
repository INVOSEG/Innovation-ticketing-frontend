import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  Sheet,
  Modal,
  ModalDialog,
  ModalClose,
  Input,
  Select,
  Option,
  Typography,
} from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/reducer/loaderSlice";
import { getTravelAgency } from "../../server/api";
import RowMenu from "./rowMenu";
import AppButton from "../../components/common/AppButton";
import { NEXT_PUBLIC_PROD_URL } from "../../env";
export const baseURL = NEXT_PUBLIC_PROD_URL;
import axios from "axios";

export default function ViewAgency() {
  const [order, setOrder] = useState("desc");
  const [agencies, setAgencies] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [transactionData, setTransactionData] = useState({
    date: "",
    amount: "",
    description: "",
    payMode: "Cash",
  });
  const [selectedAgency, setSelectedAgency] = useState(null);
  const userData = useSelector((state) => state?.user?.loginUser)
  const dispatch = useDispatch();

  useEffect(() => {
    fetchAgencies();
  }, []);
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const fetchAgencies = async () => {
    dispatch(setLoading(true));
    try {
      const res = await getTravelAgency();
      setAgencies(res.result.agency);
    } catch (error) {
      console.log("Error fetching agencies:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleOpenModal = (type, agency) => {
    setModalType(type);
    setSelectedAgency(agency);
    setTransactionData({
      date: "",
      amount: "",
      description: "",
      payMode: "Cash",
      type: "",
      chequeNo: "",
    });
    setOpenModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("image", name, value);
    setTransactionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTransactionSubmit = async (agency) => {
    try {
      let payload = {
        agencyId: selectedAgency._id,
        type: modalType === "credit" ? "CREDIT" : "DEBIT",
        ...transactionData,
      };

      // Modify the payload based on transaction type
      if (modalType === "credit") {
        // Modify payload for credit transactions
        payload = {
          ...payload,
          credit: payload.amount,
          type: "received",
        };
      } else {
        // Modify payload for debit transactions
        payload = {
          ...payload,
          debit: payload.amount,
          type: "charged",
        };
      }
      console.log("Sending Transaction Data:", baseURL, payload);

      // Choose the appropriate API endpoint based on transaction type
      const apiUrl = `${baseURL}book/create`; // Credit API endpoint
      // Debit API endpoint

      // API Call to Save Data
      const response = await axios.post(apiUrl, payload);

      console.log("API Response:", response.data);

      // Show success message
      alert(response.data.message || "Transaction successfully added!");

      // Close modal after successful submission
      setOpenModal(false);
    } catch (error) {
      console.error("Error submitting transaction:", error);
      alert("Failed to submit transaction. Please try again.");
    }
  };

  return (
    <Box>
      <Sheet
        variant="outlined"
        sx={{
          width: "100%",
          borderRadius: "sm",
          overflow: "auto",
          height: "auto",
        }}
      >
        <Table aria-labelledby="tableTitle">
          <thead>
            <tr>
              <th>Agency Name</th>
              <th>Email</th>
              <th>CNIC</th>
              <th>Status</th>
              <th>Agency Type</th>
              <th>amount</th>
              {userData?.role === "super_admin" && (
                <th>Actions</th>
              )}
            </tr>
          </thead>
          {agencies.length > 0 && (
            <tbody>
              {agencies.map((agency) => (
                <tr key={agency.agencyName}>
                  <td>{agency.agencyName}</td>
                  <td>{agency.agencyEmail}</td>
                  <td>{agency.CNIC}</td>
                  <td>{agency.status}</td>
                  <td>{agency.type?.type}</td>
                  <td>RS.{agency.cashLimit}</td>
                  {userData?.role === "super_admin" && (
                    <td>
                      <Button onClick={() => handleOpenModal("credit", agency)}>
                        Credit
                      </Button>
                      <Button
                        onClick={() => handleOpenModal("deposit", agency)}
                        sx={{ ml: 1 }}
                      >
                        Deposit
                      </Button>
                      <RowMenu status={agency.status} />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          )}
        </Table>
      </Sheet>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h4">
            {modalType === "credit"
              ? "Credit Transaction"
              : "Deposit Transaction"}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>


            <Input
              type="date"
              name="date"
              value={transactionData.date}
              onChange={handleInputChange}
            />

            <Select
              name="voucherType"
              value={transactionData.voucherType}
              onChange={(e, value) =>
                setTransactionData({ ...transactionData, voucherType: value })
              }
              placeholder="Select Voucher Type"
            >
              <Option value="Journal Voucher">Journal Voucher</Option>
              <Option value="Payment Voucher">Payment Voucher</Option>
              <Option value="Recipt Voucher">recipt Voucher</Option>
            </Select>

            <Input
              type="number"
              name="amount"
              placeholder="Amount"
              value={transactionData.amount}
              onChange={handleInputChange}
            />

            <Select
              name="payMode"
              value={transactionData.payMode}
              onChange={(e, value) =>
                setTransactionData({ ...transactionData, payMode: value })
              }
              placeholder="Select Payment Mode"
            >
              <Option value="CASH">Cash</Option>
              <Option value="CHECK">Check</Option>
              <Option value="CR">Credit</Option>
              <Option value="VD">Void</Option>
            </Select>

            {transactionData.payMode === "CHECK" && (
              <>
                <Input
                  type="text"
                  name="chequeNo"
                  placeholder="Cheque Number"
                  value={transactionData.chequeNo}
                  onChange={handleInputChange}
                />
                <Input
                  type="file"
                />
              </>
            )}

            <AppButton
              text="Submit"
              onClick={() => handleTransactionSubmit(transactionData)}
            />
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  );
}
