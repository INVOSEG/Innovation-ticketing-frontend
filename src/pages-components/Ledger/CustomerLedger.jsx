import { Box, Button, FormControl, FormLabel, Option, Select, Sheet, Table, Typography } from "@mui/joy";
import React, { useEffect, useState } from "react";
import AppDatePicker from "../../components/common/AppDatePicker";
import { getAllSPO, getCustomerLedgerSearch } from "../../server/api";
import moment from "moment";
import { generateCustomerLedger } from "./CustomerLedgerPDF";

const SelectSPO = ({ data, selectedSPO, setSelectedSPO }) => {
  return (
    <FormControl size={"lg"} sx={{ width: '20%' }}>
      <FormLabel>Select Customer</FormLabel>
      <Select defaultValue="all" value={selectedSPO} onChange={(_, value) => setSelectedSPO(value)}>
        <Option value="all">All</Option>
        {data?.map((item, index) => (
          <Option key={index} value={item?._id}>{item?.firstName}</Option>
        ))}
      </Select>
    </FormControl>
  )
}

const CustomerLedger = () => {
  const [ledgerData, setLedgerData] = useState([]);
  const [openingBalance, setOpeningBalance] = useState()
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [allSPO, setAllSPO] = useState([])
  const [selectedSPO, setSelectedSPO] = useState('all')

  const handleCustomerLedger = async (ledgerData, startDate, endDate, totalCredited, totalDebited, totalBalance, openingBalance) => {
    try {
      await generateCustomerLedger(
        ledgerData, startDate, endDate, totalCredited, totalDebited, totalBalance, openingBalance
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const searchCustomerLedger = async () => {
    try {
      const data = await getCustomerLedgerSearch(startDate, endDate, selectedSPO);
      console.log(data.result);
      setLedgerData(data?.result?.bookings);
      setOpeningBalance(data?.result?.openingBalance)
    } catch (error) {
      console.log("error", error);
      setLedgerData([]);
    }
  };

  const handleDateChange = (name, selectedDate) => {
    if (selectedDate === "startDate") {
      const formattedDate = name.toISOString().split("T")[0];

      setStartDate(formattedDate);
    } else if (selectedDate === "endDate") {
      const formattedDate = name.toISOString().split("T")[0];
      setEndDate(formattedDate);
    }
  };

  const fetchAllSPOs = async () => {
    try {
      const res = await getAllSPO();
      setAllSPO(res?.result);
    } catch (error) {
      console.log(error.message)
    }
  }


  const totalCredited = ledgerData?.reduce((sum, item) => (sum + (item?.credited ? item?.credited : 0) || 0), 0)
  const totalDebited = ledgerData?.reduce((sum, item) => (sum + (item?.debited ? item?.debited : 0) || 0), 0)

  const totalBalance = ledgerData?.at(-1)?.balance;


  useEffect(() => {
    fetchAllSPOs()
  }, [])

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 4, marginTop: "20px" }}>
        <SelectSPO {...{ selectedSPO, setSelectedSPO, data: allSPO }}
        />

        <AppDatePicker
          label="Opening"
          name="startDate"
          date={startDate}
          handleChange={handleDateChange}
        />

        <AppDatePicker
          label="Closing"
          name="endDate"
          date={endDate}
          handleChange={handleDateChange}
        // maxDate={new Date()}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 4, marginTop: "25px" }}>
        <Button
          sx={{ width: "140px" }}
          onClick={() => searchCustomerLedger()}
        >
          Search
        </Button>{" "}
        <Button
          sx={{ width: "140px" }}
          onClick={() => handleCustomerLedger(ledgerData, startDate, endDate, totalCredited, totalDebited, totalBalance, openingBalance)}
        >
          Print
        </Button>
      </Box>

      <Box sx={{ marginTop: "30px" }}>
        <Typography sx={{ fontSize: "22px", fontWeight: "500" }}>
          Customer Ledger Report
        </Typography>

        <Sheet sx={{ marginY: "20px" }}>

          <>
            {ledgerData?.length > 0 ? (
              <Table aria-label="ledger table">
                <thead>
                  <tr>
                    {["Date", "Trans No", "Cheque No", "Ref.No", "Description",
                      "Remarks", "Debit", "Credit", "Balance"
                    ].map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ledgerData.map((data, index) => (
                    <tr key={index}>
                      <td>{moment(data?.createdAt).format("DD-MM-YYYY")}</td>
                      <td style={{ wordWrap: "break-word" }}>{data?.transactionNo || "N/A"}</td>
                      <td style={{ wordWrap: "break-word" }}>{data?.chequeNo || "N/A"}</td>
                      <td>{data?.refNo || "N/A"}</td>
                      <td style={{ wordWrap: "break-word" }}>{data?.description || "N/A"}</td>
                      <td style={{ wordWrap: "break-word" }}>{data?.remarks || "N/A"}</td>
                      <td>{data?.debited || 0}</td>
                      <td>{data?.credited || 0}</td>
                      <td>{data?.balance || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Typography variant="h6" textAlign="center">No records found</Typography>
            )}

            {ledgerData?.length > 0 && (
              <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", my: 2 }}>
                <Box sx={{ width: "20%" }}>
                  <Typography variant="h4" fontWeight={600}>Summary</Typography>
                  <Typography variant="h6">Opening Balance: {openingBalance}</Typography>

                  <Typography variant="h6">Total Debit: {totalDebited}</Typography>
                  <Typography variant="h6">Total Credit: {totalCredited}</Typography>
                  <Typography variant="h6">Total Balance: {totalBalance}</Typography>
                </Box>
              </Box>
            )}
          </>



        </Sheet>
      </Box>
    </Box>
  );
};

export default CustomerLedger;
