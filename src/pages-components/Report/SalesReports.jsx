import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  Avatar,
  Box,
  Select,
  Option,
  Table,
  Typography,
  Sheet,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/joy";
import React, { useEffect, useRef, useState } from "react";
import CustomTypography from "../../components/common/CustomTyprography";
import { getAgencySalesData, getDashboardData, getFlightSalesData, getSalesData, getUsersSales, salesGraph } from "../../server/api";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/reducer/loaderSlice";
import { NEXT_PUBLIC_IMAGES_PROD_URL, NEXT_PUBLIC_PROD_IMAGE_URL } from "../../env";
import Search from "@mui/icons-material/Search";
import SearchSelect from "../../components/common/SearchSelect";
import FlightSalesTable from "./FlightSalesTable";
import {
  HourglassEmpty, CheckCircle, MoneyOff, Block, Cancel, AttachMoney, Payments
} from '@mui/icons-material';
import SalesTable from "./SalesTable";
import PrintIcon from '@mui/icons-material/Print';
import { useSnackbar } from "notistack";
import { generatePDFReport } from "./ReportPdf";
import StatusCard from "./StatusCard";

const SalesReports = () => {
  const userData = useSelector((state) => state.user.loginUser)
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => (
    console.log(userData?.role, "jhhjhh")
  ), [])


  const handleGraphChange = (newValue) => {
    setSelectedPeriod(newValue);
    fetchGraphSalesData(newValue);
  };
  const handleChange = (event, newValue) => {
    // API call here for the data change
  };


  const chartsData = [
    { name: "Jan", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Feb", uv: 3000, pv: 1398, amt: 2210 },
    { name: "March", uv: 2000, pv: 9800, amt: 2290 },
    { name: "April", uv: 2780, pv: 3908, amt: 2000 },
    { name: "May", uv: 1890, pv: 4800, amt: 2181 },
    { name: "June", uv: 2390, pv: 3800, amt: 2500 },
    { name: "July", uv: 3490, pv: 4300, amt: 2100 },
    { name: "Aug", uv: 3490, pv: 4300, amt: 2100 },
    { name: "Sept", uv: 3490, pv: 8300, amt: 2100 },
    { name: "Oct", uv: 3490, pv: 4300, amt: 2100 },
    { name: "Nov", uv: 3490, pv: 4300, amt: 2100 },
    { name: "Dec", uv: 3490, pv: 4300, amt: 2100 },
  ];

  // const flightSalesData = [
  //   { airline: "Emirates", totalSales: "$1,500,000", price: "$900", destination: "Dubai" },
  //   { airline: "Qatar Airways", totalSales: "$1,200,000", price: "$850", destination: "Doha" },
  //   { airline: "Singapore Airlines", totalSales: "$1,000,000", price: "$950", destination: "Singapore" },
  //   { airline: "British Airways", totalSales: "$900,000", price: "$800", destination: "London" },
  //   { airline: "Delta Airlines", totalSales: "$850,000", price: "$750", destination: "New York" },
  // ];


  const initialized = useRef(false)
  const [agencySalesData, setAgencySalesData] = useState([])
  const [flightSalesData, setFlightSalesData] = useState([])
  const [dashboardData, setDashboardData] = useState([])
  const [chartData, setChartData] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState("yearly");
  const [salesReport, setSalesReport] = useState(null);
  const dispatch = useDispatch()
  const fetchAgencySalesData = async () => {
    dispatch(setLoading(true))
    try {
      const res = await getAgencySalesData()
      setAgencySalesData(res?.result)
      dispatch(setLoading(false))
    }
    catch (error) {
      console.log("error fetching agency sales data", error)
      dispatch(setLoading(false))

    }
    finally {
      dispatch(setLoading(false))
    }
  }

  const fetchGraphSalesData = async (period) => {
    dispatch(setLoading(true));
    try {
      const res = await salesGraph(period);
      const formattedData = res.result.salesData.map(item => ({
        name: item.label,
        value: item.value
      }));
      setChartData(formattedData);
      console.log("formated data is ", formattedData)
    } catch (error) {
      console.error("Error fetching sales graph data:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchFlightSalesData = async () => {

    dispatch(setLoading(true))
    try {
      const res = await getFlightSalesData()
      setFlightSalesData(res.result)
      dispatch(setLoading(false))
    }
    catch (error) {
      console.log("error fetching agency sales data", error)
      dispatch(setLoading(false))

    }
    finally {
      dispatch(setLoading(false))
    }

  }

  const fetchDashboardData = async () => {

    dispatch(setLoading(true))
    try {
      const res = await getSalesData()
      setDashboardData(res.result)
      dispatch(setLoading(false))
    }
    catch (error) {
      console.log("error fetching agency sales data", error)
      dispatch(setLoading(false))

    }
    finally {
      dispatch(setLoading(false))
    }

  }

  const fetchGetUsersSalesData = () => {
    dispatch(setLoading(true))
    getUsersSales().then((res) => {
      console.log(res);
      setSalesReport(res?.result)
      enqueueSnackbar(res?.message, {
        variant: res?.status,
      });
      dispatch(setLoading(false))
    }).catch((err) => {
      console.log(err)
      enqueueSnackbar("Something went wrong!", {
        variant: "error",
      });
      dispatch(setLoading(false))
    })
  }

  console.log(salesReport)

  const overallTicketStatus = {
    hold: 75,
    confirmed: 8,
    refunded: 1,
    void: 1,
    cancelled: 0
  };

  const salesAgents = [
    {
      name: "John Doe",
      commission: 1500,
      tickets: { hold: 35, confirmed: 3, refunded: 0, void: 0, cancelled: 0 }
    },
    {
      name: "Jane Smith",
      commission: 2000,
      tickets: { hold: 40, confirmed: 5, refunded: 1, void: 1, cancelled: 0 }
    },
    // Add more agents as needed
  ];

  const handlePrintReport = async (data, isUserShow) => {
    try {
      const logo = `${NEXT_PUBLIC_PROD_IMAGE_URL}${data?.logo}`
      console.log(logo)
      await generatePDFReport(data, logo, isUserShow);
      enqueueSnackbar("Sales report generated successfully", { variant: "success" });
    } catch (error) {
      console.error("Error generating PDF:", error);
      enqueueSnackbar("Error generating report : " + error.message, { variant: "error" });
    }
  }

  useEffect(() => {
    // if (!userData?.role === "sale" || !userData?.role === "SPO") {
    //   fetchAgencySalesData()
    //   fetchFlightSalesData()
    //   fetchDashboardData()
    // } else {
    //   fetchGraphSalesData("last5years")
    //   fetchFlightSalesData()
    //   fetchDashboardData()
    // }

    if (!initialized.current) {
      initialized.current = true
      fetchGetUsersSalesData()
    }


  }, [])

  console.log(salesReport?.totalStats?.totalEarnings)

  console.log("flightSalesData", flightSalesData)
  const filteredFlightSalesData = flightSalesData.filter(entry => entry.airline !== null);
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button onClick={() => { handlePrintReport(salesReport, true) }} startDecorator={<PrintIcon />}>Print Report</Button>
      </Box>
      {/* Cards Section */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={2}>
          <StatusCard title="Earnings" value={salesReport?.totalStats?.totalEarnings} icon={<AttachMoney color="primary" sx={{ fontSize: '2rem' }} />} isCurrency />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatusCard title="Commission" value={salesReport?.totalStats?.totalCommission} icon={<Payments color="secondary" sx={{ fontSize: '2rem' }} />} isCurrency />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatusCard title="Hold" value={salesReport?.totalStats?.ticketStatusCounts?.hold} icon={<HourglassEmpty color="warning" sx={{ fontSize: '2rem' }} />} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatusCard title="Confirmed" value={salesReport?.totalStats?.ticketStatusCounts?.confirmed} icon={<CheckCircle color="success" sx={{ fontSize: '2rem' }} />} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatusCard title="Refunded" value={salesReport?.totalStats?.ticketStatusCounts?.refunded} icon={<MoneyOff color="error" sx={{ fontSize: '2rem' }} />} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatusCard title="Void" value={salesReport?.totalStats?.ticketStatusCounts?.voided} icon={<Block color="warning" sx={{ fontSize: '2rem' }} />} />
        </Grid>
      </Grid>

      {/* Chart Section */}
      {/* <Sheet
        style={{ width: "100%", height: "28rem", marginTop: "20px" }}
        sx={{ boxShadow: "lg" }}
      >
        <Box
          style={{
            width: "100%",
            height: "4rem",
            display: "flex",
            marginBottom: "30px",
          }}
        >
          <Box
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              padding: "0px 2rem",
            }}
          >
            <Typography level="h3">Flight Counts</Typography>
          </Box>
          <Box
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              padding: "0px 2rem",
              alignItems: "center",
            }}
          >
            <Select
              defaultValue="last5years"
              onChange={(_, newValue) => handleGraphChange(newValue)}
              size="sm"
              style={{
                height: "70%",
                width: "20%",
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
        <Box style={{ width: "100%", height: "25rem" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Sheet> */}

      <Box
        sx={{
          width: "100%",
          marginTop: "30px",
          borderRadius: 'md',
        }}
      >
        <SalesTable {...{ columns: ['Agent Name', 'Earning', 'Commission', 'Hold', 'Confirmed', 'Refunded', 'Void', 'Cancelled', 'Action'], data: salesReport?.userStats ? salesReport?.userStats : [], isSuperAdmin: userData?.role === "super_admin", handlePrintReport, allData: salesReport }} />
      </Box>
    </Box>
  );
};

export default SalesReports;
