import React, { useEffect, useRef, useState } from 'react'
import B2bHeader from '../../components/utils/b2bHeader'
import { Box, Button, Card, CardContent, Grid, Option, Select, Typography } from '@mui/joy';
import StatusCard from '../../pages-components/Report/StatusCard';
import { setLoading } from '../../redux/reducer/loaderSlice';
import { getAgentBooking, getSaleGraph, getUsersSales } from '../../server/api';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import {
    HourglassEmpty, CheckCircle, MoneyOff, Block, Cancel, AttachMoney, Payments
} from '@mui/icons-material';
import PrintIcon from '@mui/icons-material/Print';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { NEXT_PUBLIC_PROD_IMAGE_URL } from '../../env';
import { generatePDFReport } from '../../pages-components/Report/ReportPdf';
import { NavbarDivData } from '../../utils/DummyData';
import AgentTable from '../../pages-components/Report/AgentTable';

const SaleReport = () => {
    const dispatch = useDispatch()
    const { enqueueSnackbar } = useSnackbar();

    const [activeDiv, setActiveDiv] = useState(1);
    const [activeOption, setActiveOption] = useState(0);
    const [salesReport, setSalesReport] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState("thisYear");
    const [salesData, setSalesData] = useState([]);
    const [bookingData, setBookingData] = useState([])
    const initialized = useRef(false)


    const handlePrintReport = async (data, isUserShow, isAgentShow, agentData) => {
        try {
            const logo = `${NEXT_PUBLIC_PROD_IMAGE_URL}${data?.logo}`
            await generatePDFReport(data, logo, isUserShow, isAgentShow, agentData);
            enqueueSnackbar("Sales report generated successfully", { variant: "success" });
        } catch (error) {
            console.error("Error generating PDF:", error);
            enqueueSnackbar("Error generating report : " + error.message, { variant: "error" });
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

    const fetchGraphSalesData = (value) => {
        getSaleGraph(value ? value : selectedPeriod)?.then((res) => {
            setSalesData(res?.result?.statsByStatus);
        }).catch((err) => {
            console.log(err)
        })
    }

    const fetchGetAgentBooking = () => {
        getAgentBooking()?.then((res) => {
            console.log(res)
            setBookingData(res?.result);
        })?.catch((err) => {
            console.log(err)
        })
    }

    const handleGraphChange = (newValue) => {
        setSelectedPeriod(newValue);
        fetchGraphSalesData(newValue);
    };

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            fetchGetUsersSalesData()
            fetchGraphSalesData()
            fetchGetAgentBooking()
        }
    }, [])

    console.log(salesReport)

    return (
        <>
            <B2bHeader divs={NavbarDivData} activeDiv={activeDiv} setActiveDiv={setActiveDiv} activeOption={activeOption} setActiveOption={setActiveOption} showDiv={true} hidePromotion={true} />

            <Box sx={{ m: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button onClick={() => { handlePrintReport(salesReport, false, true, bookingData) }} startDecorator={<PrintIcon />}>Print Report</Button>
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
                        <StatusCard title="Void" value={salesReport?.totalStats?.ticketStatusCounts?.void} icon={<Block color="warning" sx={{ fontSize: '2rem' }} />} />
                    </Grid>
                </Grid>

                <AgentTable {...{ data: bookingData }} />

                {/* <Card sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography level="h2">Sales Chart</Typography>
                        <Select
                            defaultValue="last5Years"
                            onChange={(_, newValue) => handleGraphChange(newValue)}
                            size="sm"
                            style={{
                                height: "70%",
                                width: "10%",
                                // color: "#CCD6E0",
                                border: "1px solid #CCD6E0",
                            }}
                        >
                            <Option value="last5Years">Last 5 Years</Option>
                            <Option value="thisYear">This Year</Option>
                            <Option value="thisMonth">Monthly</Option>
                            <Option value="thisWeek">Weekly</Option>

                        </Select>
                    </Box>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={600}>
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="sales" fill="#8884d8" />
                                <Bar dataKey="commission" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card> */}
            </Box>

        </>
    )
}

export default SaleReport