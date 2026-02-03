import React, { useEffect, useState } from 'react';
import { getAnalyticsData } from "../../server/api";
import { Box, Typography, Button } from '@mui/joy';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import AppButton from '../../components/common/AppButton';

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      const res = await getAnalyticsData();
      console.log("Res of graph is ===", res);
      setData(res.result);
    };

    fetchAnalyticsData();
  }, []);

  if (!data) return <Typography>Loading...</Typography>;

  const saleData = data.saleData;
  const pieData = saleData.year.map((year, index) => ({
    name: year,
    value: saleData.sale[index],
    percentage: saleData.salesPercentage[index]
  }));

  return (
    <Box sx={{ p: 2 }}>
      <Typography level="h4">Analytics Dashboard</Typography>

      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography level="h6">Sales Data</Typography>
        <PieChart width={400} height={400}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8884d8' : '#82ca9d'} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Box>

      <Box sx={{ mt: 8}}>
        {/* <Typography level="h6">Additional Data</Typography> */}
        <Box sx={{display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center'}}>
        <AppButton text={`Total Sale This Year: ${data.totalSaleThisYear}`} />
          <AppButton text={`Total Agency: ${data.totalAgency}`} />
          <AppButton text={`Total Active Agency: ${data.totalAgencyActive}`} />
          <AppButton text={`Total Staff: ${data.totalStaff}`} />
          <AppButton text={`Total Active Staff: ${data.totalStaffActive}`} />
          <AppButton text={`Total Sale Staff: ${data.totalSaleStaff}`} />
          <AppButton text={`Total Marketing Staff: ${data.totalMarketingStaff}`} />
        </Box>
      </Box>
    </Box>
  );
};

export default AnalyticsDashboard;
