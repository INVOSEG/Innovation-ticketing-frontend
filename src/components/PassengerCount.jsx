import React, { useEffect } from 'react';
import ButtonGroup from '@mui/joy/ButtonGroup';
import Stack from '@mui/joy/Stack';
import { Popover } from 'react-tiny-popover';
import { Box, Button, FormControl } from "@mui/joy";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Sheet from '@mui/joy/Sheet';
import AppButton from './common/AppButton';
import TextHeading from './common/TextHeading';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useTicketFilterValues } from '../context/ticketFilterValues';
const PassengerCount = ({ handleOpenPassengerCount, isPopoverOpen }) => {
    const [adultsCount2, setAdultsCount2] = React.useState(0)
    const [childrenCount2, setChildrenCount2] = React.useState(0)
    const [infantsCount2, setInfantCount2] = React.useState(0)
    const { setAdultsCount, setChildrenCount, setInfantsCount, adultsCount, childrenCount, infantsCount } = useTicketFilterValues();
    const totalTravllers = adultsCount2 + childrenCount2 + infantsCount2
    const incrementCount = (type) => {
        if (type === 'adult') {
            setAdultsCount(adultsCount + 1)
            setAdultsCount2(adultsCount2 + 1)
        } else if (type === 'children') {
            setChildrenCount(childrenCount + 1)
            setChildrenCount2(childrenCount2 + 1)
        } else if (type === 'infant') {
            setInfantsCount(infantsCount + 1)
            setInfantCount2(infantsCount2 + 1)
        }
    };

    const decrementCount = (type) => {
        if (type === 'adult' && adultsCount2 > 0) {
            setAdultsCount2(adultsCount2 - 1)
            setAdultsCount(adultsCount - 1)
        } else if (type === 'children' && childrenCount2 > 0) {
            setChildrenCount2(childrenCount2 - 1)
            setChildrenCount(childrenCount - 1)
        } else if (type === 'infant' && infantsCount2 > 0) {
            setInfantCount2(infantsCount2 - 1)
            setInfantsCount(infantsCount - 1)
        }
    };

    React.useEffect(() => {
        console.log('infantsCount:', infantsCount)
        setAdultsCount2(adultsCount);
        setChildrenCount2(childrenCount);
        setInfantCount2(infantsCount);
    }, [adultsCount, childrenCount, infantsCount])

    return (
        <div>
            <FormControl size="lg" >
                <Popover
                    isOpen={isPopoverOpen}
                    positions={['bottom', 'left']}
                    padding={10}
                    containerStyle={{ zIndex: 99999 }}
                    onClickOutside={handleOpenPassengerCount}
                    content={({ position, childRect, popoverRect }) => (
                        <Sheet variant="outlined" color="neutral" sx={{ p: 1, borderRadius: 5 }}>
                            <Stack spacing={2} sx={{ alignItems: 'center' }}>
                                {/* Adults */}
                                <Box sx={{ display: 'flex', gap: 5, justifyContent: 'space-between', width: '100%' }}>
                                    <TextHeading text="Adults" />
                                    <ButtonGroup size="sm">
                                        <AppButton bgColor="#fff" color="#32383E" borderColor="#CDD7E1" startDecorator={<RemoveIcon />} onClick={() => decrementCount('adult')} />
                                        <AppButton bgColor="#fff" color="#32383E" borderColor="#CDD7E1" text={String(adultsCount)} />
                                        <AppButton bgColor="#fff" color="#32383E" borderColor="#CDD7E1" startDecorator={<AddIcon />} onClick={() => incrementCount('adult')} />
                                    </ButtonGroup>
                                </Box>

                                {/* Children */}
                                <Box sx={{ display: 'flex', gap: 5, justifyContent: 'space-between', width: '100%' }}>
                                    <TextHeading text="Children" />
                                    <ButtonGroup size="sm">
                                        <AppButton bgColor="#fff" color="#32383E" borderColor="#CDD7E1" startDecorator={<RemoveIcon />} onClick={() => decrementCount('children')} />
                                        <AppButton bgColor="#fff" color="#32383E" borderColor="#CDD7E1" text={String(childrenCount)} />
                                        <AppButton bgColor="#fff" color="#32383E" borderColor="#CDD7E1" startDecorator={<AddIcon />} onClick={() => incrementCount('children')} />
                                    </ButtonGroup>
                                </Box>

                                {/* Infants */}
                                <Box sx={{ display: 'flex', gap: 5, justifyContent: 'space-between', width: '100%' }}>
                                    <TextHeading text="Infants" />
                                    <ButtonGroup size="sm">
                                        <AppButton bgColor="#fff" color="#32383E" borderColor="#CDD7E1" startDecorator={<RemoveIcon />} onClick={() => decrementCount('infant')} />
                                        <AppButton bgColor="#fff" color="#32383E" borderColor="#CDD7E1" text={String(infantsCount)} />
                                        <AppButton bgColor="#fff" color="#32383E" borderColor="#CDD7E1" startDecorator={<AddIcon />} onClick={() => incrementCount('infant')} />
                                    </ButtonGroup>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                    <Button onClick={handleOpenPassengerCount}>Done</Button>
                                </Box>
                            </Stack>
                        </Sheet>
                    )}
                >
                    <div onClick={handleOpenPassengerCount} style={{ width: '100%' }}>
                        <AppButton text={totalTravllers > 0 ? `Total Travellers ${totalTravllers}` : "Select Adults"} onClick={handleOpenPassengerCount} width="100%" height="48px" bgColor="#fff" color="#32383E" borderColor="#CDD7E1" endDecorator={<KeyboardArrowDownIcon />} />
                    </div>
                </Popover>
            </FormControl>
        </div>
    );
};

export default PassengerCount;
