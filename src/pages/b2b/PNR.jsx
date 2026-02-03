import { Box, Button, Checkbox, Input, Option, Radio, RadioGroup, Select, Table, Typography } from '@mui/joy'
import React, { useState } from 'react'
import B2bHeader from '../../components/utils/b2bHeader';
import { useNavigate } from 'react-router-dom';
import { importPnr } from '../../server/api';
import { useSnackbar } from 'notistack';
import { NavbarDivData } from '../../utils/DummyData';

const PNR = () => {

  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar();

  const [activeDiv, setActiveDiv] = useState(2);
  const [activeOption, setActiveOption] = useState(0);
  const [selectedRadio, setSelectedRadio] = React.useState('sabre');
  const [pnr, setPnr] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleRadioChange = (event) => {
    setSelectedRadio(event.target.value);
  };

  const handleImportPnr = () => {
    // '/b2b/pnr-detail'
    setIsLoading(true)
    importPnr(pnr, (selectedRadio === 'amadeus' || selectedRadio === "amadus") ? 'flights' : selectedRadio).then((res) => {
      if (res?.status === "success") {
        setIsLoading(false)
        navigate("/b2b/pnr-detail", { state: { flight: res?.result } });
      } else {
        setIsLoading(false)
        enqueueSnackbar(res?.message, {
          variant: "error",
        });
      }
    }).catch((error) => {
      setIsLoading(false)
      console.log(error)
      enqueueSnackbar(error, {
        variant: "error",
      });
    })
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "2rem" }}>
      <B2bHeader divs={NavbarDivData} activeDiv={activeDiv} setActiveDiv={setActiveDiv} activeOption={activeOption} setActiveOption={setActiveOption} />
      <Box sx={{ width: { xs: "90%", lg: "65%" }, height: "40rem", display: "flex", justifyContent: "flex-start", alignItems: "flex-start", marginBottom: "40px", gap: "30px", borderRadius: "10px", boxShadow: "5px 5px 20px rgb(0,0,0,0.3)", flexDirection: "column", pl: "20px" }}>
        <Typography sx={{ fontSize: "22px", fontWeight: '600', marginTop: "20px" }}>Import PNR</Typography>
        <RadioGroup value={selectedRadio} onChange={handleRadioChange} sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'baseline',
          gap: '20px'
        }}>
          <Radio value="sabre" label="Sabre" size="sm" />
          {/* <Radio value="amadeus" label="Amadeus" size="sm" /> */}
          {/* <Radio value="galileo" label="Galileo" size="sm" /> */}
        </RadioGroup>
        <Box sx={{ width: "100%", display: "flex", gap: "10px" }}>
          <Input placeholder='Search PNR' sx={{ borderRadius: "20px", width: "83%", backgroundColor: "#EBEBEB" }} value={pnr} onChange={(e) => setPnr(e.target.value)} />
          <Button sx={{ backgroundColor: "#185ea5", color: "white", width: { xs: "130px", lg: "180px" }, pr: "20px" }} disabled={isLoading} onClick={() => handleImportPnr()}>{isLoading ? "Loading..." : "Import"}</Button>
        </Box>
        <Box>
          <Typography sx={{ width: "78%", fontSize: "18px", fontWeight: "600" }}>Create a PNR in your own PCC, do a fare quote and queue it to us in the given PCC. Now you can retrieve your PNR on our website and issue the ticket using this option.</Typography>
          <Typography sx={{ width: "73%", fontSize: "15px", color: "#B7B7B7" }}>Our system will price this PNR, accept the terms and conditions and click on Submit to get ticketed. Please confirm the fare before queuing to us and recheck by retrieving the booking.</Typography>
        </Box>

        <Box sx={{ width: { xs: "98.5%", lg: "90%" } }}>
          <Typography sx={{
            backgroundColor: "#D8D8D8", width: "99%", borderRadius: "5px", padding: "8px 0px 8px 8px", fontSize: "22px", fontWeight: '500', marginBottom: "10px"
          }}>Sabre</Typography>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #D8D8D8",
            }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    width: "25%",
                    border: "1px solid #D8D8D8",
                    padding: "8px",
                  }}
                >
                  PCC
                </td>
                <td
                  style={{
                    width: "75%",
                    border: "1px solid #D8D8D8",
                    padding: "8px",
                  }}
                >
                  {selectedRadio === "sabre" ? 'B8H8' : 'GBENE6459F'}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    width: "25%",
                    border: "1px solid #D8D8D8",
                    padding: "8px",
                  }}
                >
                  ENTRY
                </td>
                <td
                  style={{
                    width: "75%",
                    border: "1px solid #D8D8D8",
                    padding: "8px",
                  }}
                >
                  541FEVNKVNEIN
                </td>
              </tr>
            </tbody>
          </table>
        </Box>
      </Box>
    </Box>
  )
}

export default PNR
