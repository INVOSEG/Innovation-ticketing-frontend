import React from "react";
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import Stack from '@mui/joy/Stack';
import FlightIcon from '@mui/icons-material/Flight';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';

const TicketsTopBar = () => {
    return (
        <Stack spacing={2} sx={{ width: '100%', border: '1px solid #CCD6E0', borderRadius: 'md', mb: 3 }}>
            <Tabs aria-label="Flex one tabs" sx={{ minHeight: 80, borderRadius: 'md' }}>
                <TabList tabFlex={1} sx={{ minHeight: 80, borderRadius: 'md' }}>
                    <Tab sx={{ borderRadius: 'md' }} disableIndicator={true}>
                        <FlightIcon sx={{ mr: 1 }} fontSize="lg" /> Cheapest
                    </Tab>
                    <Tab sx={{ wordBreak: 'break-word' }} disableIndicator={true}>
                        <AccessTimeIcon sx={{ mr: 1 }} /> Quickest
                    </Tab>
                    <Tab sx={{ borderRadius: 'md' }} disableIndicator={true}>
                        <StarIcon sx={{ mr: 1 }} /> Best
                    </Tab>
                </TabList>
            </Tabs>
        </Stack>
    );
};

export default TicketsTopBar;
