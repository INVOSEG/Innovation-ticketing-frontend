import { Box, Button, Checkbox, Typography } from '@mui/joy'
import { FormControlLabel } from '@mui/material'
import React from 'react'
import InputField from '../common/InputField'
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";


const ImportPNRv2 = () => {
  return (
    <Box sx={{
      position: "relative", width: "100%", display: "flex", justifyContent: "center",
      backgroundColor: "white",
      boxShadow: "5px 5px 20px 5px rgb(0,0,0,0.3)",
      borderRadius: "20px",
      height: "auto",

    }}>


      <Box sx={{ display: "flex", flexDirection: "column", height: "auto", width: { xs: "90%", lg: "100%" }, pl: "20px", mb: "20px", backgroundColor: "white", borderRadius: "20px" }}>

        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontSize: "30px", fontWeight: "500", fontFamily: "Poppins" }} >Import PNR</Typography>
            <Box sx={{ pr: "20px", display: "flex", alignItems: "center", gap: "10px" }}>

              <FlightTakeoffIcon style={{ width: "40px", height: "90px" }} />
            </Box>

          </Box>

        </Box>
        <Box>
          <Box sx={{ display: "flex", pl: "12px", width: "93.5%", gap: "10px" }}>

            {/* <FormControlLabel
                                                   control={
                                                     <Checkbox
                                                       sx={{
                                                         '& .MuiSvgIcon-root': {
                                                           borderRadius: '50%',
                                                           backgroundColor: '#185ea5',
                                                           color: 'white',
                                                           padding: '5px',
                                                           marginLeft: "5px"
                                                         },
                                                         '&.Mui-checked': {
                                                           color: '#185ea5',
                                                           marginLeft: "5px",
                             
                                                         },
                                                       }}
                                                       defaultChecked
                             
                                                     />
                                                   }
                                                   label={<Typography sx={{ color: '#185ea5', fontWeight: 600, ml: "10px" }}>Amadeus</Typography>}
                                                 /> */}
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    '& .MuiSvgIcon-root': {
                      borderRadius: '50%',
                      backgroundColor: '#185ea5',
                      color: 'white',
                      padding: '5px',
                      marginLeft: "5px"

                    },
                    '&.Mui-checked': {
                      color: '#185ea5',
                      marginLeft: "5px"

                    },
                  }}
                />
              }
              label={<Typography sx={{ color: '#185ea5', fontWeight: 600, ml: "10px" }}>Sabre</Typography>}
            />
            {/* <FormControlLabel
                                                   control={
                                                     <Checkbox
                                                       sx={{
                                                         '& .MuiSvgIcon-root': {
                                                           borderRadius: '50%',
                                                           backgroundColor: '#185ea5',
                                                           color: 'white',
                                                           padding: '5px',
                                                           marginLeft: "5px"
                             
                                                         },
                                                         '&.Mui-checked': {
                                                           color: '#185ea5',
                                                           marginLeft: "5px"
                             
                                                         },
                                                       }}
                                                     />
                                                   }
                                                   label={<Typography sx={{ color: '#185ea5', fontWeight: 600, ml: "10px" }}>Galileo</Typography>}
                                                 /> */}
          </Box>

        </Box>

        <Box sx={{ display: "flex", width: "100%", alignItems: "center", gap: "5px" }}>
          <InputField sx={{ padding: "8px", width: "25rem" }} placeholder="Seach PNR" size="lg" />
          <Button sx={{ height: "45px", width: "120px", mt: 1 }}>Import</Button>
        </Box>
        <Box sx={{ width: "67%" }}>
          <Typography sx={{ fontWeight: "500" }}>Create a PNR in your own PCC, do a fare qoute and Queue it to us in given PCC Now your can retrieve your ONR on your Website and issue the ticket, using this option.</Typography>
          <Typography sx={{ fontSize: "15px", my: 1 }}>Our system will price this PNR, accept the Terms and condition and Click on Submit to get tickend.Please confirm the fare before queuing to us adn rechekced by retrieving booking.</Typography>
          <Typography sx={{ fontSize: "15px" }}>Get Commision as per standard deal.</Typography>

        </Box>
        <Box sx={{ borderRadius: "10px", border: "1px solid lightgrey", width: "98%" }}>
          <Box sx={{ height: "33.3%", width: "100%" }}>
            <Typography sx={{ fontWeight: 500, pl: "10px" }}>Amadeus</Typography>
          </Box>
          <Box sx={{ height: "33.3%", width: "100%", display: "flex", borderTop: "1px solid lightgrey" }}>
            <Box sx={{ width: "10%" }}>
              <Typography sx={{ fontWeight: 500, pl: "10px" }}>PCC</Typography>

            </Box>
            <Box sx={{ width: "90%", borderLeft: "1px solid lightgrey" }}>
              <Typography sx={{ fontWeight: 500, pl: "10px" }}>MCTOM28AG</Typography>

            </Box>
          </Box>
          <Box sx={{ height: "33.3%", width: "100%", display: "flex", borderTop: "1px solid lightgrey" }}>
            <Box sx={{ width: "10%" }}>
              <Typography sx={{ fontWeight: 500, pl: "10px" }}>ENTRY</Typography>

            </Box>
            <Box sx={{ width: "90%", borderLeft: "1px solid lightgrey" }}>
              <Typography sx={{ fontWeight: 500, pl: "10px" }}>ESMCTOM28AG-B</Typography>

            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ImportPNRv2
