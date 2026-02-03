import React, { useEffect, useState } from 'react';
import { Modal, Table, Sheet, ModalClose, Typography, Box, Select, Option, Tooltip } from '@mui/joy';
import { formatDate } from '../utils';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InvoiceDrawer from '../Drawers/InvoiceDrawer';
import { enqueueSnackbar } from 'notistack';

function FilterDropdown({ handleChange }) {

    return (
        <Select defaultValue="all" onChange={handleChange} sx={{ mb: 1, mr: 4 }} variant="soft">
            <Option value="all">All</Option>
            <Option value="today">Today</Option>
            <Option value="yesterday">Yesterday</Option>
            <Option value="week">This Week</Option>
            <Option value="month">This Month</Option>
        </Select>
    );
}

const LedgerModal = ({ open, setOpen, agentName, data: infoData }) => {
    const [tableData, setTableData] = useState([]);
    const [openDrawer, setOpenDrawer] = useState(false);

    const toggleDrawer = (inOpen, haveInvoice) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        if (!haveInvoice) {
            setOpenDrawer(inOpen);
        } else {
            enqueueSnackbar("Invoice is not available!", { variant: "warning" });
        }


    };

    const handleChange = (event, newValue) => {
        let filtered;

        // Get the current date, start of the week, and start of the month
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Start of the current week (Sunday)
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Start of the current month

        // Reset today's date for comparisons
        const currentDate = new Date(today);

        if (newValue === "today") {
            filtered = infoData.filter((row) => {
                const bookingDate = new Date(row.createdAt);
                return bookingDate.toDateString() === currentDate.toDateString();
            });
        } else if (newValue === "yesterday") {
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);
            filtered = infoData.filter((row) => {
                const bookingDate = new Date(row.createdAt);
                return bookingDate.toDateString() === yesterday.toDateString();
            });
        } else if (newValue === "week") {
            filtered = infoData.filter((row) => {
                const bookingDate = new Date(row.createdAt);
                return bookingDate >= startOfWeek;
            });
        } else if (newValue === "month") {
            filtered = infoData.filter((row) => {
                const bookingDate = new Date(row.createdAt);
                return bookingDate >= startOfMonth;
            });
        } else {
            // 'all' case - return all data
            filtered = infoData;
        }

        setTableData(filtered);
    };

    useEffect(() => {
        if (infoData) {
            setTableData(infoData)
        }
    }, [infoData]);

    return (
        <>
            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={open}
                onClose={() => setOpen(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Sheet
                    variant="outlined"
                    sx={{ maxWidth: 1200, borderRadius: 'md', p: 3, boxShadow: 'lg', height: 400, overflowY: 'auto' }}
                >
                    <ModalClose variant="plain" sx={{ m: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: "center", justifyContent: 'space-between' }}>

                        <Typography
                            component="h2"
                            id="modal-title"
                            level="h4"
                            textColor="inherit"
                            sx={{ fontWeight: 'lg', mb: 1 }}
                        >
                            {agentName} Performance Detail
                        </Typography>
                        <FilterDropdown {...{ handleChange }} />
                    </Box>
                    <Table aria-label="Example table">
                        <thead>
                            <tr>
                                <th>Invoice ID</th>
                                <th>PNR</th>
                                <th>Ticket Date</th>
                                <th>Booking Date</th>
                                <th>Airline Code</th>
                                <th>Ticket Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData?.map((row, index) => (
                                <tr>
                                    {/* <td style={{ width: '30%' }}>{row._id}</td> */}
                                    <td>{row.invoiceNumber?.invoiceNumber || "N/A"}</td>
                                    <td style={{ wordBreak: 'break-all' }}>{row.id}</td>
                                    <td>
                                        {row.flightOffers[0]?.itineraries[0]?.segments[0]
                                            ?.departure?.at
                                            ? formatDate(
                                                row.flightOffers[0]?.itineraries[0]
                                                    ?.segments[0]?.departure?.at
                                            )
                                            : "N/A"}
                                    </td>
                                    <td>
                                        {row.createdAt ? formatDate(row.createdAt) : "N/A"}
                                    </td>
                                    <td>
                                        {row.flightOffers[0]?.itineraries[0]?.segments[0]
                                            ?.operating?.carrierCode || row.flightOffers[0]?.itineraries[0]?.segments[0]?.carrierCode || "N/A"}
                                    </td>
                                    <td>RS. {row.finalPrice || "N/A"}</td>
                                    <td>
                                        <Tooltip arrow placement="right" title="View Invoice">
                                            <VisibilityIcon sx={{ fontSize: '30px', cursor: 'pointer' }} onClick={toggleDrawer(true, true)} />
                                        </Tooltip>
                                    </td>
                                </tr>
                            ))}

                            {tableData?.length === 0 && (
                                <Typography
                                    component="h2"
                                    id="modal-title"
                                    level="h4"
                                    textColor="inherit"
                                    sx={{ width: '120vh', textAlign: 'center', margin: '20px' }}
                                >
                                    No Data Found!
                                </Typography>
                            )}
                        </tbody>
                    </Table>
                </Sheet>
            </Modal>
            {openDrawer && (
                <InvoiceDrawer {...{ toggleDrawer }} />
            )}
        </>
    );
};

export default LedgerModal;
