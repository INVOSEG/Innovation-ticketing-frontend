import { Box, Grid, Typography } from "@mui/joy";
import React from "react";

const FlexiHourTravelAgent = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: {
          sm: "auto",
          md: "auto",
          lg: "45rem",
          xl: "45rem",
        },
        backgroundColor: "#dd8329",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <Box
        sx={{
          width: "70%",
          height: {
            sm: "auto",
            md: "auto",
            lg: "45%",
            xl: "45%",
          },
          borderBottom: "dashed 2px white",
          display: {
            sm: "block",
            md: "block",
            lg: "flex",
            xl: "flex",
          },
        }}
      >
        <Box
          sx={{
            width: {
              sm: "100%%",
              md: "100%",
              lg: "50%",
              xl: "50%",
            },
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            py: "20px",
          }}
        >
          <Typography level="h2" sx={{ color: "white" }}>
            Start your Flexi hour home based business! Become a Part-Time travel
            Agent
          </Typography>
          <Typography level="h6" sx={{ color: "white", fontSize: "22px" }}>
            Whether you are a housemaker or someone looking for a side income –
            becoming a travel agent can be started from a small office or even
            from the comfort of your home with all the training and support
            provided by Al-Saboor.
          </Typography>
        </Box>
        <Box
          sx={{
            width: {
              sm: "100%%",
              md: "100%",
              lg: "50%",
              xl: "50%",
            },
            height: "100%",
            display: "flex",
            justifyContent: "space-evenly",
            gap: "20px",
            alignItems: "center",
            pb: "20px",
          }}
        >
          <img
            // src="https://omcontent.akbartravels.com/omagents/V2/assets/images/travel-agent3.png"
            style={{
              border: "5px solid white",
              background: "#fff",
              borderRadius: "43%",
            }}
          ></img>
          <img
            // src="https://omcontent.akbartravels.com/omagents/V2/assets/images/travel-agent4.png"
            style={{
              border: "5px solid white",
              background: "#fff",
              borderRadius: "43%",
            }}
          ></img>
        </Box>
      </Box>
      <Box
        sx={{
          width: "70%",
          height: {
            sm: "auto",
            md: "auto",
            lg: "45%",
            xl: "45%",
          },
          display: "flex",
          borderTop: "dashed 2px white",
          display: { lg: "flex" },
        }}
      >
        <Box
          sx={{
            width: {
              xs: "100%%",
              lg: "50%",
            },
            height: "100%",
            display: "flex",
            justifyContent: "space-evenly",
            gap: "20px",
            alignItems: "center",
            py: "20px",
          }}
        >
          <img
            // src="https://omcontent.akbartravels.com/omagents/V2/assets/images/travel-agent1.png"
            style={{
              border: "5px solid white",
              background: "#fff",
              borderRadius: "43%",
            }}
          ></img>
          <img
            // src="https://omcontent.akbartravels.com/omagents/V2/assets/images/travel-agent2.png"
            style={{
              border: "5px solid white",
              background: "#fff",
              borderRadius: "43%",
            }}
          ></img>
        </Box>

        <Box
          sx={{
            width: {
              xs: "100%%",
              lg: "50%",
            },
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            py: "20px",
          }}
        >
          <Typography level="h2" sx={{ color: "white" }}>
            Become a Professional Travel Agent
          </Typography>
          <Typography level="h6" sx={{ color: "white", fontSize: "22px" }}>
            Are you eager to join the modern and dynamic travel industry and
            dream of earning great commission? If yes, then join us today and
            become a professional travel agent. Don't worry if you don't know
            what it takes to become a professional travel agent. Al-Saboor
            will provide you with the required support.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default FlexiHourTravelAgent;
