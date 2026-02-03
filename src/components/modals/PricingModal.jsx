import { Modal, ModalClose, Sheet, Typography, Select, Option, Input, Switch, Box, Button, Autocomplete, AutocompleteOption, ListItemDecorator, ListItemContent } from '@mui/joy'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { addCreateMarkup, editMarkup, getAllAirlines } from '../../server/api'
import { enqueueSnackbar } from 'notistack';
import AppDatePicker from '../common/AppDatePicker';

const PricingModal = ({ open, setOpen, data, refetch, title }) => {
    const modalRef = useRef(null);

    const [api, setApi] = useState('sabre')
    const [markupType, setMarkupType] = useState('')
    const [markupValue, setMarkupValue] = useState('')
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [airlines, setAirlines] = useState('')
    const [status, setStatus] = useState(false)

    const [airlineList, setAirlineList] = useState([])

    const handleStatusChange = (e) => {
        setStatus(e.target.checked)
    }

    const handleSave = async () => {
        try {
            const body = {
                api,
                markupType,
                markupValue,
                startDate: startDate ? moment(startDate).format("YYYY-MM-DD") : null,
                endDate: endDate ? moment(endDate).format("YYYY-MM-DD") : null,
                airlines: airlines?.arCode,
                airlineName: airlines?.ar,
                status: status ? "ACTIVE" : "INACTIVE"
            }

            if (!data?._id) {
                addCreateMarkup(body).then((res) => {

                    enqueueSnackbar(res?.message, { variant: "success" });

                    refetch()

                    setApi('')
                    setMarkupType('')
                    setMarkupValue('')
                    setStartDate(null)
                    setEndDate(null)
                    setAirlines({ ar: '', arCode: '' })
                    setStatus(false)

                    setOpen(false)
                }).catch((err) => {
                    enqueueSnackbar(err || "Something went wrong,Please try again later!", { variant: "error" });
                    console.log(err)

                })
            } else {
                editMarkup(data?._id, body).then((res) => {

                    enqueueSnackbar(res?.message, { variant: "success" });

                    refetch()

                    setApi('')
                    setMarkupType('')
                    setMarkupValue('')
                    setStartDate(null)
                    setEndDate(null)
                    setAirlines({ ar: '', arCode: '' })
                    setStatus(false)

                    setOpen(false)
                }).catch((err) => {
                    enqueueSnackbar(err || "Something went wrong,Please try again later!", { variant: "error" });
                    console.log(err)

                })
            }

        } catch (error) {
            console.log(error)
        }
    }

    const fetchAllAirlines = async () => {
        const res = await getAllAirlines();
        setAirlineList(res?.result)
    }


    useEffect(() => {
        if (data) {
            const newStartDate = data?.startDate ? new Date(data.startDate) : null
            const newEndDate = data?.endDate ? new Date(data.endDate) : null
            const filteredAirline = airlineList.find((item) => item?.arCode === data?.airlines)

            setApi(data.api ? data?.api : '');
            setMarkupType(data.markupType ? data.markupType : '');
            setMarkupValue(data.markupValue ? data.markupValue : '');
            setStartDate(newStartDate);
            setEndDate(newEndDate);
            setAirlines(data.airlines ? filteredAirline : '');
            setStatus(data.status === "ACTIVE");
        } else {
            setApi('sabre')
            setMarkupType('')
            setMarkupValue('')
            setStartDate(null)
            setEndDate(null)
            setAirlines({ ar: '', arCode: '' })
            setStatus(false)
        }

        fetchAllAirlines()
    }, [data])

    return (
        <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={open}
            onClose={() => setOpen(false)}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <Sheet
                ref={modalRef}
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
                    {title ? title : "Pricing"}
                </Typography>

                {/* API Dropdown */}
                <Typography sx={{ mr: 1 }}>GDS:</Typography>
                <Select
                    placeholder="Select GDS"
                    value={api}
                    onChange={(e, newValue) => setApi(newValue)}
                    sx={{ mb: 2 }}
                >
                    {/* <Option value="amadeus">Amadeus</Option> */}
                    <Option value="sabre">Sabre</Option>
                </Select>

                {/* Markup Type Dropdown */}
                <Typography sx={{ mr: 1 }}>Markup Type:</Typography>
                <Select
                    placeholder="Select Markup Type"
                    value={markupType}
                    onChange={(e, newValue) => setMarkupType(newValue)}
                    sx={{ mb: 2 }}
                >
                    <Option value="percentage">Percentage</Option>
                    <Option value="whole">Whole</Option>
                </Select>

                {/* Markup Value */}
                <Typography sx={{ mr: 1 }}>Markup Value:</Typography>
                <Input
                    placeholder={markupType === "whole" ? "i.e. 500" : markupType === "percentage" ? "i.e. 5%" : "Enter Markup Value"}
                    value={markupValue}
                    disabled={markupType === '' ? true : false}
                    onChange={(e) => setMarkupValue(e.target.value)}
                    sx={{ mb: 2 }}
                />

                {/* Start Date Picker */}
                <Typography sx={{ mr: 1 }}>Start Date:</Typography>

                <AppDatePicker
                    date={startDate}
                    handleChange={(date) => setStartDate(date)}
                    datePickerRef={modalRef}
                />


                {/* End Date Picker */}
                <Typography sx={{ mr: 1 }}>End Date:</Typography>

                <AppDatePicker
                    date={endDate}
                    handleChange={(date) => setEndDate(date)}
                    datePickerRef={modalRef}
                />

                {/* Airlines Text Field */}
                <Typography sx={{ mr: 1 }}>Airline Name:</Typography>

                <Autocomplete
                    placeholder="i.e. Emirates"
                    options={airlineList}
                    value={airlines && airlines}
                    getOptionLabel={(option) => option.ar}
                    onChange={(event, value) => {
                        // Update airlines state with the full object: { ar: '', arCode: '' }
                        setAirlines(value || { ar: '', arCode: '' }); // If no value selected, set airlines to default object
                    }}
                    renderOption={(props, option) => (
                        <AutocompleteOption {...props} key={option.arCode}>
                            <ListItemContent sx={{ fontSize: 'sm' }}>
                                {option.ar}
                            </ListItemContent>
                        </AutocompleteOption>
                    )}
                    filterOptions={(options, state) => {
                        // Ensure that the input is correctly filtered in a case-insensitive manner
                        const filteredOptions = options.filter(option =>
                            option.ar.toLowerCase().includes(state.inputValue.toLowerCase())
                        );

                        return filteredOptions;
                    }}
                    sx={{ mb: 2 }}
                />


                {/* Status Toggle Button */}
                <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                    <Typography sx={{ mr: 1 }}>Status:</Typography>

                    <Switch
                        checked={status}
                        onChange={handleStatusChange}
                        slotProps={{
                            track: {
                                children: (
                                    <React.Fragment>
                                        <Typography component="span" level="inherit" sx={{ ml: '10px' }}>
                                            On
                                        </Typography>
                                        <Typography component="span" level="inherit" sx={{ mr: '8px' }}>
                                            Off
                                        </Typography>
                                    </React.Fragment>
                                ),
                            },
                        }}
                        sx={{
                            '--Switch-thumbSize': '27px',
                            '--Switch-trackWidth': '64px',
                            '--Switch-trackHeight': '31px',
                        }}
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', width: '100%' }}>
                    <Button onClick={() => handleSave()}>Save</Button>
                </Box>

            </Sheet>
        </Modal>
    )
}

export default PricingModal
