import React from "react";
import { Typography } from "@mui/joy";
import Box from "@mui/joy/Box";
import AppButton from "../../components/common/AppButton";

const BookingFooter = () => {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "black",
        marginTop: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: { lg: "32rem", xl: "32rem" },
      }}
    >
      <Box sx={{ width: "70%", height: "90%" }}>
        <Box sx={{ width: "100%", height: "50%", display: "flex" }}>
          <Box
            sx={{
              width: "100%",
              height: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              pt: "1rem",
              gap: "10px",
            }}
          >
            <Typography level="h3" sx={{ color: "white" }}>
              Products and services
            </Typography>
            <Typography sx={{ color: "white", textDecoration: "underline" }}>
              Products and services
            </Typography>
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              pt: "1rem",
              gap: "10px",
            }}
          >
            <Typography level="h3" sx={{ color: "white" }}>
              About Us
            </Typography>
            <Typography sx={{ color: "white", textDecoration: "underline" }}>
              About us
            </Typography>
            <Typography sx={{ color: "white", textDecoration: "underline" }}>
              Terms and Conditions
            </Typography>
            <Typography sx={{ color: "white", textDecoration: "underline" }}>
              Privacy Policy
            </Typography>
            <Typography sx={{ color: "white", textDecoration: "underline" }}>
              Information on cookies
            </Typography>
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              pt: "1rem",
              gap: "10px",
            }}
          >
            <Typography level="h3" sx={{ color: "white" }}>
              Support
            </Typography>
            <Typography sx={{ color: "white", textDecoration: "underline" }}>
              Contact us
            </Typography>
            <Typography sx={{ color: "white", textDecoration: "underline" }}>
              FAQs
            </Typography>
            <Typography sx={{ color: "white", textDecoration: "underline" }}>
              Airline Information
            </Typography>
            <Typography sx={{ color: "white", textDecoration: "underline" }}>
              My Bookings
            </Typography>
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              pt: "1rem",
              gap: "10px",
            }}
          >
            <Typography level="h3" sx={{ color: "white" }}>
              Login
            </Typography>
            <AppButton
              text="My Booking"
              borderColor="white"
              bgColor="transparent"
              color="white"
            />
          </Box>
        </Box>

        <Box sx={{ width: "100%", height: "50%", display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <img src="Visa.png" height="60px" alt="Visa" />
            <img src="Mastercard.png" height="60px" alt="Mastercard" />
            <img src="Discover.png" height="60px" alt="Discover" />
            <img src="Google.png" height="60px" alt="Google" />
            <img src="Paypal.png" height="60px" alt="Paypal" />
          </Box>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: "10px",
            }}
          >
            <img src="Amadeus.png" height="60px" alt="Amadeus" />
            <img src="IATA.png" height="60px" alt="IATA" />
            <img src="Amadeus.png" height="60px" alt="Amadeus" />
          </Box>

          <Box sx={{ width: "100%", textAlign: "center", pt: "10px" }}>
            <Typography sx={{ color: "white" }}>
              Al-Saboor / Flight Network UK Ltd, Unit 112854, PO Box 6945, London, W1A 6US, United Kingdom
            </Typography>
            <Typography sx={{ color: "white", mt: "5px" }}>
              © 2024 Al-Saboor. All Rights Reserved.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BookingFooter;
