import * as React from 'react';
import Box from "@mui/joy/Box"
import Drawer from "@mui/joy/Drawer"
import Typography from "@mui/joy/Typography"
import Divider from "@mui/joy/Divider"
import Sheet from "@mui/joy/Sheet"
import IconButton from "@mui/joy/IconButton"
import CloseRounded from "@mui/icons-material/CloseRounded"


export default function InvoiceDrawer({ toggleDrawer }) {

    const data = {
        invoiceNumber: "INV_01",
        generalInformation: {},
        ticket: {},
        hotel: {},
        transport: {},
        visa: {},
        otherServices: {},
        invoiceSummery: {},
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                size="lg"
                variant="plain"
                open={open}
                onClose={toggleDrawer(false)}
                anchor="right"
                sx={{ "--Drawer-widthRight": "400px" }}
            >
                <Sheet
                    sx={{
                        borderRadius: "md",
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        height: "100%",
                        overflow: "auto",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography level="h4" component="h1">
                            Invoice Details
                        </Typography>
                        <IconButton onClick={toggleDrawer(false)} variant="plain" color="neutral" size="sm">
                            <CloseRounded />
                        </IconButton>
                    </Box>
                    <Divider />
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography level="title-lg">General Information</Typography>
                        <Typography>Customer Name: {data?.generalInformation?.customer || 'N/A'}</Typography>
                        <Typography>Status: {data?.generalInformation?.status || 'N/A'}</Typography>
                        <Typography>Invoice Number: {data?.generalInformation?.invNo || 'N/A'}</Typography>
                        <Typography>Invoice Date: {data?.generalInformation?.invDate || 'N/A'}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography level="title-lg">Flight Information</Typography>
                        <Typography>Sector: {data?.ticket?.sector || 'N/A'}</Typography>
                        <Typography>Airline: {data?.ticket?.airline || 'N/A'}</Typography>
                        <Typography>Category: {data?.ticket?.category || 'N/A'}</Typography>
                        <Typography>Date: {data?.ticket?.issueDate || 'N/A'}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography level="title-lg">Hotel Information</Typography>
                        <Typography>Name: {data?.hotel?.hotel || 'N/A'}</Typography>
                        <Typography>Check-in: {data?.hotel?.checkInDate || 'N/A'}</Typography>
                        <Typography>Check-out: {data?.hotel?.checkOutDate || 'N/A'}</Typography>
                    </Box>
                    <Divider />
                    {/* <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography level="title-lg">Transport Information</Typography>
                        <Typography>Type: Sharing Bus</Typography>
                        <Typography>Details: N/A</Typography>
                    </Box> */}
                    {/* <Divider />
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography level="title-lg">Other Services</Typography>
            {invoiceDetails.otherServices.map((service, index) => (
              <Typography key={index}>{service}</Typography>
            ))}
          </Box> */}
                </Sheet>
            </Drawer>
        </Box>
    );
}
