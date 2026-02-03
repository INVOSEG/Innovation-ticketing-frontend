import { Box, Table, Textarea, Tooltip, Typography } from '@mui/joy'
import React, { useState } from 'react'
import PrintIcon from '@mui/icons-material/Print';

const SalesTable = ({ columns, data, isSuperAdmin, handlePrintReport, allData }) => {
    const [searchText, setSearchText] = useState('');

    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <Box
            sx={{
                p: 2,
                width: "100%",
                border: "1px solid #CCD6E0",
                borderRadius: 'md'
            }}
        >
            <Box style={{ width: "100%", height: "5rem", display: "flex" }}>
                <Box style={{ width: "60%", display: "flex", alignItems: "center" }}>
                    <Typography level="h3">Agency Sales Summary</Typography>
                </Box>

                <Box style={{ width: "40%", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                    <Textarea
                        placeholder={`Search by agent`}
                        onChange={(e) => setSearchText(e.target.value)}
                        value={searchText}
                    />
                </Box>
            </Box>

            <Box style={{ width: "100%" }}>
                <Table aria-label="basic table">
                    <thead>
                        <tr>
                            {columns?.map((item, index) => (
                                <th key={index}>{item}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item?.name}</td>
                                    <td>RS. {item?.totalEarnings}</td>
                                    <td>RS. {item?.totalCommission}</td>
                                    <td>{item?.tickets.hold}</td>
                                    <td>{item?.tickets.confirmed}</td>
                                    <td>{item?.tickets.refunded}</td>
                                    <td>{item?.tickets.voided}</td>
                                    <td>{item?.tickets.canceled}</td>
                                    <td>
                                        <Tooltip title="Print report" variant="solid" onClick={() => { alert('coming soon!') }}>
                                            <PrintIcon onClick={() => handlePrintReport({ ...allData, userStats: item }, false)} sx={{ fontSize: '25px', cursor: 'pointer' }} />
                                        </Tooltip>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} style={{ textAlign: 'center', fontSize: '1rem', fontWeight: 'bold', height: '10vh' }}>
                                    No Data Found!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Box>
        </Box>
    )
}

export default SalesTable;
