import { Box, Button, FormControl, FormLabel, Option, Select, Sheet, Table, Typography } from "@mui/joy";
import React, { useEffect, useState } from "react";
import AppDatePicker from "../../components/common/AppDatePicker";
import { getAllSPO, getCustomerAccountStatementSearch } from "../../server/api";
import moment from "moment";
import { generateCustomerAccountStatement } from "./CustomerAccountStatementPDF";

const SelectSPO = ({ data, selectedSPO, setSelectedSPO }) => {
  return (
    <FormControl size={"lg"} sx={{ width: '20%' }}>
      <FormLabel>Select Supplier</FormLabel>
      <Select defaultValue="all" value={selectedSPO} onChange={(_, value) => setSelectedSPO(value)}>
        <Option value="all">All</Option>
        {data?.map((item, index) => (
          <Option key={index} value={item?._id}>{item?.firstName}</Option>
        ))}
      </Select>
    </FormControl>
  )
}

const CustomerAccountStatement = () => {
  const [confirmedData, setConfirmedData] = useState([]);
  const [refundedData, setRefundedData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [activeTab, setActiveTab] = useState("Confirmed");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [allSPO, setAllSPO] = useState([])
  const [selectedSPO, setSelectedSPO] = useState('all')

  const handleCustomerAccountStatement = async (confirmedData, refundedData, paymentData, startDate, endDate, totalOriginalPrice, totalSellPrice, totalOriginalPriceRef, totalSellPriceRef, totalPaymentPrice, totalTaxes, totalTaxesRef) => {
    console.log(paymentData)
    try {
      await generateCustomerAccountStatement(
        confirmedData || [],
        refundedData || [],
        paymentData ? paymentData : [],
        startDate || "",
        endDate || "",
        totalOriginalPrice || 0,
        totalSellPrice || 0,
        totalOriginalPriceRef || 0,
        totalSellPriceRef || 0,
        totalPaymentPrice || 0,
        totalTaxes || 0,
        totalTaxesRef || 0,
      );
      console.log(paymentData, "pay")
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const searchCustomerAccountStatement = async () => {
    try {
      const data = await getCustomerAccountStatementSearch(startDate, endDate, selectedSPO);
      console.log(data.result);
      setConfirmedData(data?.result?.confirmedBooking);
      setRefundedData(data?.result?.refundedBooking);
      setPaymentData(data?.result?.paymentBooking);
    } catch (error) {
      console.log("error", error);
      setConfirmedData([]);
      setRefundedData([]);
      setPaymentData([]);
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


  const totalOriginalPrice = confirmedData.reduce((sum, item) => (sum + (item?.orignalPrice ? item?.orignalPrice : 0) || 0), 0)
  const totalSellPrice = confirmedData.reduce((sum, item) => (sum + (item?.finalPrice) || 0), 0)

  const totalOriginalPriceRef = refundedData.reduce((sum, item) => (sum + (item?.orignalPrice) || 0), 0)
  const totalSellPriceRef = refundedData.reduce((sum, item) => (sum + (item?.finalPrice) || 0), 0)
  const totalPaymentPrice = paymentData.reduce((sum, item) => (sum + (item?.paidAmount) || 0), 0)
  const totalTaxes = confirmedData.reduce((sum, item) => (sum + (item?.totalTax) || 0), 0)
  const totalTaxesRef = refundedData.reduce((sum, item) => (sum + (item?.totalTax) || 0), 0)

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
          maxDate={new Date()}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 4, marginTop: "25px" }}>
        <Button
          sx={{ width: "140px" }}
          onClick={() => searchCustomerAccountStatement()}
        >
          Search
        </Button>{" "}
        <Button
          sx={{ width: "140px" }}
          onClick={() => handleCustomerAccountStatement(confirmedData, refundedData, paymentData, startDate, endDate, totalOriginalPrice, totalSellPrice, totalOriginalPriceRef, totalSellPriceRef, totalPaymentPrice, totalTaxes, totalTaxesRef)}
        >
          Print
        </Button>
      </Box>

      <Box sx={{ marginTop: "30px" }}>
        <Typography sx={{ fontSize: "22px", fontWeight: "500" }}>
          Pending Receipts and Invoices
        </Typography>

        <Sheet sx={{ marginY: "20px" }}>
          {confirmedData?.length > 0 && (
            <Box
              sx={{
                width: "100%",
                height: "30px",
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                marginY: "20px",
              }}
            >
              <Box
                sx={{
                  width: "10%",
                  height: "100%",
                  border: "1px solid black",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: activeTab == "Confirmed" ? "black" : "white",
                }}
                onClick={() => setActiveTab("Confirmed")}
              >
                <Typography
                  sx={{ color: activeTab == "Confirmed" ? "white" : "black" }}
                >
                  Confirmed
                </Typography>
              </Box>
              <Box
                sx={{
                  width: "10%",
                  height: "100%",
                  border: "1px solid black",
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: activeTab == "Refunded" ? "black" : "white",
                }}
                onClick={() => setActiveTab("Refunded")}
              >
                <Typography
                  sx={{ color: activeTab == "Refunded" ? "white" : "black" }}
                >
                  Refunded
                </Typography>
              </Box>
            </Box>
          )}

          {activeTab === "Confirmed" &&
            (confirmedData?.length > 0 ? (
              <>
                <Table aria-label="basic table">
                  <thead>
                    <tr>
                      <th>Document Date</th>
                      <th>Document No</th>
                      <th>Passenger Name</th>
                      <th>Ticket#</th>
                      <th>PNR</th>
                      <th>Sector</th>
                      <th>Travel Date</th>
                      <th>Return Date</th>

                      <th>Fare</th>
                      <th>YQ/YR</th>
                      <th>Total Taxes</th>
                      <th>CNX</th>
                      <th>PSF</th>
                      <th>Discount</th>
                      <th>Sell Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {confirmedData.map((data, index) => (
                      <tr key={index}>
                        <td>{moment(data?.createdAt).format("DD-MM-YYYY")}</td>
                        <td style={{ wordWrap: 'break-word' }}>{data?.invoiceNumber || 'N/A'}</td>
                        <td style={{ wordWrap: 'break-word' }}>
                          {data?.travelers[0]?.name?.firstName}{" "}
                          {data?.travelers[0]?.name?.lastName}
                        </td>
                        <td style={{ wordWrap: 'break-word' }}>{data?.travelers[0]?.ticketNumber}</td>

                        <td style={{ wordWrap: 'break-word' }}>{data?.id}</td>
                        <td>{`${data?.flightOffers[0]?.itineraries[0]?.segments[0]?.departure?.iataCode} - ${data?.flightOffers[0]?.itineraries[0]?.segments[0]?.arrival?.iataCode}`}</td>
                        <td>
                          {
                            moment(data?.flightOffers[0]?.itineraries[0]?.segments[0]
                              ?.departure?.at).format("DD-MM-YYYY")
                          }
                        </td>
                        <td>
                          {
                            moment(data?.flightOffers[0]?.itineraries[0]?.segments[1]
                              ?.departure?.at).format("DD-MM-YYYY")
                          }
                        </td>
                        <td>{data?.orignalPrice || 0}</td>
                        <td>{data?.a || 0}</td>
                        <td>{data?.totalTax || 0}</td>
                        <td>{data?.a || 0}</td>
                        <td>{data?.a || 0}</td>
                        <td>{data?.a || 0}</td>

                        <td>{data?.finalPrice || 0}</td>
                      </tr>
                    ))}
                  </tbody>

                </Table>
                <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", height: "200px", marginY: "20px" }}>
                  <Box sx={{ height: "100%", width: "20%", }}>
                    <Typography sx={{ fontSize: "30px", fontWeight: "600" }}>Summary</Typography>
                    <Typography sx={{ fontSize: "22px", fontWeight: "400" }}>Total Fares: {totalOriginalPrice} </Typography>
                    <Typography sx={{ fontSize: "22px", fontWeight: "400" }}>Total Sell Price: {totalSellPrice}</Typography>

                  </Box>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "300px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontSize: "26px", fontWeight: "600" }}>
                  No Record
                </Typography>
              </Box>
            ))}

          {activeTab === "Refunded" &&
            (refundedData?.length > 0 ? (
              <>
                <Table aria-label="basic table">
                  <thead>
                    <tr>
                      <th>Document Date</th>
                      <th>Document No</th>
                      <th>Passenger Name</th>
                      <th>Ticket#</th>
                      <th>PNR</th>
                      <th>Sector</th>
                      <th>Travel Date</th>
                      <th>Return Date</th>

                      <th>Fare</th>
                      <th>YQ/YR</th>
                      <th>Total Taxes</th>
                      <th>CNX</th>
                      <th>PSF</th>
                      <th>Discount</th>
                      <th>Sell Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refundedData.map((data, index) => (
                      <tr key={index}>
                        <td>{moment(data?.createdAt).format("DD-MM-YYYY")}</td>
                        <td style={{ wordWrap: 'break-word' }}>{data?.invoiceNumber || 'N/A'}</td>
                        <td style={{ wordWrap: 'break-word' }}>
                          {data?.travelers[0]?.name?.firstName}{" "}
                          {data?.travelers[0]?.name?.lastName}
                        </td>
                        <td style={{ wordWrap: 'break-word' }}>{data?.travelers[0]?.ticketNumber}</td>

                        <td style={{ wordWrap: 'break-word' }}>{data?.id}</td>
                        <td>{`${data?.flightOffers[0]?.itineraries[0]?.segments[0]?.departure?.iataCode} - ${data?.flightOffers[0]?.itineraries[0]?.segments[0]?.arrival?.iataCode}`}</td>
                        <td>
                          {
                            moment(data?.flightOffers[0]?.itineraries[0]?.segments[0]
                              ?.departure?.at).format("DD-MM-YYYY")
                          }
                        </td>
                        <td>
                          {
                            moment(data?.flightOffers[0]?.itineraries[0]?.segments[1]
                              ?.departure?.at).format("DD-MM-YYYY")
                          }
                        </td>
                        <td>{data?.orignalPrice || 0}</td>
                        <td>{data?.a || 0}</td>
                        <td>{data?.totalTax || 0}</td>
                        <td>{data?.a || 0}</td>
                        <td>{data?.a || 0}</td>
                        <td>{data?.a || 0}</td>

                        <td>{data?.finalPrice || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%", height: "200px", marginY: "20px" }}>
                  <Box sx={{ height: "100%", width: "20%", }}>
                    <Typography sx={{ fontSize: "30px", fontWeight: "600" }}>Summary</Typography>
                    <Typography sx={{ fontSize: "22px", fontWeight: "400" }}>Total Fares: {totalOriginalPriceRef} </Typography>
                    <Typography sx={{ fontSize: "22px", fontWeight: "400" }}>Total Sell Price: {totalSellPriceRef}</Typography>

                  </Box>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "300px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontSize: "26px", fontWeight: "600" }}>
                  No Record
                </Typography>
              </Box>
            ))}
        </Sheet>
      </Box>
    </Box>
  );
};

export default CustomerAccountStatement;
