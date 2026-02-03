import { Box, Button, Chip, Table, Typography } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import Add from '@mui/icons-material/Add';
import PricingModal from '../../components/modals/PricingModal';
import moment from 'moment';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { getAllMarkup } from '../../server/api';
import { setLoading } from '../../redux/reducer/loaderSlice';
import { useDispatch } from 'react-redux';

const Pricing = () => {
    const [open, setOpen] = React.useState(false);
    const [data, setData] = useState([])

    const dispatch = useDispatch()

    const fetchAllMarkup = async () => {
        dispatch(setLoading(true));
        const resData = await getAllMarkup();
        if (resData?.status === "success") {
            setData(resData?.result)
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        fetchAllMarkup()
    }, [])

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', marginBottom: '20px', width: "100%" }}>
                <Button startDecorator={<Add />} onClick={() => setOpen({ value: true, data: undefined })}>Add Pricing</Button>
            </Box>
            <Table aria-label="striped table" stripe={"odd"}>
                <thead>
                    <tr>
                        <th>Airline</th>
                        <th>Markup Type </th>
                        <th>Markup Value</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>GDS</th>
                        <th>Status</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length !== 0 ? data?.map((item, index) => (
                        <tr key={index}>
                            <td>{item?.airlineName}</td>
                            <td style={{ textTransform: 'capitalize' }}>{item?.markupType}</td>
                            <td style={{ textTransform: 'capitalize' }}>{item?.markupValue}</td>
                            <td>{moment(item?.startDate).format('MMMM Do YYYY')}</td>
                            <td>{moment(item?.endDate).format('MMMM Do YYYY')}</td>
                            <td style={{ textTransform: 'capitalize' }}>{item?.api}</td>
                            <td>{item?.status === "ACTIVE" ? <Chip variant="soft" color="success">
                                Active
                            </Chip> : <Chip variant="soft" color="danger">
                                In-Active
                            </Chip>}</td>
                            <td><BorderColorIcon sx={{ fontSize: '25px', cursor: 'pointer' }} onClick={() => setOpen({ value: true, data: item })} /></td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={8} style={{ textAlign: 'center', padding: '20px' }}>
                                <h1>No Data Available!</h1>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <PricingModal {...{ open: open?.value, setOpen, data: open?.data, refetch: fetchAllMarkup }} />
        </div>
    )
}

export default Pricing