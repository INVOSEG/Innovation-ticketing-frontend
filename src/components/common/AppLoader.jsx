import * as React from "react";
import Stack from "@mui/material/Stack";
import CircularProgress from '@mui/joy/CircularProgress';
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";

export default function AppLoader() {
  const loading = useSelector((state) => state.loading.loading);
  if (!loading) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        zIndex: 1300, // Ensure it overlays everything
      }}
    >
      <Stack sx={{ color: "grey.500" }} spacing={2} direction="row">
        {/* <CircularProgress color="neutral" size="md" /> */}
      </Stack>
      <img src={require("../../images/9.gif")} />
    </Box>
  );
}