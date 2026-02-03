import { Box, Divider, Typography } from "@mui/joy";
import React, { useState } from "react";
import { formatDate, formatDuration } from "../../components/utils";
import AppButton from "../../components/common/AppButton";
import CustomTypography from "../../components/common/CustomTyprography";
const Ticket = ({ flight, handleTicketSelect, handleBaggage, baggage, handleRuleClick }) => {




  return (
    <Box
      sx={{
        backgroundColor: "#F0F3F5",
        borderRadius: 'md',
        border: "1px solid #CCD6E0",

      }}
    >
      <Box>
        <CustomTypography
          level="h4"
          sx={{
            p: "0.5rem 0.5rem"

          }}
        >
          {flight?.api}
        </CustomTypography>
      </Box>
      <Box sx={{ width: "100%", display: "flex" }}>
        <Box
          sx={{
            width: "80%",
            height: "100%",
            py: 1.2,
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "auto",
              display: "flex",
              justifyContent: "space-around",
              gap: 2
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "20%",
                gap: '5px',
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <CustomTypography>Flight Number</CustomTypography>
              <CustomTypography>
                {flight.departure?.marketingFlightNumber}
              </CustomTypography>
            </Box>
            <Box
              sx={{
                display: "flex",
                width: "10%",
                gap: "5px",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <CustomTypography>Airline</CustomTypography>

              <CustomTypography>{flight.departure?.marketing}</CustomTypography>
            </Box>

            <Box sx={{ display: "flex", gap: "10px", width: "70%" }}>
              <Box
                sx={{
                  width: "30%",
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <CustomTypography>
                  {flight.departure?.departureLocation}
                </CustomTypography>{" "}
                <CustomTypography>
                  {formatDate(flight.departure?.departureTime)}
                </CustomTypography>
              </Box>
              <Box
                sx={{
                  px: 1.2,
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                {" "}
                <Box sx={{ width: "5.5rem", border: "1px solid black" }}></Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "20%",
                }}
              >
                <CustomTypography>
                  {flight.departure.stopCount
                    ? `${flight.departure.stopCount} Stops`
                    : "Non Stop"}
                </CustomTypography>
                <CustomTypography>
                  {formatDuration(flight.departure?.elapsedTime)}
                </CustomTypography>
              </Box>
              <Box
                sx={{
                  px: 1.2,

                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                {" "}
                <Box sx={{ width: "5.5rem", border: "1px solid black" }}></Box>
              </Box>
              <Box
                sx={{
                  width: "30%",
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <CustomTypography>
                  {flight.departure.arrivalLocation}
                </CustomTypography>{" "}
                <CustomTypography>
                  {formatDate(flight.departure.arrivalTime)}
                </CustomTypography>
              </Box>
            </Box>
          </Box>

          {flight.return && (
            <Box
              sx={{
                width: "100%",
                height: "auto",
                gap: 2,
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  width: "20%",
                  gap: "5px",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <CustomTypography>Flight Number</CustomTypography>
                <CustomTypography>
                  {flight.return?.marketingFlightNumber}
                </CustomTypography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  width: "10%",
                  gap: "5px",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <CustomTypography>Airline</CustomTypography>

                <CustomTypography>{flight.return?.marketing}</CustomTypography>
              </Box>

              <Box sx={{ display: "flex", gap: "10px", width: "70%" }}>
                <Box
                  sx={{
                    width: "30%",
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <CustomTypography>
                    {flight.return.departureLocation}
                  </CustomTypography>{" "}
                  <CustomTypography >
                    {formatDate(flight.return?.departureTime)}
                  </CustomTypography>
                </Box>
                <Box
                  sx={{
                    px: 1.2,
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  {" "}
                  <Box
                    sx={{ width: "5.5rem", border: "1px solid black" }}
                  ></Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "20%",
                  }}
                >
                  <CustomTypography>
                    {flight.return.stopCount
                      ? `${flight.return.stopCount} Stops`
                      : "Non Stop"}
                  </CustomTypography>
                  <CustomTypography>
                    {formatDuration(flight.return?.elapsedTime)}
                  </CustomTypography>
                </Box>
                <Box
                  sx={{
                    px: 1.2,
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  {" "}
                  <Box
                    sx={{ width: "5.5rem", border: "1px solid black" }}
                  ></Box>
                </Box>
                <Box
                  sx={{
                    width: "30%",
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <CustomTypography>
                    {flight.return.arrivalLocation}
                  </CustomTypography>{" "}
                  <CustomTypography>
                    {formatDate(flight.return.arrivalTime)}
                  </CustomTypography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            width: "20%",
            height: "100%",
            display: "flex",
            alignItems: "flex-end",
            flexDirection: "column-reverse",
            gap: "1rem",
            textAlign: "right",
            py: 0.8,
            px: 1.2,
          }}
        >
          <AppButton
            bgColor="#185ea5"
            borderColor="#185ea5"
            color="white"
            text="Select"
            onClick={() => handleBaggage()}
          />
          <CustomTypography
            level="h4"
            sx={{
              fontSize: {
                xs: "0.5rem",
                sm: "0.7rem",
                md: "0.8rem",
                lg: "1rem",
                xl: "1.2rem",
              },
              fontWeight: '600'
            }}
          >
            Total Fare: {`${flight.totalFare}$`}
          </CustomTypography>
          {/* <CustomTypography 
           sx={{
            fontSize: {
              xs:"0.4rem",
              sm:"0.6rem",
              md:"0.8rem",
              lg:"1rem",
              xl:"1.2rem",
            } 
           }} 
            >Taxes:{" "}
                  {flight.taxSummaries.map((tax, idx) => (
                    <span key={idx}>
                      <CustomTypography  
                      style={{ fontSize: "0.8rem" }}
                      >{tax.type}: ${tax.amount}</CustomTypography>
                    </span>
                  ))}</CustomTypography> */}

          {/* <CustomTypography
            sx={{
              fontSize: {
                xs: "0.5rem",
                sm: "0.7rem",
                md: "0.7rem",
                lg: "0.9rem",
                xl: "0.9rem",
              },
            }}
          >
            Adult Price: ${flight.adultPrice} x {flight.totalAdults}
          </CustomTypography> */}
        </Box>
      </Box>





      {baggage && (
        <Box>
          <Box sx={{ py: 2 }}>

            <AppButton text="Flight Rule" onClick={() => handleRuleClick(flight.itineraries)} />
          </Box>

          <Box
            sx={{
              width: "100%",
              height: baggage ? "auto" : "0",
              opacity: baggage ? 1 : 0,
              visibility: baggage ? "visible" : "hidden",
              overflow: "hidden",
              transition: "all 0.3s ease-in-out",
              display: "flex",
              gap: "5px",
              alignItems: "center",
              // p: baggage ? 1.2 : 0,
            }} >

            <Box sx={{ width: "33%", height: "90%", borderRadius: 8, p: 2, display: "flex", flexDirection: "column", gap: "0.75rem", border: "1px solid grey" }}>
              <Typography sx={{ fontWeight: "670" }}>LITE</Typography>
              <Divider />
              <Typography sx={{ fontWeight: "570" }}>Baggage</Typography>
              <Box >
                <Typography sx={{ fontSize: "0.9rem" }}>Check in Baggage: Not Included</Typography>
                <Typography sx={{ fontSize: "0.9rem" }}>Check in Baggage: 1 piece of Hand Baggage</Typography>
              </Box>
              <Typography sx={{ fontWeight: "570" }}>Fare Rules</Typography>
              <Box>
                <Typography sx={{ color: "blue" }}>Details</Typography>
                <Typography level="h4">Rs 69427</Typography>
              </Box>
              <AppButton text="Selected" width="100%" onClick={() => handleTicketSelect({ flight })} />

            </Box>
            <Box sx={{ width: "33%", height: "90%", borderRadius: 8, p: 2, display: "flex", flexDirection: "column", gap: "0.75rem", border: "1px solid grey" }}>
              <Typography sx={{ fontWeight: "670" }}>VALUE</Typography>
              <Divider />
              <Typography sx={{ fontWeight: "570" }}>Baggage</Typography>
              <Box >
                <Typography sx={{ fontSize: "0.9rem" }}>Check in Baggage: Not Included</Typography>
                <Typography sx={{ fontSize: "0.9rem" }}>Check in Baggage: 1 piece of Hand Baggage</Typography>
              </Box>
              <Typography sx={{ fontWeight: "570" }}>Fare Rules</Typography>
              <Box>
                <Typography sx={{ color: "blue" }}>Details</Typography>
                <Typography level="h4">Rs 69427</Typography>
              </Box>
              <AppButton text="Selected" width="100%" onClick={() => handleTicketSelect({ flight })} />

            </Box>
            <Box sx={{ width: "33%", height: "90%", borderRadius: 8, p: 2, display: "flex", flexDirection: "column", gap: "0.75rem", border: "1px solid grey" }}>
              <Typography sx={{ fontWeight: "670" }}>FLEX</Typography>
              <Divider />
              <Typography sx={{ fontWeight: "570" }}>Baggage</Typography>
              <Box >
                <Typography sx={{ fontSize: "0.9rem" }}>Check in Baggage: Not Included</Typography>
                <Typography sx={{ fontSize: "0.9rem" }}>Check in Baggage: 1 piece of Hand Baggage</Typography>
              </Box>
              <Typography sx={{ fontWeight: "570" }}>Fare Rules</Typography>
              <Box>
                <Typography sx={{ color: "blue" }}>Details</Typography>
                <Typography level="h4">Rs 69427</Typography>
              </Box>
              <AppButton text="Selected" width="100%" onClick={() => handleTicketSelect({ flight })} />

            </Box>

          </Box>
        </Box>

      )}


    </Box>
  );
};

export default Ticket;
