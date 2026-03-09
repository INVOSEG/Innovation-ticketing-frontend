import { Box, Button, Divider, Option, Select, Table, Typography } from '@mui/joy'
import React, { useState } from 'react'
import { Pie, PieChart, Cell, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts'
import B2bHeader from '../../components/utils/b2bHeader';
import { NavbarDivData } from '../../utils/DummyData';

const Agency = () => {
    const handleChange = (event, newValue) => {
        alert(`You chose "${newValue}"`);
    };

    const data = [
        { name: 'Group A', value: 600 },
        { name: 'Group B', value: 200 },
        { name: 'Group C', value: 200 },
        { name: 'Group D', value: 100 },
        { name: 'Group E', value: 200 },

    ];
    const COLOR = [{ color: '#0088FE', label: "Label 1" }, { color: '#00C49F', label: "Label 2" }, { color: '#FFBB28', label: "Label 3" }, { color: '#FF8042', label: "Label 4" }, { color: '#008898', label: "Label 5" }];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const data1 = [
        {
            name: 'Mon',
            uv: 4000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: 'Tue',
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: 'Wed',
            uv: 2000,
            pv: 9800,
            amt: 2290,
        },
        {
            name: 'Thru',
            uv: 2780,
            pv: 3908,
            amt: 2000,
        },
        {
            name: 'Fri',
            uv: 1890,
            pv: 4800,
            amt: 2181,
        },
        {
            name: 'Sat',
            uv: 2390,
            pv: 3800,
            amt: 2500,
        },
        {
            name: 'Sun',
            uv: 3490,
            pv: 4300,
            amt: 2100,
        },
    ];

    const [activeDiv, setActiveDiv] = useState(0);
    const [activeOption, setActiveOption] = useState(0);


    return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "2rem" }}>
            <B2bHeader divs={NavbarDivData} activeDiv={activeDiv} setActiveDiv={setActiveDiv} activeOption={activeOption} setActiveOption={setActiveOption} />

            <Box sx={{ width: "95%", height: "20rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                <Box sx={{ width: { xs: "48%", lg: "24%" }, height: "95%", borderRadius: "10px", boxShadow: "5px 5px 20px rgb(0,0,0,0.3)" }}>
                    <Box sx={{ width: "100%", height: "50%", display: "flex" }}>
                        <Box sx={{ width: "40%", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-start", pl: "25px" }}>
                            <Typography sx={{ fontSize: "28px", fontWeight: "600", color: "#FF718B" }}>Sales</Typography>
                        </Box>
                        <Box sx={{ width: "60%", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", pr: "25px" }}>
                            <svg width="95" height="69" viewBox="0 0 95 69" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 67L12.9737 56.1667L17.6574 43.9792L24.6162 61.1772L29.3 53.0522L34.2515 2L46.9647 51.9689L56.1985 35.3126L73.8632 67L79.35 59.0106L82.6956 45.7397L93 35.3126" stroke="#04CE00" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                        </Box>
                    </Box>
                    <Box sx={{ width: "100%", height: "50%", display: "flex", justifyContent: "center", flexDirection: "column", pl: "25px" }}>
                        <Typography sx={{ fontSize: "52px", fontWeight: "700" }}>63k $</Typography>
                        <Typography sx={{ color: "#04CE00" }}>+21.01%</Typography>
                    </Box>

                </Box>
                <Box sx={{ width: { xs: "48%", lg: "24%" }, height: "95%", borderRadius: "10px", boxShadow: "5px 5px 20px rgb(0,0,0,0.3)" }}>
                    <Box sx={{ width: "100%", height: "50%", display: "flex" }}>
                        <Box sx={{ width: "40%", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-start", pl: "25px" }}>
                            <Typography sx={{ fontSize: "28px", fontWeight: "600", color: "#FF718B" }}>Booking</Typography>
                        </Box>
                        <Box sx={{ width: "60%", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", pr: "25px" }}>
                            <svg width="95" height="69" viewBox="0 0 95 69" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 67L12.9737 56.1667L17.6574 43.9792L24.6162 61.1772L29.3 53.0522L34.2515 2L46.9647 51.9689L56.1985 35.3126L73.8632 67L79.35 59.0106L82.6956 45.7397L93 35.3126" stroke="#04CE00" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                        </Box>
                    </Box>
                    <Box sx={{ width: "100%", height: "50%", display: "flex", justifyContent: "center", flexDirection: "column", pl: "25px" }}>
                        <Typography sx={{ fontSize: "52px", fontWeight: "700" }}>35</Typography>
                        <Typography sx={{ color: "#04CE00" }}>+18.34%</Typography>
                    </Box>

                </Box>
                <Box sx={{ width: { xs: "48%", lg: "24%" }, height: "95%", borderRadius: "10px", boxShadow: "5px 5px 20px rgb(0,0,0,0.3)" }}>
                    <Box sx={{ width: "100%", height: "50%", display: "flex" }}>
                        <Box sx={{ width: "40%", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-start", pl: "25px" }}>
                            <Typography sx={{ fontSize: "28px", fontWeight: "600", color: "#FF718B" }}>Revenue</Typography>
                        </Box>
                        <Box sx={{ width: "60%", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", pr: "25px" }}>
                            <svg width="95" height="70" viewBox="0 0 95 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 68L12.9639 58.2875L17.1303 40.6287L23.0508 47.6924L41.6893 31.3579L48.0483 2L58.135 42.3947L73.0458 2L77.4314 49.6789L83.3518 29.592L93 45.485" stroke="#FF718B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                        </Box>
                    </Box>
                    <Box sx={{ width: "100%", height: "50%", display: "flex", justifyContent: "center", flexDirection: "column", pl: "25px" }}>
                        <Typography sx={{ fontSize: "52px", fontWeight: "700" }}>50k $</Typography>
                        <Typography sx={{ color: "#04CE00" }}>-7.69%</Typography>
                    </Box>

                </Box>

                <Box sx={{ width: { xs: "48%", lg: "24%" }, height: "95%", borderRadius: "10px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "5px 5px 20px rgb(0,0,0,0.3)" }}>
                    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", height: "66%", backgroundColor: "#185ea5", borderRadius: "10px", alignItems: "center" }}>
                        <Box sx={{ width: "90%", height: "50%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box sx={{ height: "80px", width: "80px", borderRadius: "50px", display: "flex", justifyContent: "center", alignContent: "center", backgroundColor: "white" }}>
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: "26px", fontWeight: "600", color: "white" }}>Al-Saboor TRAVEL</Typography>
                                <Typography sx={{ fontSize: "16px", color: "white" }}>Agent Code: 00663</Typography>

                            </Box>
                        </Box>
                        <Box sx={{ width: "90%", height: "50%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                            <Box >
                                <Typography sx={{ color: "white" }}>Main Balance</Typography>

                                <Typography sx={{ color: "white" }}>Available Balance</Typography>
                                <Typography sx={{ color: "white" }}>Pending Due</Typography>
                            </Box>
                            <Box>
                                <Typography sx={{ color: "white" }}>Main Balance</Typography>

                                <Typography sx={{ color: "white" }}>Available Balance</Typography>
                                <Typography sx={{ color: "white" }}>Pending Due</Typography>
                            </Box>
                        </Box>

                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", height: "30%", border: "1px solid #185ea5", borderRadius: "10px", alignItems: "center" }}>

                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "50%", width: "90%" }}>
                            <Typography sx={{ color: "#185ea5", fontSize: "26px" }}>Search Itinenary</Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "50%", width: "90%", }}>

                            <Typography sx={{ color: "#C6C6C6", fontSize: "16px" }}>Enter Ref No/PNR/Mobi..</Typography>
                            <Button sx={{ borderRadius: "0px", color: "white", backgroundColor: "#185ea5", width: "120px" }}>Search</Button>
                        </Box>
                    </Box>
                </Box>

            </Box>

            <Box sx={{ height: "22rem", width: "95%", borderRadius: "10px", display: "flex", flexDirection: "column", justifyContent: "space-evenly", boxShadow: "5px 5px 20px rgb(0,0,0,0.3)", mt: { xs: "300px", lg: "0px" } }}>
                <Typography sx={{ fontSize: "28px", pl: "25px", mt: "20px" }}>Top five airlines</Typography>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "65%", width: "100%" }}>
                    <Box sx={{ width: "25%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <PieChart width={375} height={380} >
                            <Pie
                                data={data}
                                cx={180}
                                cy={200}
                                innerRadius={60}
                                outerRadius={85}
                                fill="#8884d8"
                                paddingAngle={0}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </Box>
                    <Box sx={{ width: "25%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <PieChart width={375} height={380} >
                            <Pie
                                data={data}
                                cx={180}
                                cy={200}
                                innerRadius={60}
                                outerRadius={85}
                                fill="#8884d8"
                                paddingAngle={0}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </Box>
                    <Box sx={{ width: "25%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <PieChart width={375} height={380} >
                            <Pie
                                data={data}
                                cx={180}
                                cy={200}
                                innerRadius={60}
                                outerRadius={85}
                                fill="#8884d8"
                                paddingAngle={0}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", gap: "40px", height: "15%", width: "100%", alignItems: "center" }}>
                    {COLOR.map((col, index) => (
                        <Box key={index} sx={{ display: "flex", gap: "10px" }}>
                            <Box sx={{ width: "20px", height: "20px", borderRadius: "30px", backgroundColor: col.color }}></Box>
                            <Typography>{col.label}</Typography>
                        </Box>
                    ))}
                </Box>

            </Box>

            <Box sx={{ width: "95%", height: "25rem", boxShadow: "5px 5px 20px rgb(0,0,0,0.3)", borderRadius: "10px" }}>
                <Typography sx={{ fontSize: "28px", pl: "25px", mt: "20px" }}>Top five sector</Typography>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80%", width: "100%", gap: "10px" }}>
                    <Box sx={{ width: "24%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <PieChart width={375} height={380} >
                            <Pie
                                data={data}
                                cx={180}
                                cy={200}
                                innerRadius={60}
                                outerRadius={85}
                                fill="#8884d8"
                                paddingAngle={0}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </Box>
                    <Box sx={{ width: "74%", height: "100%" }}>
                        <Table
                            aria-label="basic table"
                            sx={{ width: "80%" }}
                        >
                            <thead>
                                <tr>
                                    <th style={{ width: "60%" }}>Label</th>
                                    <th>Value</th>
                                    <th>%</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>  <Box sx={{ display: "flex", gap: "10px" }}>
                                        <Box sx={{ width: "20px", height: "20px", borderRadius: "30px", backgroundColor: '#0088FE' }}></Box>
                                        <Typography>Label 1</Typography>
                                    </Box></td>
                                    <td>159</td>
                                    <td>6</td>
                                </tr>
                                <tr>
                                    <td>  <Box sx={{ display: "flex", gap: "10px" }}>
                                        <Box sx={{ width: "20px", height: "20px", borderRadius: "30px", backgroundColor: '#00C49F' }}></Box>
                                        <Typography>Label 2</Typography>
                                    </Box></td>
                                    <td>237</td>
                                    <td>9</td>
                                </tr>
                                <tr>
                                    <td>  <Box sx={{ display: "flex", gap: "10px" }}>
                                        <Box sx={{ width: "20px", height: "20px", borderRadius: "30px", backgroundColor: '#FFBB28' }}></Box>
                                        <Typography>Label 3</Typography>
                                    </Box></td>
                                    <td>262</td>
                                    <td>16</td>
                                </tr>
                                <tr>
                                    <td>  <Box sx={{ display: "flex", gap: "10px" }}>
                                        <Box sx={{ width: "20px", height: "20px", borderRadius: "30px", backgroundColor: '#FF8042' }}></Box>
                                        <Typography>Label 4</Typography>
                                    </Box></td>
                                    <td>305</td>
                                    <td>3.7</td>
                                </tr>
                                <tr>
                                    <td>  <Box sx={{ display: "flex", gap: "10px" }}>
                                        <Box sx={{ width: "20px", height: "20px", borderRadius: "30px", backgroundColor: '#FF3046' }}></Box>
                                        <Typography>Label 5</Typography>
                                    </Box></td>
                                    <td>356</td>
                                    <td>16</td>
                                </tr>
                            </tbody>
                        </Table>

                    </Box>
                </Box>
            </Box>

            <Box sx={{ height: "30rem", width: "95%", borderRadius: "10px" }}>
                <Box sx={{ width: "100%", height: "20%", display: "flex", justifyContent: "space-between" }}>
                    <Box sx={{ height: "100%", width: "25%", display: "flex", alignItems: "center", gap: "20px", pl: "25px" }}>
                        <Typography sx={{ textDecoration: "underline", fontSize: "24px" }}>Sales</Typography>
                        <Typography sx={{ fontSize: "22px" }}>Revenue</Typography>
                    </Box>
                    <Box sx={{ height: "100%", width: "25%", display: "flex", alignItems: "center", justifyContent: "flex-end", pr: "25px" }}>
                        <Select defaultValue="weekly" onChange={handleChange} sx={{ width: "150px" }}>
                            <Option value="weekly">Weekly</Option>
                            <Option value="monthly">Monthly</Option>
                            <Option value="yearly">Yearly</Option>
                        </Select> </Box>
                </Box>
                <Box sx={{ width: "100%", height: "80%" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={500}
                            height={300}
                            data={data1}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            {/* <CartesianGrid strokeDasharray="3 3" /> */}
                            <XAxis dataKey="name" style={{ backgroundColor: "yellow" }} />
                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                            {/* <Tooltip /> */}
                            <Bar yAxisId="left" dataKey="pv" fill="#185ea5" />
                            <Bar yAxisId="left" dataKey="uv" fill="#185ea5" />
                            <Bar yAxisId="right" dataKey="amt" fill="#185ea5" />
                            <Bar yAxisId="right" dataKey="uv" fill="#185ea5" />

                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </Box>
    )
}

export default Agency