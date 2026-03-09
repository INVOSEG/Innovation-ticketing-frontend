import { Box, Typography, Button, Card, Avatar } from "@mui/joy"
import PersonIcon from "@mui/icons-material/Person"
import EditIcon from "@mui/icons-material/Edit"
import LockIcon from "@mui/icons-material/Lock"
import EmailIcon from "@mui/icons-material/Email"
import PhoneIcon from "@mui/icons-material/Phone"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import BusinessIcon from "@mui/icons-material/Business"
import ForgetPassword from "../../components/modals/ForgetPassword"
import { useEffect, useState } from "react"
import { resendOtp } from "../../server/api"
import { useSelector } from "react-redux"
import { useSnackbar } from 'notistack';

const ProfileMainInfo = () => {
  const { enqueueSnackbar } = useSnackbar();

  const userData = useSelector((state) => state?.user?.loginUser);

  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agencyData, setAgencyData] = useState(null)

  const fetchAgency = async () => {
    if (!userData?.agency_id) return;
    try {
      const res = await getAgencyById(userData?.agency_id);
      if (res?.status === "success") {
        setAgencyData(res.result);
      }
    } catch (error) {
      console.log("Error fetching agency in ProfileMainInfo:", error);
    }
  }

  useEffect(() => {
    fetchAgency()
  }, [userData?.agency_id])

  const resendOtpFunction = async () => {
    try {
      setIsLoading(true)
      await resendOtp({ email: userData?.email });
      enqueueSnackbar("OTP send to your email!", { variant: "success" });
      setOpen(true);
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
      // Check if the error contains a message
      const errorMessage = error || "Something went wrong";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  }

  return (
    <Box sx={{ width: "100%", p: 3, mt: -3 }}>
      {/* My Profile Header Card */}
      <Card sx={{ mb: 3, p: 2.5, boxShadow: "sm", border: "1px solid #e0e0e0", display: "flex", flexDirection: "row" }}>

        <PersonIcon sx={{ fontSize: 20, color: '#666', mr: 1 }} />
        <Typography level="h6" sx={{ fontWeight: 600, color: '#222', fontSize: 16 }}>
          My Profile
        </Typography>
      </Card>

      {/* User Contact Details Section */}
      <Card sx={{ mb: 3, p: 2.5, boxShadow: "sm", border: "1px solid #e0e0e0" }}>
        <Box sx={{ borderLeft: "4px solid #185ea5", pl: 2, mb: 1.5 }}>
          <Typography level="title-md" sx={{ fontWeight: 600, color: "#333", fontSize: 16, mb: 0 }}>
            User Contact Details
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          {/* Left side - User Info */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {/* Company Logo */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
              <Avatar
                src={agencyData?.logo || ""}
                sx={{
                  width: 60,
                  height: 60,
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                {agencyData?.agencyName?.substring(0, 2).toUpperCase() || "AT"}
              </Avatar>
              <Typography level="body-xs" sx={{ color: "#666", textAlign: "center", fontSize: 12 }}>
                {agencyData?.agencyName || agencyData?.affiliateName || "AL SABOOR TRAVEL"}
              </Typography>
            </Box>

            {/* User Details */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <PersonIcon sx={{ fontSize: 15, color: "#666" }} />
                <Typography level="body-xs" sx={{ color: "#666", fontSize: 13 }}>
                  User Name:
                </Typography>
                <Typography level="body-xs" sx={{ fontWeight: 600, fontSize: 13 }}>
                  {userData?.firstName || 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <EmailIcon sx={{ fontSize: 15, color: "#666" }} />
                <Typography level="body-xs" sx={{ color: "#4285f4", fontSize: 13 }}>
                  {userData?.email || 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <PhoneIcon sx={{ fontSize: 15, color: "#666" }} />
                <Typography level="body-xs" sx={{ fontSize: 13 }}>{userData?.phone || 'N/A'}</Typography>
              </Box>
            </Box>
          </Box>

          {/* Right side - Action Buttons */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {/* <Button
              variant="outlined"
              startDecorator={<EditIcon />}
              sx={{
                borderColor: "#185ea5",
                color: "#185ea5",
                fontSize: 13,
                "&:hover": {
                  backgroundColor: "#f7f2fa",
                  borderColor: "#185ea5",
                },
              }}
            >
              EDIT PROFILE
            </Button> */}

            <Button
              variant="outlined"
              disabled={isLoading}
              startDecorator={<LockIcon />}
              onClick={resendOtpFunction}
              sx={{
                borderColor: "#185ea5",
                color: "#185ea5",
                fontSize: 13,
                "&:hover": {
                  backgroundColor: "#f7f2fa",
                  borderColor: "#185ea5",
                },
              }}
            >
              {isLoading ? "Loading...." : "CHANGE PASSWORD"}
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Company Details Section */}
      <Card sx={{ p: 2.5, boxShadow: "sm", border: "1px solid #e0e0e0" }}>
        <Box sx={{ borderLeft: "4px solid #185ea5", pl: 2, mb: 2 }}>
          <Typography level="title-md" sx={{ fontWeight: 600, color: "#333", fontSize: 16, mb: 0 }}>
            Company Details With Logo
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          {/* Left side - Company Logo and Details */}
          {/* <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  fontSize: "15px",
                  fontWeight: "bold",
                }}
              >
                AT
              </Avatar>
              <Typography level="body-xs" sx={{ fontWeight: 600, color: "#185ea5", fontSize: 15 }}>
                AL ASAM TRAVELS
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, color: "#666" }}>
              <Typography level="body-xs" sx={{ fontSize: 12 }}>
                <em>Maximum Dimension: 350 Pixel X 50</em>
              </Typography>
              <Typography level="body-xs" sx={{ fontSize: 12 }}>
                <em>Pixel Resolution: 72 Pixel/Inch</em>
              </Typography>
              <Typography level="body-xs" sx={{ fontSize: 12 }}>
                <em>Background Colour: Hex: #4A00FB | RGB: 164,221,251</em>
              </Typography>
            </Box>
          </Box> */}

          {/* Right side - Company Contact Info */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2, minWidth: "220px" }}>
            <Typography level="body-xs" sx={{ fontWeight: 600, mb: 0.5, fontSize: 14 }}>
              {agencyData?.agencyName || agencyData?.affiliateName || "AL SABOOR TRAVEL"}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOnIcon sx={{ fontSize: 15, color: "#666" }} />
              <Typography level="body-xs" sx={{ color: "#666", fontSize: 13 }}>
                {agencyData?.address || "Abdullah Chaudhry Centre, 4-Industrial Block, Main Blvd Allama Iqbal Town, Lahore, 54000"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <EmailIcon sx={{ fontSize: 15, color: "#666" }} />
              <Typography level="body-xs" sx={{ color: "#4285f4", fontSize: 13 }}>
                {agencyData?.agencyEmail || "alsaboor47@gmail.com"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <BusinessIcon sx={{ fontSize: 15, color: "#666" }} />
              <Typography level="body-xs" sx={{ color: "#666", fontSize: 13 }}>
                Contact:
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <PhoneIcon sx={{ fontSize: 15, color: "#666" }} />
              <Typography level="body-xs" sx={{ fontSize: 13 }}>{agencyData?.phoneNumber || "+92 320 4045554 | 042-37800653-54 | +92 322 8584828"}</Typography>
            </Box>
          </Box>
        </Box>
      </Card>

      {open && (
        <ForgetPassword {...{ open: open, setOpen: setOpen }} />
      )}
    </Box>
  )
}

export default ProfileMainInfo
