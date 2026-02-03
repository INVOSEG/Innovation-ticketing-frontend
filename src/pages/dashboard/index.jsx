import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import DashboardMain from './DashboardMain';
import { useSelector } from 'react-redux';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { getAgencyById } from '../../server/api';

const AppDashboard = () => {
  const selectedOption = useSelector((state) => state.dashboard.option);
  const userData = useSelector((state) => state.user.loginUser)

  const [isShowAgencyLabel, setIsShowAgencyLabel] = React.useState(false);
  const [cashLimit, setCashLimit] = React.useState(null)
  const [agencyName, setAgencyName] = React.useState(null)

  const [currencyToShow, setCurrencyToShow] = React.useState('$')

  // const currencyList = [{ value: "USD", title: "$" }, { value: "EUR", title: "€" }, { value: "PKR", title: "Rs" }, { value: "RMB", title: "¥" }]
  const currencyList = [{ value: "PKR", title: "Rs" }]

  const fetchAgency = async () => {
    if (!userData?.agency_id) return;
    const agencyData = await getAgencyById(userData?.agency_id);

    if (agencyData?.status === "success") {
      const currencyLabel = currencyList.find(item => item.value === agencyData?.result?.currency || agencyData?.result?.defaultCurrency)
      setIsShowAgencyLabel(agencyData?.result?.showLabel);
      setCashLimit(agencyData?.result?.cashLimit);
      setCurrencyToShow(currencyLabel ? currencyLabel?.title : '$')
      setAgencyName(agencyData?.result?.agencyName)
    }
  }

  React.useEffect(() => {
    fetchAgency()
  }, [])

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
        <Header />
        <Sidebar />
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: 'calc(12px + var(--Header-height))',
              sm: 'calc(12px + var(--Header-height))',
              md: 3,
            },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            height: '100dvh',
            gap: 1,
            overflowY: 'auto'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <Breadcrumbs
              size="sm"
              aria-label="breadcrumbs"
              separator={<ChevronRightRoundedIcon />}
              sx={{ pl: 0 }}
            >
              <Link
                underline="none"
                color="neutral"
                href="#some-link"
                aria-label="Home"
              >
                <HomeRoundedIcon />
              </Link>
              <Link
                underline="hover"
                color="neutral"
                // href="#some-link"
                fontSize={12}
                fontWeight={500}
              >
                Dashboard
              </Link>
              <Typography color="primary" fontWeight={500} fontSize={12}>
                {selectedOption}
              </Typography>
            </Breadcrumbs>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>

              {isShowAgencyLabel && (
                <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', bgcolor: '#185ea5', padding: "8px", borderRadius: '6px', mr: '5px' }}>
                  <AccountBalanceWalletIcon sx={{
                    color: 'white', fontSize: '20px', mr: '5px'
                  }} />
                  < Typography sx={{ color: 'white', fontWeight: '600', fontSize: '15px' }}>
                    Balance: {currencyToShow} {Math.floor(cashLimit)}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', bgcolor: '#185ea5', padding: "8px", borderRadius: '6px' }}>
                <AdminPanelSettingsIcon sx={{
                  color: 'white', fontSize: '20px', mr: '5px'
                }} />
                < Typography sx={{ color: 'white', fontWeight: '600', fontSize: '15px' }}>
                  {
                    userData?.role === "super_admin"
                      ? "Admin Dashboard"
                      : userData?.role === "agency"
                        ? ` ${agencyName} Mid Office`
                        : userData?.role === "sale" || userData?.role === "SPO"
                          ? "Sales Dashboard"
                          : "Dashboard"
                  }
                </Typography>
              </Box>

            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              mb: 1,
              gap: 1,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'start', sm: 'center' },
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <Typography level="h2" component="h1">
              {selectedOption}
            </Typography>
            {/* <Button
              color="primary"
              startDecorator={<DownloadRoundedIcon />}
              size="sm"
            >
              Download PDF
            </Button> */}
          </Box>



          <DashboardMain />
          {/* <ViewAgencyTable /> */}
          {/* <OrderList />  */}
        </Box>
      </Box>
    </CssVarsProvider >
  );
}


export default AppDashboard;