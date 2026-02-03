import { Box, Card, CardContent, Typography } from '@mui/joy'
import React from 'react'

const StatusCard = ({ title, value, icon, isCurrency }) => {
    return (
        <Card>
            <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                    {icon}
                    <Typography level="h4" ml={1}>
                        {title?.toUpperCase()}
                    </Typography>
                </Box>
                <Typography level="title-lg" ml={1}>{isCurrency && 'RS. '}{value}</Typography>
            </CardContent>
        </Card>
    )
}

export default StatusCard