import { Box, Grid, Typography } from "@mui/joy";
import React from "react";

const Contactus = () => {
  return (
    <Box>
      <Grid
        container
        spacing={4}
        sx={{
          padding: { xs: "20px", sm: "40px", md: "60px" },
          overflowX: "hidden",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Grid
          item
          xs={12}
          sm={6}
          md={6}
          container
          justifyContent="center"
          sx={{
            position: "relative",
            textAlign: "center",
            overflow: "hidden",
            order: { xs: 1, md: 0 },
            width: { xs: "100%", md: "50%" },
          }}
        >
          <img
            src={require("../../../images/contact-us.png")}
            alt="Contact Us"
            style={{ width: "100%", maxWidth: "600px", height: "auto" }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "start",
              padding: "20px",
              maxWidth: "90%",
              boxSizing: "border-box",
            }}
          >
            <Typography level="h1" sx={{ color: "white", fontWeight: "200" }}>
              Download
            </Typography>
            <Typography level="h1" sx={{ color: "white" }}>
              Our Mobile App
            </Typography>
            <div style={{ marginTop: "20px" }}>
              <img
                style={{
                  marginRight: "10px",
                  cursor: "pointer",
                  maxWidth: "45%",
                }}
                // src="https://omcontent.akbartravels.com/omagents/V2/assets/images/appstore.png"
                alt="App Store"
              />
              <img
                sx={{
                  cursor: "pointer",
                  maxWidth: "45%",
                }}
                // src="https://omcontent.akbartravels.com/omagents/V2/assets/images/googleplay.png"
                alt="Google Play"
              />
            </div>
            <div style={{ marginTop: "40px" }}>
              <img
                // src={
                //   "https://omcontent.akbartravels.com/omagents/V2/assets/v2images/new/applinkqr/omqr.png"
                // }
                width="172"
                height="172"
                alt="Scan Here"
              />
              <Typography
                level="body-xs"
                sx={{ color: "white", width: "172px", textAlign: "center" }}
              >
                Scan the QR Code to download the Al-Saboor Travels Mobile App
              </Typography>
            </div>
          </div>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "40px",
            order: { xs: 2, md: 1 },
            width: { xs: "100%", md: "50%" },
          }}
        >
          <Box
            sx={{
              background: "#f9fce5",
              borderRadius: "30px",
              padding: "26px 40px",
              display: "flex",
              flexDirection: "column",
              gap: "22px",
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "row", gap: "18px" }}>
              <img
                // src={
                //   "https://omcontent.akbartravels.com/omagents/V2/assets/images/headphones.svg"
                // }
                alt="Headphones"
                style={{ maxWidth: "100%", height: "auto" }}
              />
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <Typography level="h2">Customer Support</Typography>
                <Typography level="h4">+968 2413 1555</Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Typography level="h3">Call us anytime!</Typography>
              <Typography sx={{ fontSize: "20px" }}>
                We will be more than happy to help you with our superior
                customer support!
              </Typography>
            </Box>
          </Box>

          <Box>
            <Box sx={{ marginBottom: "20px" }}>
              <Typography sx={{ fontSize: "34px", fontWeight: "700" }}>
                Come Join Us Today
              </Typography>
              <Typography
                level="title-lg"
                sx={{ fontSize: "25px", fontWeight: "400" }}
              >
                Already a Travel Agent? Become one of the Best!
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: "400",
                fontStyle: "italic",
                lineHeight: "30px",
                width: "100%",
              }}
            >
              Enjoy the highest commissions in the industry, becoming a travel
              agent is easier than you think!
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Contactus;
