import * as React from 'react';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { Box, FormControl, FormLabel, Radio } from '@mui/joy';
import InputField from '../common/InputField';
import { comparePNR, updateStatus } from '../../server/api';
import { enqueueSnackbar } from 'notistack';
import { RadioGroup } from '@mui/material';

export default function PnrModal({ open, setOpen, refetch }) {
    const [pnr, setPnr] = React.useState('');
    const [selectedGDS, setSelectedGDS] = React.useState('sabre');
    const [isChecked, setIsChecked] = React.useState(false)
    const [resData, setResData] = React.useState(null)
    const [isLoading, setIsLoading] = React.useState(false)

    const handleClose = () => {
        if (!isLoading) {
            setOpen(false);
            setPnr('');
            setSelectedGDS('sabre');
            setIsChecked(false);
        }
    }

    const handleChange = (event) => {
        setSelectedGDS(event.target.value);
    };

    const handleSeatch = async () => {
        let url;
        if (!pnr) {
            enqueueSnackbar('Please provide PNR!', { variant: "warning" });
            return;
        }

        if (selectedGDS === "sabre") {
            url = "/sabre"
        } else if (selectedGDS === "amadus" || selectedGDS === "amadeus") {
            url = "/flights"
        }

        setIsLoading(true)
        comparePNR(pnr, url).then((res) => {
            if (res?.result === 200) {
                setResData({ status: res.message?.status, ticketNumber: res?.message?.ticketNumber })
                setIsChecked(true);
            } else {
                enqueueSnackbar(res?.message, { variant: "warning" });
            }
            setIsLoading(false);
        }).catch((error) => {
            enqueueSnackbar(error, { variant: "error" });
            setIsLoading(false)
        })
    }

    const handleUpdate = () => {
        let url;

        if (selectedGDS === "sabre") {
            url = "/sabre"
        } else if (selectedGDS === "amadus" || selectedGDS === "amadeus") {
            url = "/flights"
        }

        setIsLoading(true)

        updateStatus(pnr, url, resData?.status, resData?.ticketNumber).then((res) => {
            enqueueSnackbar(res?.message, { variant: "success" });
            setPnr('');
            setSelectedGDS('sabre');
            setIsLoading(false)
            setOpen(false);
            setIsChecked(false);
            refetch(true);
        }).catch((error) => {
            enqueueSnackbar(error, { variant: "error" });
            setIsLoading(false)
        })
    }

    return (
        <React.Fragment>
            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={open}
                onClose={() => handleClose()}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Sheet
                    variant="outlined"
                    sx={{ maxWidth: 500, borderRadius: 'md', p: 3, boxShadow: 'lg' }}
                >
                    <ModalClose variant="plain" sx={{ m: 1 }} />
                    <Typography
                        component="h2"
                        id="modal-title"
                        level="h4"
                        textColor="inherit"
                        sx={{ fontWeight: 'lg', mb: 1 }}
                    >
                        Update PNR
                    </Typography>
                    {isChecked ? (<>
                        <Typography sx={{ mb: 4 }} id="modal-desc" textColor="text.tertiary" level="title-sm">
                            Have you already cancelled PNR from offline medium? Then Please enter your PNR number to update the Cancellation in portal.
                        </Typography>

                        <Box sx={{ marginTop: '5px' }}>
                            <b style={{ marginRight: '10px' }}>PNR Number:</b> {pnr}
                        </Box>
                        <Box sx={{ marginTop: '2px' }}>
                            <b style={{ marginRight: '10px' }}>PNR Status:</b> {resData?.status}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                            <Button sx={{ marginTop: '10px' }} onClick={() => handleUpdate()} disabled={isLoading}>{isLoading ? 'Loading..' : 'Update'}</Button>
                        </Box>
                    </>) : (
                        <>
                            <Typography sx={{ mb: 4 }} id="modal-desc" textColor="text.tertiary" level="title-sm">
                                Have you already cancelled PNR from offline medium? Then Please enter your PNR number to update the Cancellation in portal.
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                <b style={{ marginRight: '10px' }}>PNR Number:</b><InputField type="text" value={pnr} onChange={(e) => setPnr(e.target.value)} />
                            </Box>
                            <br />
                            <FormControl>
                                <FormLabel>Select GDS:</FormLabel>
                                <RadioGroup
                                    value={selectedGDS}
                                    onChange={handleChange}
                                    name="radio-buttons-group"
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: 2,
                                    }}
                                >
                                    <Radio value="sabre" label="Sabre" variant="outlined" checked={selectedGDS === "sabre"} onChange={handleChange} />
                                    {/* <Radio value="amadus" label="Amadus" variant="outlined" checked={selectedGDS === "amadus"} onChange={handleChange} /> */}
                                </RadioGroup>
                            </FormControl>
                            <br />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                <Button sx={{ marginTop: '10px' }} onClick={() => handleSeatch()} disabled={isLoading}>{isLoading ? 'Loading..' : 'Check'}</Button>
                            </Box>
                        </>
                    )}
                </Sheet>
            </Modal>
        </React.Fragment>
    );
}
