import React, { useState, useEffect } from "react";
import { Box, Typography, Select, Option, Table } from "@mui/joy";
import FormSelect from "../../components/common/FormSelect";

const FlightSalesTable = ({ flightSalesData, handleChange }) => {
  const [filteredFlightData, setFilteredFlightData] = useState([]);
  const [selectedAirline, setSelectedAirline] = useState("All Airlines");

  useEffect(() => {
    setFilteredFlightData(flightSalesData);
  }, [flightSalesData]);

  const handleAirlineSearch = (event) => {
    const selectedValue = event.target.value.trim().toLowerCase(); // normalize search value
    setSelectedAirline(selectedValue);

    if (selectedValue === "all airlines") {
      setFilteredFlightData(flightSalesData); // Show all data when "All Airlines" is selected
    } else {
      const filteredData = flightSalesData.filter(flight =>
        flight.airline && flight.airline.trim().toLowerCase() === selectedValue // normalize airline data
      );
      setFilteredFlightData(filteredData);
    }
  };

  const uniqueAirlines = ["All Airlines", ...new Set(flightSalesData
    .filter(flight => flight.airline)
    .map(flight => flight.airline))];

  const filterOptions = [
    { value: "last5years", label: "Last 5 Years" },
    { value: "yearly", label: "This Year" },
    { value: "monthly", label: "Monthly" },
    { value: "weekly", label: "Weekly" },
    { value: "daily", label: "Daily" }
  ];

  return (
    <Box
      sx={{
        p: 2,
        width: "100%",
        // marginTop: "120px",
        border: "1px solid #CCD6E0",
        borderRadius: 'md',
        height: 400
      }}
    >
      <Box style={{ mb: 10, height: "100%" }}>
        <Box style={{ width: "100%", height: "5rem", display: "flex" }}>
          <Box style={{ width: "60%", display: "flex", alignItems: "center" }}>
            <Typography level="h3">Flights with Highest Sales</Typography>
          </Box>
          <Box
            style={{
              width: "40%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Box sx={{flex: 1}}>
            <FormSelect
              options={uniqueAirlines}
              onChange={handleAirlineSearch}
              placeholder="Select Airline"
              size="md"
              value={selectedAirline} // Set the selected value to "All Airlines" by default
            />
</Box>
            <Select
              defaultValue="last5years"
              onChange={handleChange}
              size="sm"
              style={{
                height: "50%",
                width: "40%",
                color: "#CCD6E0",
                border: "1px solid #CCD6E0",
              }}
            >
              <Option value="last5years">Last 5 Years</Option>
              <Option value="yearly">This Year</Option>
              <Option value="monthly">Monthly</Option>
              <Option value="weekly">Weekly</Option>
              <Option value="daily">Daily</Option>
            </Select>
          </Box>
        </Box>
        <Box style={{ width: "100%" }}>
          <Table aria-label="flight sales data">
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>Airline</th>
                <th style={{ textAlign: 'center' }}>Total Sales</th>
                <th style={{ textAlign: 'center' }}>Total Bookings</th>
                <th style={{ textAlign: 'center' }}>Destination</th>
              </tr>
            </thead>
            <tbody>
              {filteredFlightData.map((row, index) => (
                <tr key={index}>
                  <td style={{ textAlign: 'center' }}>{row.airline || 'N/A'}</td>
                  <td style={{ textAlign: 'center' }}>{row.totalSales || 0}</td>
                  <td style={{ textAlign: 'center' }}>{row.totalBookings || 0}</td>
                  <td style={{ textAlign: 'center' }}>
                    {row.destination && row.destination[0] && row.destination[0].length > 0
                      ? row.destination[0].map((des) => des.join(', ')).join(' | ')
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};

export default FlightSalesTable;
