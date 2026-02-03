import { Box, Chip, Table, Textarea, Tooltip, Typography } from '@mui/joy'
import React, { useState } from 'react'
import { copyToClipboard, truncateString } from '../../utils/HelperFunctions';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ViewBooking from '../../components/Drawers/ViewBooking';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { formatDate } from '../../components/utils';

function RowMenu({ flight, toggleDrawer }) {
    return (
        <>
            <Tooltip
                arrow={false}
                color="neutral"
                size="md"
                variant="solid"
                title="View Detail"
            >
                <RemoveRedEyeIcon onClick={toggleDrawer(true, flight.id, flight.api)} sx={{ fontSize: '25px', cursor: 'pointer', marginRight: '5px' }} />
            </Tooltip>
        </>
    );
}


const AgentTable = ({ data }) => {
    const [searchText, setSearchText] = useState('');
    const [state, setState] = useState(false);

    const filteredData = data.filter(item =>
        item.id.toLowerCase().includes(searchText.toLowerCase())
    );

    const toggleDrawer = (open, id, apiName) => async (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        if (!open) {
            setState(false);
            return;
        }

        setState({ value: open, id, api: apiName })
    };

    return (
        <Box
            sx={{
                p: 2,
                width: "98%",
                border: "1px solid #CCD6E0",
                borderRadius: 'md'
            }}
        >
            <Box style={{ width: "100%", height: "5rem", display: "flex" }}>
                <Box style={{ width: "60%", display: "flex", alignItems: "center" }}>
                    <Typography level="h3">Agent Sales Detail</Typography>
                </Box>

                <Box style={{ width: "40%", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                    <Textarea
                        placeholder={`Search by PNR`}
                        onChange={(e) => setSearchText(e.target.value)}
                        value={searchText}
                    />
                </Box>
            </Box>

            <Box style={{ width: "100%" }}>
                <Table aria-label="basic table">
                    <thead>
                        <tr>
                            {['Traveller Name', 'Price', 'Created On', 'Booking Date', 'Airline Code', 'Status', 'PNR', 'Action']?.map((item, index) => (
                                <th style={{ textAlign: 'center' }} key={index}>{item}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((row, index) => (
                                <tr key={index}>
                                    <td style={{ textAlign: 'center' }}>{row.travelers[0]?.name?.lastName || row.travelers[0]?.name?.firstName ? `${row.travelers[0]?.name?.lastName}/${row.travelers[0]?.name?.firstName}` : 'N/A'}</td>
                                    <td style={{ textAlign: 'center' }}>{row?.finalPrice ? `RS. ${row?.finalPrice}` : 'N/A'}</td>
                                    <td style={{ textAlign: 'center' }}>{row.flightOffers[0]?.itineraries[0]?.segments[0]?.departure?.at ? formatDate(row.flightOffers[0]?.itineraries[0]?.segments[0]?.departure?.at) : 'N/A'}</td>
                                    <td style={{ textAlign: 'center' }}>{row.createdAt ? formatDate(row.createdAt) : 'N/A'}</td>
                                    <td style={{ textAlign: 'center' }}>{row.flightOffers[0]?.itineraries[0]?.segments[0]?.carrierCode && row.flightOffers[0]?.itineraries[0]?.segments[0].number ? `${row.flightOffers[0]?.itineraries[0]?.segments[0]?.carrierCode}-${row.flightOffers[0]?.itineraries[0]?.segments[0].number}` : row.flightOffers[0]?.itineraries[0]?.segments[0]?.operating?.carrierCode && row.flightOffers[0]?.itineraries[0]?.segments[0].carrierCode ? `${row.flightOffers[0]?.itineraries[0]?.segments[0]?.operating?.carrierCode}-${row.flightOffers[0]?.itineraries[0]?.segments[0].carrierCode}` : 'N/A'}</td>
                                    <td style={{ textAlign: 'center' }}>{row?.status === "hold" ? <Chip
                                        color="warning"
                                        variant="solid"
                                    >
                                        Hold
                                    </Chip> : row?.status === "canceled" ? <Chip
                                        color="danger"
                                        variant="solid"
                                    >
                                        Cancelled
                                    </Chip> : row?.status === "voided" ? <Chip
                                        color="danger"
                                        variant="solid"
                                    >
                                        Voided
                                    </Chip> : row?.status === "confirmed" ? <Chip
                                        color="success"
                                        variant="solid"
                                    >
                                        Confirmed
                                    </Chip> : row?.status === "refunded" ? <Chip
                                        color="danger"
                                        variant="solid"
                                    >
                                        Refunded
                                    </Chip> : <Chip
                                        color="warning"
                                        variant="solid"
                                    >
                                        N/A
                                    </Chip>}</td>
                                    <td style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        {truncateString(row.id, 17) || 'N/A'}
                                        {row.id && (
                                            <ContentCopyIcon sx={{ marginLeft: '8px', cursor: 'pointer' }} onClick={() => copyToClipboard(row.id, 'PNR number')} />
                                        )}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <RowMenu flight={row} toggleDrawer={toggleDrawer} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} style={{ textAlign: 'center', fontSize: '1rem', fontWeight: 'bold', height: '10vh' }}>
                                    No Data Found!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Box>
            {state?.value && (
                <ViewBooking {...{ state: state?.value, setState, toggleDrawer, id: state?.id, api: state?.api }} />
            )}
        </Box>
    )
}

export default AgentTable;
