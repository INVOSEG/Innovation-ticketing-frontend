import { Box, Divider, Typography } from "@mui/joy";
import React from "react";

const ComponentWrapper = ({ text, children }) => {
    return (
        <Box >
            <Typography level="h5">{text}</Typography>
            <Divider orientation="horizontal" sx={{ mb: 2, mt: 2 }} />
            {children}
        </Box>
    );
};

export default ComponentWrapper;
