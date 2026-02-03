import { Box, Typography } from '@mui/joy'
import React from 'react'

const Footer = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'black', height: '20vh' }}>
            <Typography sx={{ color: 'white' }}>
                © Copyright 2024 INNOVATION TECH Travels. All Rights Reserved.
            </Typography>
        </Box>
    )
}

export default Footer