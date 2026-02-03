import React, { useState, useEffect, useCallback, useRef } from "react";
import Box from "@mui/joy/Box";
import Input from "@mui/joy/Input";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import IconButton from "@mui/joy/IconButton";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import CloseIcon from "@mui/icons-material/Close"
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import HotelIcon from '@mui/icons-material/Hotel';
import FlightIcon from '@mui/icons-material/Flight';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BedIcon from '@mui/icons-material/Bed';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import Switch from '@mui/joy/Switch';

import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
// import { setLoading } from "../../redux/reducer/loaderSlice";
import { Drawer, Divider, Tooltip, FormControl, FormLabel, Checkbox, Typography, Stack, Button, RadioGroup, Radio, Alert, Chip, Badge, Card, CardContent, Grid, LinearProgress, Skeleton } from "@mui/joy"
import AddCardIcon from '@mui/icons-material/AddCard';
import EditIcon from '@mui/icons-material/Edit';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import InputField from "../../../components/common/InputField";
import AppButton from "../../../components/common/AppButton";
import { setLoading } from "../../../redux/reducer/loaderSlice";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function Umrah() {
  const { enqueueSnackbar } = useSnackbar();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openTopup, setOpenTopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(1);

  const [formData, setFormData] = useState({
    packageName: "",
    packagePrice: "",
    flightName: "",
    departureDate: "",
    returnDate: "",
    visaWithTransport: "",
    visaWithoutTransport: "",
    totalDays: "",
    insuranceOption: "",
    daysInMakkah: "",
    daysInMakkahStatus: "",
    makkahHotel: "",
    makkahHotelStatus: "",
    zeyaratMakkah: "",
    zeyaratMakkahStatus: "",
    daysInMadina: "",
    daysInMadinaStatus: "",
    madinaHotel: "",
    madinaHotelStatus: "",
    zeyaratMadina: "",
    zeyaratMadinaStatus: "",
    zeyaratOption: "included",
    packageDescription: "",
    maxTravelers: "",
    packageCategory: "standard", // standard, premium, luxury
    isActive: true,
    featured: false,
    termsAndConditions: "",
    cancellationPolicy: "",
    bed1Price: "",
    bed2Price: "",
    bed3Price: "",
    bed4Price: "",
    bed1Nights: 1,
    bed2Nights: 1,
    bed3Nights: 1,
    bed4Nights: 1,
    flightPricePerPerson: "",
    flightPersons: 1,
    transportPricePerDay: "",
    transportDays: 1,
  });

  const initialFormData = {
    packageName: "",
    packagePrice: "",
    flightName: "",
    departureDate: "",
    returnDate: "",
    visaWithTransport: "",
    visaWithoutTransport: "",
    totalDays: "",
    insuranceOption: "",
    daysInMakkah: "",
    daysInMakkahStatus: "",
    makkahHotel: "",
    makkahHotelStatus: "",
    zeyaratMakkah: "",
    zeyaratMakkahStatus: "",
    daysInMadina: "",
    daysInMadinaStatus: "",
    madinaHotel: "",
    madinaHotelStatus: "",
    zeyaratMadina: "",
    zeyaratMadinaStatus: "",
    zeyaratOption: "included",
    packageDescription: "",
    maxTravelers: "",
    packageCategory: "standard",
    isActive: true,
    featured: false,
    termsAndConditions: "",
    cancellationPolicy: "",
    bed1Price: "",
    bed2Price: "",
    bed3Price: "",
    bed4Price: "",
    bed1Nights: 1,
    bed2Nights: 1,
    bed3Nights: 1,
    bed4Nights: 1,
    flightPricePerPerson: "",
    flightPersons: 1,
    transportPricePerDay: "",
    transportDays: 1,
  };

  // Dashboard Statistics
  const dashboardStats = {
    totalPackages: 156,
    activePackages: 142,
    inactivePackages: 14,
    totalRevenue: "PKR 45,250,000",
    monthlyGrowth: 12.5,
    featuredPackages: 8,
    totalBookings: 234,
    avgPackagePrice: "PKR 290,000"
  };

  const data = [
    {
      _id: "1",
      agentCode: "A-001",
      firstName: "Noor Fatima",
      email: "noor@example.com",
      phoneNumber: "03001234567",
      date: "19-06-2024",
      umrahType: "Economy",
      price: "250000",
      package: "Standard",
      role: "admin",
      status: "ACTIVE",
      agencyId: {
        agencyName: "Al-Rehman Travels"
      }
    },
    {
      _id: "2",
      agentCode: "A-002",
      firstName: "Ali Khan",
      email: "ali@example.com",
      phoneNumber: "03007654321",
      date: "19-05-2024",
      umrahType: "Premium",
      price: "400000",
      package: "Luxury",
      role: "manager",
      status: "INACTIVE",
      agencyId: {
        agencyName: "Haram Tours"
      }
    },
    {
      _id: "2",
      agentCode: "A-002",
      firstName: "Ali Khan",
      email: "ali@example.com",
      phoneNumber: "03007654321",
      date: "19-05-2024",
      umrahType: "Premium",
      price: "400000",
      package: "Luxury",
      role: "manager",
      status: "INACTIVE",
      agencyId: {
        agencyName: "Haram Tours"
      }
    },
    {
      _id: "2",
      agentCode: "A-002",
      firstName: "Ali Khan",
      email: "ali@example.com",
      phoneNumber: "03007654321",
      date: "19-05-2024",
      umrahType: "Premium",
      price: "400000",
      package: "Luxury",
      role: "manager",
      status: "INACTIVE",
      agencyId: {
        agencyName: "Haram Tours"
      }
    },
    {
      _id: "2",
      agentCode: "A-002",
      firstName: "Ali Khan",
      email: "ali@example.com",
      phoneNumber: "03007654321",
      date: "19-05-2024",
      umrahType: "Premium",
      price: "400000",
      package: "Luxury",
      role: "manager",
      status: "INACTIVE",
      agencyId: {
        agencyName: "Haram Tours"
      }
    },
    {
      _id: "2",
      agentCode: "A-002",
      firstName: "Ali Khan",
      email: "ali@example.com",
      phoneNumber: "03007654321",
      date: "19-05-2024",
      umrahType: "Premium",
      price: "400000",
      package: "Luxury",
      role: "manager",
      status: "INACTIVE",
      agencyId: {
        agencyName: "Haram Tours"
      }
    },
    {
      _id: "2",
      agentCode: "A-002",
      firstName: "Ali Khan",
      email: "ali@example.com",
      phoneNumber: "03007654321",
      date: "19-05-2024",
      umrahType: "Premium",
      price: "400000",
      package: "Luxury",
      role: "manager",
      status: "INACTIVE",
      agencyId: {
        agencyName: "Haram Tours"
      }
    },
    {
      _id: "2",
      agentCode: "A-002",
      firstName: "Ali Khan",
      email: "ali@example.com",
      phoneNumber: "03007654321",
      date: "19-05-2024",
      umrahType: "Premium",
      price: "400000",
      package: "Luxury",
      role: "manager",
      status: "INACTIVE",
      agencyId: {
        agencyName: "Haram Tours"
      }
    },
    {
      _id: "2",
      agentCode: "A-002",
      firstName: "Ali Khan",
      email: "ali@example.com",
      phoneNumber: "03007654321",
      date: "19-05-2024",
      umrahType: "Premium",
      price: "400000",
      package: "Luxury",
      role: "manager",
      status: "INACTIVE",
      agencyId: {
        agencyName: "Haram Tours"
      }
    },
    {
      _id: "2",
      agentCode: "A-002",
      firstName: "Ali Khan",
      email: "ali@example.com",
      phoneNumber: "03007654321",
      date: "19-05-2024",
      umrahType: "Premium",
      price: "400000",
      package: "Luxury",
      role: "manager",
      status: "INACTIVE",
      agencyId: {
        agencyName: "Haram Tours"
      }
    }
  ]

  const handleRadioChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user makes a selection
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user types
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.packageName.trim()) {
      errors.packageName = "Package name is required";
    }

    if (!formData.packagePrice || formData.packagePrice <= 0) {
      errors.packagePrice = "Valid package price is required";
    }

    if (!formData.flightName.trim()) {
      errors.flightName = "Flight name is required";
    }

    if (!formData.departureDate) {
      errors.departureDate = "Departure date is required";
    }

    if (!formData.returnDate) {
      errors.returnDate = "Return date is required";
    }

    if (formData.departureDate && formData.returnDate &&
      new Date(formData.departureDate) >= new Date(formData.returnDate)) {
      errors.returnDate = "Return date must be after departure date";
    }

    if (!formData.totalDays || formData.totalDays <= 0) {
      errors.totalDays = "Valid total days is required";
    }

    if (!formData.daysInMakkah || formData.daysInMakkah <= 0) {
      errors.daysInMakkah = "Valid days in Makkah is required";
    }

    if (!formData.makkahHotel.trim()) {
      errors.makkahHotel = "Makkah hotel is required";
    }

    if (!formData.daysInMadina || formData.daysInMadina <= 0) {
      errors.daysInMadina = "Valid days in Madinah is required";
    }

    if (!formData.madinaHotel.trim()) {
      errors.madinaHotel = "Madinah hotel is required";
    }

    if (!formData.zeyaratMakkahStatus) {
      errors.zeyaratMakkahStatus = "Please select Zeyarat option for Makkah";
    }

    if (!formData.zeyaratMadinaStatus) {
      errors.zeyaratMadinaStatus = "Please select Zeyarat option for Madinah";
    }

    if (!formData.insuranceOption) {
      errors.insuranceOption = "Please select insurance option";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      enqueueSnackbar("Please fix the validation errors", { variant: "error" });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Form Data:", formData);
      console.log("Form Data Object:", JSON.stringify(formData, null, 2));

      // Here you would typically make an API call to save the data
      // For now, we'll just log the data
      const packageData = {
        packageInfo: {
          name: formData.packageName,
          price: formData.packagePrice,
          totalDays: formData.totalDays,
          description: formData.packageDescription,
          category: formData.packageCategory,
          maxTravelers: formData.maxTravelers,
          isActive: formData.isActive,
          featured: formData.featured
        },
        flightInfo: {
          name: formData.flightName,
          departureDate: formData.departureDate,
          returnDate: formData.returnDate
        },
        visaInfo: {
          option: formData.zeyaratOption
        },
        makkahInfo: {
          days: formData.daysInMakkah,
          hotel: formData.makkahHotel,
          zeyaratStatus: formData.zeyaratMakkahStatus
        },
        madinaInfo: {
          days: formData.daysInMadina,
          hotel: formData.madinaHotel,
          zeyaratStatus: formData.zeyaratMadinaStatus
        },
        additionalServices: {
          insurance: formData.insuranceOption
        },
        policies: {
          termsAndConditions: formData.termsAndConditions,
          cancellationPolicy: formData.cancellationPolicy
        },
        roomPrices: {
          bed1: {
            pricePerNight: formData.bed1Price,
            nights: formData.bed1Nights,
            total: (parseFloat(formData.bed1Price) || 0) * (parseInt(formData.bed1Nights) || 1)
          },
          bed2: {
            pricePerNight: formData.bed2Price,
            nights: formData.bed2Nights,
            total: (parseFloat(formData.bed2Price) || 0) * (parseInt(formData.bed2Nights) || 1)
          },
          bed3: {
            pricePerNight: formData.bed3Price,
            nights: formData.bed3Nights,
            total: (parseFloat(formData.bed3Price) || 0) * (parseInt(formData.bed3Nights) || 1)
          },
          bed4: {
            pricePerNight: formData.bed4Price,
            nights: formData.bed4Nights,
            total: (parseFloat(formData.bed4Price) || 0) * (parseInt(formData.bed4Nights) || 1)
          },
        },
        flightPricing: {
          pricePerPerson: formData.flightPricePerPerson,
          persons: formData.flightPersons,
          total: (parseFloat(formData.flightPricePerPerson) || 0) * (parseInt(formData.flightPersons) || 1)
        },
        transportPricing: {
          pricePerDay: formData.transportPricePerDay,
          days: formData.transportDays,
          total: (parseFloat(formData.transportPricePerDay) || 0) * (parseInt(formData.transportDays) || 1)
        },
      };

      console.log("Saving Umrah Package Data:", packageData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      enqueueSnackbar(
        editMode ? "Package updated successfully!" : "Package created successfully!",
        { variant: "success" }
      );

      // Reset form and close drawer
      setFormData(initialFormData);
      setFormErrors({});
      setEditMode(false);
      setEditingId(null);
      setDrawerOpen(false);

    } catch (error) {
      console.error("Error saving package:", error);
      enqueueSnackbar("Error saving package. Please try again.", { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (packageData) => {
    setFormData({
      ...packageData,
      zeyaratOption: "included" // Ensure this is set
    });
    setEditMode(true);
    setEditingId(packageData._id);
    setDrawerOpen(true);
  };

  const handleDelete = async (packageId) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        // API call to delete package
        console.log("Deleting package:", packageId);
        enqueueSnackbar("Package deleted successfully!", { variant: "success" });
      } catch (error) {
        enqueueSnackbar("Error deleting package", { variant: "error" });
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPackages.length === 0) {
      enqueueSnackbar("Please select packages to delete", { variant: "warning" });
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedPackages.length} packages?`)) {
      try {
        console.log("Bulk deleting packages:", selectedPackages);
        enqueueSnackbar(`${selectedPackages.length} packages deleted successfully!`, { variant: "success" });
        setSelectedPackages([]);
      } catch (error) {
        enqueueSnackbar("Error deleting packages", { variant: "error" });
      }
    }
  };

  const handleView = (packageData) => {
    console.log("Viewing package:", packageData);
    // You can implement a view-only modal here
  };

  const handleExport = () => {
    console.log("Exporting data...");
    enqueueSnackbar("Data exported successfully!", { variant: "success" });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
      enqueueSnackbar("Data refreshed successfully!", { variant: "success" });
    }, 1000);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAgencyUserStatus = (userId, status) => {
    // Handle status change logic here
    console.log("Changing status for user:", userId, "to:", status);
    enqueueSnackbar(`Status changed to ${status}`, { variant: "success" });
  };

  const handleEditStaff = (staff) => {
    // Handle edit staff logic here
    console.log("Editing staff:", staff);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setFormErrors({});
    setEditMode(false);
    setEditingId(null);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedPackages(data.map(item => item._id));
    } else {
      setSelectedPackages([]);
    }
  };

  const handleSelectPackage = (packageId) => {
    setSelectedPackages(prev =>
      prev.includes(packageId)
        ? prev.filter(id => id !== packageId)
        : [...prev, packageId]
    );
  };

  function RowMenu({ userId, status, staff, handleEditStaff, setOpenTopup }) {
    return (
      <>
        <Tooltip
          arrow={false}
          color="neutral"
          size="md"
          variant="solid"
          title={`Change status into ${status === "INACTIVE" ? "ACTIVE" : "INACTIVE"}`}
        >
          <PublishedWithChangesIcon onClick={() => handleAgencyUserStatus(userId, status)} sx={{ fontSize: '25px', cursor: 'pointer', mr: 1 }} />
        </Tooltip>

        <Tooltip
          arrow={false}
          color="neutral"
          size="md"
          variant="solid"
          title="View Details"
        >
          <VisibilityIcon onClick={() => handleView(staff)} sx={{ fontSize: '25px', cursor: 'pointer', mr: 1 }} />
        </Tooltip>

        <Tooltip
          arrow={false}
          color="neutral"
          size="md"
          variant="solid"
          title="Edit Package"
        >
          <EditIcon onClick={() => handleEdit(staff)} sx={{ fontSize: '25px', cursor: 'pointer', mr: 1 }} />
        </Tooltip>

        <Tooltip
          arrow={false}
          color="neutral"
          size="md"
          variant="solid"
          title="Delete Package"
        >
          <DeleteIcon onClick={() => handleDelete(staff._id)} sx={{ fontSize: '25px', cursor: 'pointer', mr: 1, color: 'error.main' }} />
        </Tooltip>
      </>
    );
  }

  const renderFilters = () => (
    <React.Fragment>
      <InputField
        type="text"
        label="Search Packages"
        name="search"
        placeholder="Search by package name, flight, or hotel"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <FormControl>
        <FormLabel>Status</FormLabel>
        <Dropdown>
          <MenuButton variant="outlined">
            {filterStatus === "all" ? "All Status" : filterStatus}
          </MenuButton>
          <Menu>
            <MenuItem onClick={() => setFilterStatus("all")}>All Status</MenuItem>
            <MenuItem onClick={() => setFilterStatus("ACTIVE")}>Active</MenuItem>
            <MenuItem onClick={() => setFilterStatus("INACTIVE")}>Inactive</MenuItem>
          </Menu>
        </Dropdown>
      </FormControl>

      <FormControl>
        <FormLabel>Sort By</FormLabel>
        <Dropdown>
          <MenuButton variant="outlined">
            {sortBy === "date" ? "Date" : sortBy === "price" ? "Price" : "Name"}
          </MenuButton>
          <Menu>
            <MenuItem onClick={() => setSortBy("date")}>Date</MenuItem>
            <MenuItem onClick={() => setSortBy("price")}>Price</MenuItem>
            <MenuItem onClick={() => setSortBy("name")}>Name</MenuItem>
          </Menu>
        </Dropdown>
      </FormControl>

      <AppButton
        text="Search"
        size="sm"
        width="120px"
        onClick={() => console.log("Searching with filters:", { searchTerm, filterStatus, sortBy })}
      />

      <AppButton
        text="Export"
        size="sm"
        width="120px"
        onClick={handleExport}
        startIcon={<DownloadIcon />}
      />
    </React.Fragment>
  );

  const StatCard = ({ title, value, icon, trend, color = "primary" }) => (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography level="title-sm" color="neutral">
            {title}
          </Typography>
          <Box sx={{
            p: 1,
            borderRadius: '50%',
            bgcolor: `${color}.50`,
            color: `${color}.500`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
        </Box>
        <Typography level="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
          {value}
        </Typography>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {trend > 0 ? (
              <TrendingUpIcon sx={{ color: 'success.500', fontSize: 16 }} />
            ) : (
              <TrendingDownIcon sx={{ color: 'danger.500', fontSize: 16 }} />
            )}
            <Typography level="body-xs" color={trend > 0 ? 'success' : 'danger'}>
              {Math.abs(trend)}% from last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        height: "auto",
        width: "100%",
        maxWidth: "1400px",
        mx: "auto"
      }}
    >
      {/* Dashboard Statistics */}
      <Box sx={{ mb: 4 }}>
        <Typography level="h4" sx={{ mb: 3, fontWeight: "bold", color: "primary.700" }}>
          Umrah Packages Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Total Packages"
              value={dashboardStats.totalPackages}
              icon={<HotelIcon />}
              trend={dashboardStats.monthlyGrowth}
              color="primary"
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Active Packages"
              value={dashboardStats.activePackages}
              icon={<FlightIcon />}
              color="success"
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Total Revenue"
              value={dashboardStats.totalRevenue}
              icon={<AttachMoneyIcon />}
              trend={8.2}
              color="warning"
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Total Bookings"
              value={dashboardStats.totalBookings}
              icon={<PeopleIcon />}
              trend={-2.1}
              color="info"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Main Content */}
      <Box>
        {/* Header with Actions */}
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          p: 2,
          bgcolor: "background.level1",
          borderRadius: "sm",
          border: "1px solid",
          borderColor: "divider"
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography level="h5" sx={{ fontWeight: "bold" }}>
              Package Management
            </Typography>
            {selectedPackages.length > 0 && (
              <Chip
                color="primary"
                variant="soft"
                startDecorator={null}
                endDecorator={null}
              >
                {selectedPackages.length} selected
              </Chip>
            )}
          </Box>


          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Refresh Data">
              <IconButton
                variant="outlined"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Toggle Filters">
              <IconButton
                variant="outlined"
                onClick={() => setShowFilters(!showFilters)}
                color={showFilters ? "primary" : "neutral"}
              >
                <FilterListIcon />
              </IconButton>
            </Tooltip>

            {selectedPackages.length > 0 && (
              <Button
                variant="outlined"
                color="danger"
                startIcon={<DeleteIcon />}
                onClick={handleBulkDelete}
                size="sm"
              >
                Delete Selected ({selectedPackages.length})
              </Button>
            )}

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDrawerOpen(true)}
              sx={{
                bgcolor: "primary.600",
                color: "white",
                "&:hover": {
                  bgcolor: "primary.700",
                  color: "white"
                }
              }}
            >
              Add Package
            </Button>
          </Box>
        </Box>

        {/* Filters Section */}
        {showFilters && (
          <Sheet
            variant="outlined"
            sx={{
              p: 3,
              mb: 3,
              borderRadius: "sm",
              bgcolor: "background.level1"
            }}
          >
            <Typography level="title-md" sx={{ mb: 2, fontWeight: "bold" }}>
              Filters & Search
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "end",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              {renderFilters()}
            </Box>
          </Sheet>
        )}

        {/* Mobile Search */}
        <Sheet
          className="SearchAndFilters-mobile"
          sx={{ display: { xs: "flex", sm: "none" }, my: 1, gap: 1, mb: 2 }}
        >
          <Input
            size="sm"
            placeholder="Search packages..."
            startDecorator={<SearchIcon />}
            sx={{ flexGrow: 1 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IconButton
            size="sm"
            variant="outlined"
            color="neutral"
            onClick={() => setOpen(true)}
          >
            <FilterAltIcon />
          </IconButton>
        </Sheet>

        {/* Table Section */}
        <Sheet
          className="OrderTableContainer"
          variant="outlined"
          sx={{
            width: "100%",
            borderRadius: "sm",
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider"
          }}
        >
          {isLoading && <LinearProgress />}

          <Table
            aria-labelledby="tableTitle"
            hoverRow
            sx={{
              "--TableCell-headBackground": "var(--joy-palette-background-level2)",
              "--Table-headerUnderlineThickness": "1px",
              "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
              "--TableCell-paddingY": "12px",
              "--TableCell-paddingX": "16px",
            }}
          >
            <thead>
              <tr>
                <th style={{ width: 50, textAlign: "center" }}>
                  <Checkbox
                    checked={selectedPackages.length === data.length && data.length > 0}
                    indeterminate={selectedPackages.length > 0 && selectedPackages.length < data.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th style={{ textAlign: "center", fontWeight: "bold" }}>ID</th>
                <th style={{ textAlign: "center", fontWeight: "bold" }}>Date</th>
                <th style={{ textAlign: "center", fontWeight: "bold" }}>Name</th>
                <th style={{ textAlign: "center", fontWeight: "bold" }}>Email</th>
                <th style={{ textAlign: "center", fontWeight: "bold" }}>Phone</th>
                <th style={{ textAlign: "center", fontWeight: "bold" }}>Type</th>
                <th style={{ textAlign: "center", fontWeight: "bold" }}>Price</th>
                <th style={{ textAlign: "center", fontWeight: "bold" }}>Package</th>
                <th style={{ textAlign: "center", fontWeight: "bold" }}>Role</th>
                <th style={{ textAlign: "center", fontWeight: "bold" }}>Status</th>
                <th style={{ textAlign: "center", fontWeight: "bold" }}>Agency</th>
                <th style={{ textAlign: "center", fontWeight: "bold" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td><Skeleton variant="rectangular" width={20} height={20} /></td>
                    <td><Skeleton variant="text" width={40} /></td>
                    <td><Skeleton variant="text" width={80} /></td>
                    <td><Skeleton variant="text" width={120} /></td>
                    <td><Skeleton variant="text" width={150} /></td>
                    <td><Skeleton variant="text" width={100} /></td>
                    <td><Skeleton variant="text" width={80} /></td>
                    <td><Skeleton variant="text" width={80} /></td>
                    <td><Skeleton variant="text" width={80} /></td>
                    <td><Skeleton variant="text" width={60} /></td>
                    <td><Skeleton variant="text" width={60} /></td>
                    <td><Skeleton variant="text" width={100} /></td>
                    <td><Skeleton variant="text" width={80} /></td>
                  </tr>
                ))
              ) : (
                data.map((row) => (
                  <tr key={row._id}>
                    <td style={{ textAlign: "center" }}>
                      <Checkbox
                        checked={selectedPackages.includes(row._id)}
                        onChange={() => handleSelectPackage(row._id)}
                      />
                    </td>
                    <td style={{ textAlign: "center", fontWeight: "500" }}>
                      #{row._id}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Chip
                        variant="soft"
                        size="sm"
                        color="neutral"
                      >
                        {row.date}
                      </Chip>
                    </td>
                    <td style={{ textAlign: "center", fontWeight: "500" }}>
                      {row.firstName}
                    </td>
                    <td style={{ wordBreak: "break-word", whiteSpace: "normal", textAlign: "center" }}>
                      <Typography level="body-sm" color="neutral">
                        {row.email}
                      </Typography>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Typography level="body-sm">
                        {row.phoneNumber}
                      </Typography>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Chip
                        variant="soft"
                        size="sm"
                        color={row.umrahType === "Premium" ? "warning" : "success"}
                      >
                        {row.umrahType}
                      </Chip>
                    </td>
                    <td style={{ textAlign: "center", fontWeight: "bold" }}>
                      <Typography level="body-sm" color="success.600">
                        PKR {parseInt(row.price).toLocaleString()}
                      </Typography>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Chip
                        variant="soft"
                        size="sm"
                        color="primary"
                      >
                        {row.package}
                      </Chip>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Typography level="body-sm" sx={{ textTransform: "capitalize" }}>
                        {row.role}
                      </Typography>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Chip
                        variant="soft"
                        size="sm"
                        color={row.status === "ACTIVE" ? "success" : "danger"}
                      >
                        {row.status}
                      </Chip>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Typography level="body-sm" color="neutral">
                        {row.agencyId.agencyName}
                      </Typography>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <RowMenu
                        userId={row._id}
                        status={row.status}
                        staff={row}
                        setOpenTopup={setOpenTopup}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Sheet>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box
            className="Pagination-laptopUp"
            sx={{
              pt: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography level="body-sm" color="neutral">
              Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, data.length)} of {data.length} results
            </Typography>

            <Box display="flex" gap={1}>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <IconButton
                    key={page}
                    size="sm"
                    variant={page === currentPage ? "contained" : "outlined"}
                    onClick={() => handlePageChange(page)}
                    sx={{
                      color: page === currentPage ? "#ffffff" : "#185ea5",
                      borderColor: "#185ea5",
                      borderWidth: 1,
                      backgroundColor:
                        page === currentPage ? "#185ea5" : "transparent",
                      "&:hover": {
                        backgroundColor: "#185ea5",
                        color: "#ffffff",
                        borderColor: "#185ea5",
                      },
                    }}
                  >
                    {page}
                  </IconButton>
                )
              )}
            </Box>
          </Box>
        )}
      </Box>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => {
          if (editMode) {
            if (window.confirm("Are you sure you want to cancel? Unsaved changes will be lost.")) {
              resetForm();
              setDrawerOpen(false);
            }
          } else {
            resetForm();
            setDrawerOpen(false);
          }
        }}
        sx={{
          '& .MuiDrawer-content': {
            width: { xs: '100vw', sm: 600, md: 700 },
            bgcolor: 'background.level2',
            boxShadow: 3,
            borderRadius: { xs: 0, sm: 'md' },
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            maxHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
          },
        }}
      >
        {/* Progress Bar */}
        <Box sx={{ position: 'sticky', top: 0, zIndex: 20, width: '100%' }}>
          <LinearProgress
            variant="determinate"
            value={
              [formData.packageName, formData.packagePrice, formData.flightName, formData.departureDate, formData.returnDate, formData.totalDays, formData.daysInMakkah, formData.makkahHotel, formData.daysInMadina, formData.madinaHotel].filter(Boolean).length * 10
            }
            sx={{ height: 4, borderRadius: 2, bgcolor: 'background.level2', '& .MuiLinearProgress-bar': { bgcolor: 'primary.500' } }}
          />
        </Box>
        {/* Sticky Header with Gradient */}
        <Box sx={{
          position: 'sticky',
          top: 4,
          zIndex: 10,
          bgcolor: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          px: 2, py: 1,
          minHeight: 48,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: 1,
          background: 'linear-gradient(90deg, #e0e7ff 0%, #f8fafc 100%)',
        }}>
          <Typography level="title-sm" component="h2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, fontSize: 18 }}>
            <AddIcon sx={{ color: 'primary.600', fontSize: 24 }} />
            {editMode ? "Edit Umrah Package" : "Add Umrah Package"}
          </Typography>
          <IconButton variant="plain" color="neutral" size="sm" onClick={() => setDrawerOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Scrollable Content */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 1, sm: 2 }, bgcolor: 'background.level2' }}>
          <Stack spacing={1.2}>
            {/* 1. Package Information */}
            <Card variant="soft" sx={{ p: 1.5, borderRadius: 1.5, boxShadow: 1, bgcolor: 'background.body', mb: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip color="primary" variant="solid" size="sm" sx={{ fontWeight: 'bold', fontSize: 13, borderRadius: '50%', width: 24, height: 24, justifyContent: 'center' }}>1</Chip>
                <Typography level="title-sm" sx={{ fontWeight: 600, color: "primary.600", fontSize: 16, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HotelIcon sx={{ fontSize: 18, color: 'primary.600' }} /> Package Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <FormLabel sx={{ fontWeight: 600, color: 'primary.600', fontSize: 13 }}>Status</FormLabel>
                <Tooltip title={formData.isActive ? 'Deactivate this package' : 'Activate this package'}>
                  <Switch
                    checked={formData.isActive}
                    onChange={e => handleInputChange('isActive', e.target.checked)}
                    color={formData.isActive ? 'success' : 'neutral'}
                    size="sm"
                  />
                </Tooltip>
                <Chip
                  color={formData.isActive ? 'success' : 'neutral'}
                  variant="soft"
                  size="sm"
                  sx={{ fontWeight: 600, ml: 1, fontSize: 13, px: 1, py: 0.2 }}
                >
                  {formData.isActive ? 'Active' : 'Inactive'}
                </Chip>
              </Box>
              <Typography level="body-xs" sx={{ color: 'neutral.600', mb: 1, fontSize: 12 }}>
                Toggle to activate or deactivate this package.
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Stack spacing={1}>
                <FormControl error={!!formErrors.packageName} size="sm">
                  <FormLabel sx={{ fontSize: 13 }}>Package Name *</FormLabel>
                  <Input
                    placeholder="Enter package name"
                    value={formData.packageName}
                    onChange={(e) => handleInputChange("packageName", e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="sm"
                    startDecorator={<HotelIcon color="primary" fontSize="small" />}
                  />
                  {formErrors.packageName && (
                    <Typography level="body-xs" color="danger" sx={{ mt: 0.5, fontSize: 12 }}>
                      {formErrors.packageName}
                    </Typography>
                  )}
                </FormControl>

                <Box sx={{ display: "flex", gap: 1, flexWrap: 'wrap' }}>
                  <FormControl error={!!formErrors.packagePrice} sx={{ flex: 1, minWidth: 120 }} size="sm">
                    <FormLabel sx={{ fontSize: 13 }}>Package Price (PKR) *</FormLabel>
                    <Input
                      type="number"
                      placeholder="Enter package price"
                      value={formData.packagePrice}
                      onChange={(e) => handleInputChange("packagePrice", e.target.value)}
                      fullWidth
                      variant="outlined"
                      size="sm"
                      startDecorator={<AttachMoneyIcon color="success" fontSize="small" />}
                    />
                    {formErrors.packagePrice && (
                      <Typography level="body-xs" color="danger" sx={{ mt: 0.5, fontSize: 12 }}>
                        {formErrors.packagePrice}
                      </Typography>
                    )}
                  </FormControl>

                  <FormControl sx={{ flex: 1, minWidth: 120 }} size="sm">
                    <FormLabel sx={{ fontSize: 13 }}>Package Category</FormLabel>
                    <Dropdown>
                      <MenuButton variant="outlined" fullWidth size="sm">
                        {formData.packageCategory.charAt(0).toUpperCase() + formData.packageCategory.slice(1)}
                      </MenuButton>
                      <Menu>
                        <MenuItem onClick={() => handleInputChange("packageCategory", "standard")}>Standard</MenuItem>
                        <MenuItem onClick={() => handleInputChange("packageCategory", "premium")}>Premium</MenuItem>
                        <MenuItem onClick={() => handleInputChange("packageCategory", "luxury")}>Luxury</MenuItem>
                      </Menu>
                    </Dropdown>
                  </FormControl>
                </Box>

                <FormControl size="sm">
                  <FormLabel sx={{ fontSize: 13 }}>Package Description</FormLabel>
                  <Input
                    placeholder="Enter package description"
                    value={formData.packageDescription}
                    onChange={(e) => handleInputChange("packageDescription", e.target.value)}
                    multiline
                    minRows={2}
                    fullWidth
                    variant="outlined"
                    size="sm"
                  />
                </FormControl>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <FormControl sx={{ flex: 1 }} size="sm">
                    <FormLabel sx={{ fontSize: 13 }}>Max Travelers</FormLabel>
                    <Input
                      type="number"
                      placeholder="Max travelers"
                      value={formData.maxTravelers}
                      onChange={(e) => handleInputChange("maxTravelers", e.target.value)}
                      fullWidth
                      variant="outlined"
                      size="sm"
                      startDecorator={<PeopleIcon color="info" fontSize="small" />}
                    />
                  </FormControl>
                </Box>
              </Stack>
            </Card>

            {/* 2. Duration Information */}
            <Card variant="soft" sx={{ p: 1.5, borderRadius: 1.5, boxShadow: 1, bgcolor: 'background.body' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip color="primary" variant="solid" size="sm" sx={{ fontWeight: 'bold', fontSize: 13, borderRadius: '50%', width: 24, height: 24, justifyContent: 'center' }}>2</Chip>
                <Typography level="title-sm" sx={{ fontWeight: 600, color: "primary.600", fontSize: 16, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarMonthIcon sx={{ fontSize: 18, color: 'primary.600' }} /> Duration Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <FormControl error={!!formErrors.totalDays} size="sm">
                <FormLabel sx={{ fontSize: 13 }}>Total Number of Days *</FormLabel>
                <Input
                  type="number"
                  placeholder="Enter total days"
                  value={formData.totalDays}
                  onChange={(e) => handleInputChange("totalDays", e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="sm"
                  startDecorator={<CalendarMonthIcon color="primary" fontSize="small" />}
                />
                {formErrors.totalDays && (
                  <Typography level="body-xs" color="danger" sx={{ mt: 0.5, fontSize: 12 }}>
                    {formErrors.totalDays}
                  </Typography>
                )}
              </FormControl>
            </Card>

            {/* 3. Flight Information */}
            <Card variant="soft" sx={{ p: 1.5, borderRadius: 1.5, boxShadow: 1, bgcolor: 'background.body' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip color="primary" variant="solid" size="sm" sx={{ fontWeight: 'bold', fontSize: 13, borderRadius: '50%', width: 24, height: 24, justifyContent: 'center' }}>3</Chip>
                <Typography level="title-sm" sx={{ fontWeight: 600, color: "primary.600", fontSize: 16, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FlightIcon sx={{ fontSize: 18, color: 'primary.600' }} /> Flight Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <Stack spacing={1}>
                <FormControl error={!!formErrors.flightName} size="sm">
                  <FormLabel sx={{ fontSize: 13 }}>Flight Name *</FormLabel>
                  <Input
                    placeholder="Enter flight name"
                    value={formData.flightName}
                    onChange={(e) => handleInputChange("flightName", e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="sm"
                    startDecorator={<FlightIcon color="primary" fontSize="small" />}
                  />
                  {formErrors.flightName && (
                    <Typography level="body-xs" color="danger" sx={{ mt: 0.5, fontSize: 12 }}>
                      {formErrors.flightName}
                    </Typography>
                  )}
                </FormControl>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <FormControl error={!!formErrors.departureDate} sx={{ flex: 1 }} size="sm">
                    <FormLabel sx={{ fontSize: 13 }}>Departure Date *</FormLabel>
                    <Input
                      type="date"
                      value={formData.departureDate}
                      onChange={(e) => handleInputChange("departureDate", e.target.value)}
                      fullWidth
                      variant="outlined"
                      size="sm"
                      startDecorator={<CalendarMonthIcon color="primary" fontSize="small" />}
                    />
                    {formErrors.departureDate && (
                      <Typography level="body-xs" color="danger" sx={{ mt: 0.5, fontSize: 12 }}>
                        {formErrors.departureDate}
                      </Typography>
                    )}
                  </FormControl>

                  <FormControl error={!!formErrors.returnDate} sx={{ flex: 1 }} size="sm">
                    <FormLabel sx={{ fontSize: 13 }}>Return Date *</FormLabel>
                    <Input
                      type="date"
                      value={formData.returnDate}
                      onChange={(e) => handleInputChange("returnDate", e.target.value)}
                      fullWidth
                      variant="outlined"
                      size="sm"
                      startDecorator={<CalendarMonthIcon color="primary" fontSize="small" />}
                    />
                    {formErrors.returnDate && (
                      <Typography level="body-xs" color="danger" sx={{ mt: 0.5, fontSize: 12 }}>
                        {formErrors.returnDate}
                      </Typography>
                    )}
                  </FormControl>
                </Box>

                {/* Flight Pricing */}
                <Box sx={{ mt: 1 }}>
                  <Typography level="body-sm" sx={{ mb: 1, fontWeight: 600, color: "primary.500", fontSize: 14 }}>
                    Flight Pricing
                  </Typography>
                  <Card variant="outlined" sx={{ p: 1.2, borderRadius: 1, boxShadow: 1, bgcolor: 'background.level1' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                      <FlightIcon color="primary" fontSize="small" />
                      <Typography level="body-sm" sx={{ fontWeight: 600, fontSize: 14 }}>Flight Pricing</Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <FormControl fullWidth sx={{ mb: 1 }} size="sm">
                        <FormLabel sx={{ fontSize: 13 }}>Price per Person</FormLabel>
                        <Input
                          type="number"
                          placeholder="PKR"
                          value={formData.flightPricePerPerson}
                          onChange={(e) => handleInputChange("flightPricePerPerson", e.target.value)}
                          startDecorator={<AttachMoneyIcon color="success" fontSize="small" />}
                          variant="outlined"
                          size="sm"
                        />
                      </FormControl>
                      <FormControl fullWidth sx={{ mb: 1 }} size="sm">
                        <FormLabel sx={{ fontSize: 13 }}>Persons</FormLabel>
                        <Input
                          type="number"
                          value={formData.flightPersons}
                          onChange={e => handleInputChange("flightPersons", Math.max(1, parseInt(e.target.value) || 1))}
                          sx={{ width: '100%' }}
                          inputProps={{ min: 1 }}
                          startDecorator={<PeopleIcon color="info" fontSize="small" />}
                          variant="outlined"
                          size="sm"
                        />
                      </FormControl>
                    </Box>
                    <Typography level="body-xs" sx={{ mt: 1, color: 'success.700', fontWeight: 600, fontSize: 13 }}>
                      Total: PKR {((parseFloat(formData.flightPricePerPerson) || 0) * (parseInt(formData.flightPersons) || 1)).toLocaleString()}
                    </Typography>
                  </Card>
                </Box>
              </Stack>
            </Card>

            {/* 4. Transport Information */}
            <Card variant="soft" sx={{ p: 1.5, borderRadius: 1.5, boxShadow: 1, bgcolor: 'background.body' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip color="primary" variant="solid" size="sm" sx={{ fontWeight: 'bold', fontSize: 13, borderRadius: '50%', width: 24, height: 24, justifyContent: 'center' }}>4</Chip>
                <Typography level="title-sm" sx={{ fontWeight: 600, color: "primary.600", fontSize: 16, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DirectionsBusIcon sx={{ fontSize: 18, color: 'primary.600' }} /> Transport Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <Card variant="outlined" sx={{ p: 1.2, borderRadius: 1, boxShadow: 1, bgcolor: 'background.level1' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                  <DirectionsBusIcon color="primary" fontSize="small" />
                  <Typography level="body-sm" sx={{ fontWeight: 600, fontSize: 14 }}>Transport Pricing</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <FormControl fullWidth sx={{ mb: 1 }} size="sm">
                    <FormLabel sx={{ fontSize: 13 }}>Price per Day</FormLabel>
                    <Input
                      type="number"
                      placeholder="PKR"
                      value={formData.transportPricePerDay}
                      onChange={(e) => handleInputChange("transportPricePerDay", e.target.value)}
                      startDecorator={<AttachMoneyIcon color="success" fontSize="small" />}
                      variant="outlined"
                      size="sm"
                    />
                  </FormControl>
                  <FormControl fullWidth sx={{ mb: 1 }} size="sm">
                    <FormLabel sx={{ fontSize: 13 }}>Days</FormLabel>
                    <Input
                      type="number"
                      value={formData.transportDays}
                      onChange={e => handleInputChange("transportDays", Math.max(1, parseInt(e.target.value) || 1))}
                      sx={{ width: '100%' }}
                      inputProps={{ min: 1 }}
                      startDecorator={<CalendarMonthIcon color="primary" fontSize="small" />}
                      variant="outlined"
                      size="sm"
                    />
                  </FormControl>
                </Box>
                <Typography level="body-xs" sx={{ mt: 1, color: 'success.700', fontWeight: 600, fontSize: 13 }}>
                  Total: PKR {((parseFloat(formData.transportPricePerDay) || 0) * (parseInt(formData.transportDays) || 1)).toLocaleString()}
                </Typography>
              </Card>
            </Card>

            {/* 5. Makkah Hotel Information */}
            <Card variant="soft" sx={{ p: 1.5, borderRadius: 1.5, boxShadow: 1, bgcolor: 'background.body' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip color="primary" variant="solid" size="sm" sx={{ fontWeight: 'bold', fontSize: 13, borderRadius: '50%', width: 24, height: 24, justifyContent: 'center' }}>5</Chip>
                <Typography level="title-sm" sx={{ fontWeight: 600, color: "primary.600", fontSize: 16, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HotelIcon sx={{ fontSize: 18, color: 'primary.600' }} /> Makkah Hotel Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <Stack spacing={1}>
                <FormControl error={!!formErrors.daysInMakkah} size="sm">
                  <FormLabel sx={{ fontSize: 13 }}>Number of Days in Makkah *</FormLabel>
                  <Input
                    type="number"
                    placeholder="Enter days"
                    value={formData.daysInMakkah}
                    onChange={(e) => handleInputChange("daysInMakkah", e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="sm"
                    startDecorator={<CalendarMonthIcon color="primary" fontSize="small" />}
                  />
                  {formErrors.daysInMakkah && (
                    <Typography level="body-xs" color="danger" sx={{ mt: 0.5, fontSize: 12 }}>
                      {formErrors.daysInMakkah}
                    </Typography>
                  )}
                </FormControl>

                <FormControl error={!!formErrors.makkahHotel} size="sm">
                  <FormLabel sx={{ fontSize: 13 }}>Makkah Hotel *</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter hotel name"
                    value={formData.makkahHotel}
                    onChange={(e) => handleInputChange("makkahHotel", e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="sm"
                    startDecorator={<HotelIcon color="primary" fontSize="small" />}
                  />
                  {formErrors.makkahHotel && (
                    <Typography level="body-xs" color="danger" sx={{ mt: 0.5, fontSize: 12 }}>
                      {formErrors.makkahHotel}
                    </Typography>
                  )}
                </FormControl>

                <FormControl error={!!formErrors.zeyaratMakkahStatus} size="sm">
                  <FormLabel sx={{ fontSize: 13 }}>Zeyarat in Makkah *</FormLabel>
                  <RadioGroup
                    orientation="horizontal"
                    value={formData.zeyaratMakkahStatus}
                    onChange={(e) => handleRadioChange("zeyaratMakkahStatus", e.target.value)}
                  >
                    <Radio value="included" label="Included" size="sm" />
                    <Radio value="not_included" label="Not Included" size="sm" />
                  </RadioGroup>
                  {formErrors.zeyaratMakkahStatus && (
                    <Typography level="body-xs" color="danger" sx={{ mt: 0.5, fontSize: 12 }}>
                      {formErrors.zeyaratMakkahStatus}
                    </Typography>
                  )}
                </FormControl>

                {/* Room Pricing */}
                <Box sx={{ mt: 1 }}>
                  <Typography level="body-sm" sx={{ mb: 1, fontWeight: 600, color: "primary.500", fontSize: 14 }}>
                    Room Pricing
                  </Typography>
                  <FormControl sx={{ mb: 1, width: 160 }} size="sm">
                    <FormLabel sx={{ fontSize: 13 }}>Select Room Type</FormLabel>
                    <select
                      value={selectedRoomType}
                      onChange={e => setSelectedRoomType(Number(e.target.value))}
                      style={{ padding: '6px', borderRadius: 5, border: '1px solid #ccc', fontSize: 14 }}
                    >
                      <option value={1}>1 Bed</option>
                      <option value={2}>2 Bed</option>
                      <option value={3}>3 Bed</option>
                      <option value={4}>4 Bed</option>
                    </select>

                  </FormControl>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ p: 1, borderRadius: 1, boxShadow: 1, bgcolor: 'background.level1' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                          <BedIcon color="primary" fontSize="small" />
                          <Typography level="body-sm" sx={{ fontWeight: 600, fontSize: 14 }}>{selectedRoomType} Bed</Typography>
                        </Box>
                        <FormControl fullWidth sx={{ mb: 1 }} size="sm">
                          <FormLabel sx={{ fontSize: 13 }}>Price per Night</FormLabel>
                          <Input
                            type="number"
                            placeholder="PKR"
                            value={formData[`bed${selectedRoomType}Price`]}
                            onChange={(e) => handleInputChange(`bed${selectedRoomType}Price`, e.target.value)}
                            startDecorator={<AttachMoneyIcon color="success" fontSize="small" />}
                            variant="outlined"
                            size="sm"
                          />
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 1 }} size="sm">
                          <FormLabel sx={{ fontSize: 13 }}>Nights</FormLabel>
                          <Input
                            type="number"
                            value={formData[`bed${selectedRoomType}Nights`]}
                            onChange={e => handleInputChange(`bed${selectedRoomType}Nights`, Math.max(1, parseInt(e.target.value) || 1))}
                            sx={{ width: '100%' }}
                            inputProps={{ min: 1 }}
                            startDecorator={<CalendarMonthIcon color="primary" fontSize="small" />}
                            variant="outlined"
                            size="sm"
                          />
                        </FormControl>
                        <Typography level="body-xs" sx={{ mt: 1, color: 'success.700', fontWeight: 600, fontSize: 13 }}>
                          Total: PKR {((parseFloat(formData[`bed${selectedRoomType}Price`]) || 0) * (parseInt(formData[`bed${selectedRoomType}Nights`]) || 1)).toLocaleString()}
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </Stack>
            </Card>

            {/* 6. Madinah Hotel Information */}
            <Card variant="soft" sx={{ p: 1.5, borderRadius: 1.5, boxShadow: 1, bgcolor: 'background.body' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip color="primary" variant="solid" size="sm" sx={{ fontWeight: 'bold', fontSize: 13, borderRadius: '50%', width: 24, height: 24, justifyContent: 'center' }}>6</Chip>
                <Typography level="title-sm" sx={{ fontWeight: 600, color: "primary.600", fontSize: 16, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HotelIcon sx={{ fontSize: 18, color: 'primary.600' }} /> Madinah Hotel Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <Stack spacing={1}>
                <FormControl error={!!formErrors.daysInMadina} size="sm">
                  <FormLabel sx={{ fontSize: 13 }}>Number of Days in Madinah *</FormLabel>
                  <Input
                    type="number"
                    placeholder="Enter days"
                    value={formData.daysInMadina}
                    onChange={(e) => handleInputChange("daysInMadina", e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="sm"
                    startDecorator={<CalendarMonthIcon color="primary" fontSize="small" />}
                  />
                  {formErrors.daysInMadina && (
                    <Typography level="body-xs" color="danger" sx={{ mt: 0.5, fontSize: 12 }}>
                      {formErrors.daysInMadina}
                    </Typography>
                  )}
                </FormControl>

                <FormControl error={!!formErrors.madinaHotel} size="sm">
                  <FormLabel sx={{ fontSize: 13 }}>Madinah Hotel *</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter hotel name"
                    value={formData.madinaHotel}
                    onChange={(e) => handleInputChange("madinaHotel", e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="sm"
                    startDecorator={<HotelIcon color="primary" fontSize="small" />}
                  />
                  {formErrors.madinaHotel && (
                    <Typography level="body-xs" color="danger" sx={{ mt: 0.5, fontSize: 12 }}>
                      {formErrors.madinaHotel}
                    </Typography>
                  )}
                </FormControl>

                <FormControl error={!!formErrors.zeyaratMadinaStatus} size="sm">
                  <FormLabel sx={{ fontSize: 13 }}>Zeyarat in Madinah *</FormLabel>
                  <RadioGroup
                    orientation="horizontal"
                    value={formData.zeyaratMadinaStatus}
                    onChange={(e) => handleRadioChange("zeyaratMadinaStatus", e.target.value)}
                  >
                    <Radio value="included" label="Included" size="sm" />
                    <Radio value="not_included" label="Not Included" size="sm" />
                  </RadioGroup>
                  {formErrors.zeyaratMadinaStatus && (
                    <Typography level="body-xs" color="danger" sx={{ mt: 0.5, fontSize: 12 }}>
                      {formErrors.zeyaratMadinaStatus}
                    </Typography>
                  )}
                </FormControl>

                {/* Room Pricing for Madinah */}
                <Box sx={{ mt: 1 }}>
                  <Typography level="body-sm" sx={{ mb: 1, fontWeight: 600, color: "primary.500", fontSize: 14 }}>
                    Room Pricing
                  </Typography>
                  <FormControl sx={{ mb: 1, width: 160 }} size="sm">
                    <FormLabel sx={{ fontSize: 13 }}>Select Room Type</FormLabel>
                    <select
                      value={selectedRoomType}
                      onChange={e => setSelectedRoomType(Number(e.target.value))}
                      style={{ padding: '6px', borderRadius: 5, border: '1px solid #ccc', fontSize: 14 }}
                    >
                      <option value={1}>1 Bed</option>
                      <option value={2}>2 Bed</option>
                      <option value={3}>3 Bed</option>
                      <option value={4}>4 Bed</option>
                    </select>
                  </FormControl>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                      <Card variant="outlined" sx={{ p: 1, borderRadius: 1, boxShadow: 1, bgcolor: 'background.level1' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                          <BedIcon color="primary" fontSize="small" />
                          <Typography level="body-sm" sx={{ fontWeight: 600, fontSize: 14 }}>{selectedRoomType} Bed</Typography>
                        </Box>
                        <FormControl fullWidth sx={{ mb: 1 }} size="sm">
                          <FormLabel sx={{ fontSize: 13 }}>Price per Night</FormLabel>
                          <Input
                            type="number"
                            placeholder="PKR"
                            value={formData[`bed${selectedRoomType}Price`]}
                            onChange={(e) => handleInputChange(`bed${selectedRoomType}Price`, e.target.value)}
                            startDecorator={<AttachMoneyIcon color="success" fontSize="small" />}
                            variant="outlined"
                            size="sm"
                          />
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 1 }} size="sm">
                          <FormLabel sx={{ fontSize: 13 }}>Nights</FormLabel>
                          <Input
                            type="number"
                            value={formData[`bed${selectedRoomType}Nights`]}
                            onChange={e => handleInputChange(`bed${selectedRoomType}Nights`, Math.max(1, parseInt(e.target.value) || 1))}
                            sx={{ width: '100%' }}
                            inputProps={{ min: 1 }}
                            startDecorator={<CalendarMonthIcon color="primary" fontSize="small" />}
                            variant="outlined"
                            size="sm"
                          />
                        </FormControl>
                        <Typography level="body-xs" sx={{ mt: 1, color: 'success.700', fontWeight: 600, fontSize: 13 }}>
                          Total: PKR {((parseFloat(formData[`bed${selectedRoomType}Price`]) || 0) * (parseInt(formData[`bed${selectedRoomType}Nights`]) || 1)).toLocaleString()}
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </Stack>
            </Card>

            {/* 7. Visa Information */}
            <Card variant="soft" sx={{ p: 1.5, borderRadius: 1.5, boxShadow: 1, bgcolor: 'background.body' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip color="primary" variant="solid" size="sm" sx={{ fontWeight: 'bold', fontSize: 13, borderRadius: '50%', width: 24, height: 24, justifyContent: 'center' }}>7</Chip>
                <Typography level="title-sm" sx={{ fontWeight: 600, color: "primary.600", fontSize: 16, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoneyIcon sx={{ fontSize: 18, color: 'primary.600' }} /> Visa Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <FormLabel sx={{ fontWeight: 600, fontSize: 13 }}>Transport Option</FormLabel>
                <RadioGroup
                  value={formData.zeyaratOption}
                  onChange={(e) => handleRadioChange("zeyaratOption", e.target.value)}
                >
                  <Radio value="included" label="With Transport" size="sm" />
                </RadioGroup>
              </Box>
            </Card>

            {/* 8. Additional Services */}
            <Card variant="soft" sx={{ p: 1.5, borderRadius: 1.5, boxShadow: 1, bgcolor: 'background.body' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip color="primary" variant="solid" size="sm" sx={{ fontWeight: 'bold', fontSize: 13, borderRadius: '50%', width: 24, height: 24, justifyContent: 'center' }}>8</Chip>
                <Typography level="title-sm" sx={{ fontWeight: 600, color: "primary.600", fontSize: 16, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AddCardIcon sx={{ fontSize: 18, color: 'primary.600' }} /> Additional Services
                </Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <FormControl error={!!formErrors.insuranceOption} size="sm">
                <FormLabel sx={{ fontSize: 13 }}>Insurance Option *</FormLabel>
                <RadioGroup
                  value={formData.insuranceOption}
                  onChange={(e) => handleRadioChange("insuranceOption", e.target.value)}
                >
                  <Radio value="included" label="Included" size="sm" />
                  <Radio value="not_included" label="Not Included" size="sm" />
                </RadioGroup>
                {formErrors.insuranceOption && (
                  <Typography level="body-xs" color="danger" sx={{ mt: 0.5, fontSize: 12 }}>
                    {formErrors.insuranceOption}
                  </Typography>
                )}
              </FormControl>
            </Card>

            {/* 9. Policies & Terms */}
            <Card variant="soft" sx={{ p: 1.5, borderRadius: 1.5, boxShadow: 1, bgcolor: 'background.body' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip color="primary" variant="solid" size="sm" sx={{ fontWeight: 'bold', fontSize: 13, borderRadius: '50%', width: 24, height: 24, justifyContent: 'center' }}>9</Chip>
                <Typography level="title-sm" sx={{ fontWeight: 600, color: "primary.600", fontSize: 16, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EditIcon sx={{ fontSize: 18, color: 'primary.600' }} /> Policies & Terms
                </Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />
              <Stack spacing={1}>
                <FormControl size="sm">
                  <FormLabel sx={{ fontSize: 13 }}>Terms & Conditions</FormLabel>
                  <Input
                    placeholder="Enter terms and conditions"
                    value={formData.termsAndConditions}
                    onChange={(e) => handleInputChange("termsAndConditions", e.target.value)}
                    multiline
                    minRows={3}
                    fullWidth
                    variant="outlined"
                    size="sm"
                  />
                </FormControl>

                <FormControl size="sm">
                  <FormLabel sx={{ fontSize: 13 }}>Cancellation Policy</FormLabel>
                  <Input
                    placeholder="Enter cancellation policy"
                    value={formData.cancellationPolicy}
                    onChange={(e) => handleInputChange("cancellationPolicy", e.target.value)}
                    multiline
                    minRows={3}
                    fullWidth
                    variant="outlined"
                    size="sm"
                  />
                </FormControl>
              </Stack>
            </Card>
          </Stack>
        </Box>

        {/* Sticky Footer */}
        <Box sx={{
          position: 'sticky',
          bottom: 0,
          zIndex: 10,
          bgcolor: 'background.level2',
          borderTop: '1px solid',
          borderColor: 'divider',
          px: 2, py: 1,
          minHeight: 48,
          display: 'flex',
          gap: 1,
          justifyContent: 'flex-end',
          boxShadow: 1,
          boxShadow: '0 0 12px 0 #a5b4fc33',
        }}>
          <Button
            variant="outlined"
            size="sm"
            onClick={() => {
              if (editMode) {
                if (window.confirm("Are you sure you want to cancel? Unsaved changes will be lost.")) {
                  resetForm();
                  setDrawerOpen(false);
                }
              } else {
                resetForm();
                setDrawerOpen(false);
              }
            }}
            disabled={isSubmitting}
            sx={{ minWidth: 90, fontWeight: 600, fontSize: 14, transition: 'all 0.2s', '&:hover': { bgcolor: 'primary.50', color: 'primary.700', borderColor: 'primary.700' } }}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            size="sm"
            onClick={handleSave}
            disabled={isSubmitting}
            startIcon={isSubmitting ? <div className="spinner" /> : null}
            sx={{ minWidth: 120, fontWeight: 600, fontSize: 14, bgcolor: 'primary.700', color: 'white', boxShadow: '0 0 8px 0 #6366f133', '&:hover': { bgcolor: 'primary.800', color: 'white', boxShadow: '0 0 16px 0 #6366f166' } }}
          >
            {isSubmitting ? "Saving..." : (editMode ? "Update Package" : "Save Package")}
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}
