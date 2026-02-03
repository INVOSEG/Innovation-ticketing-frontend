import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Modal,
  ModalClose,
  Sheet,
  Table,
  Typography,
  Input,
  Card,
  Drawer,
} from "@mui/joy";
import { Delete, Edit, RemoveRedEye } from "@mui/icons-material";
import AddEditForm from "../../components/utils/AddEditFormTraveller";
import { NEXT_PUBLIC_PROD_URL } from "../../env";

const AllTravellers = () => {
  const [travellers, setTravellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cnicError, setCnicError] = useState("");
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState("Add"); 
  const [currentTraveller, setCurrentTraveller] = useState(null); 
  const [filters, setFilters] = useState({
    code: "",
    firstname: "",
    lastname: "",
    cnic: "",
    passportNumber: "",
  });
  const [drawerOpen , setDrawerOpen] = useState(false)
  const [drawerData , setDrawerData] = useState([])

  useEffect(() => {
    const fetchTravellers = async () => {
      try {
        const response = await axios.get(
          `${NEXT_PUBLIC_PROD_URL}traveller/getAll`,
          {
            params: filters,
          }
        );

        setTravellers(response.data.result.paxList || []);
      } catch (err) {
        setError("Failed to fetch travellers.");
      } finally {
        setLoading(false);
      }
    };

    if (!cnicError) {
      fetchTravellers();
    }
  }, [filters, cnicError]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if (name === "cnic") {
      if (value && value.length !== 13 && value.length !== 0) {
        setCnicError("CNIC must be exactly 13 digits.");
      } else {
        setCnicError("");
      }
    }

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    if (cnicError) {
      alert("Please fix the CNIC input before searching.");
      return;
    }
  };

  const handleReset = () => {
    setFilters({
      code: "",
      firstname: "",
      lastname: "",
      cnic: "",
      passportNumber: "",
    });
    setCnicError("");
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="danger">{error}</Typography>;
  }


  const handleDeleteTraveller = async (documentId) => {
    try {
      const response = await axios.delete(
        `${NEXT_PUBLIC_PROD_URL}traveller/delete/${documentId}`
      );
      console.log(response.data, "Traveller deleted successfully");
      setTravellers((prev) =>
        prev.filter((traveller) => traveller._id !== documentId)
      ); 
    } catch (error) {
      console.error("Error deleting traveller:", error);
    }
  };
  
  const handleEdit = (traveller) => {
    setModalType("Edit");
    setCurrentTraveller(traveller); 
    setOpen(true);
  };

  const handleAdd = () => {
    setModalType("Add");
    setCurrentTraveller(null); 
    setOpen(true);
  };

  const handleTravellersDrawer = (traveller) => {
    setDrawerData(traveller);
    setDrawerOpen(true);
  };

  return (
    <Box sx={{ mt: 2, overflowX: "auto" }}>
      <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap" }}>
        <Input
          placeholder="Code"
          name="code"
          value={filters.code}
          onChange={handleFilterChange}
          sx={{ mr: 2 }}
        />
        <Input
          placeholder="First Name"
          name="firstname"
          value={filters.firstname}
          onChange={handleFilterChange}
          sx={{ mr: 2 }}
        />
        <Input
          placeholder="Last Name"
          name="lastname"
          value={filters.lastname}
          onChange={handleFilterChange}
          sx={{ mr: 2 }}
        />
        <Input
          placeholder="CNIC"
          name="cnic"
          value={filters.cnic}
          onChange={handleFilterChange}
          sx={{ mr: 2 }}
        />
        {cnicError && (
          <Typography color="danger" sx={{ ml: 2 }}>
            {cnicError}
          </Typography>
        )}
        <Input
          placeholder="Passport Number"
          name="passportNumber"
          value={filters.passportNumber}
          onChange={handleFilterChange}
          sx={{ mr: 2 }}
        />
        <Button onClick={handleSearch} sx={{ mr: 2 }}>
          Search
        </Button>
        <Button onClick={handleReset} sx={{ mr: 16 }} variant="outlined" color="neutral">
          Reset Filters
        </Button>
        <Button onClick={handleAdd}  >
          Add Traveller
        </Button>
      </Box>
      <Table aria-label="basic table">
        <thead>
          <tr>
            <th style={{ width: "5%" }}>Code</th>
            <th style={{ width: "10%" }}>First Name</th>
            <th style={{ width: "10%" }}>Last Name</th>
            <th>Pax Type</th>
            <th>Phone</th>
            <th style={{ width: "15%" }}>Email</th>
            
            <th>CNIC</th>
            <th>Passport</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {travellers.map((traveller, index) => (
            <tr key={index}>
              <td>{traveller?.code}</td>
              <td
                style={{
                  width: "10%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {traveller?.firstname}
              </td>
              <td
                style={{
                  width: "10%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {traveller?.lastname}
              </td>
              <td>{traveller?.paxType}</td>
              <td>{traveller?.phoneNumber}</td>
              <td
                style={{
                  width: "15%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {traveller?.email}
              </td>
             
              <td>{traveller?.cnic}</td>
              <td>{traveller?.passportNumber}</td>
             
              <td>
                 <RemoveRedEye
                                              sx={{ cursor: "pointer", fontSize: "25px", color: "red" }}
                                              onClick={() => handleTravellersDrawer(traveller)}
                                            />
                <Edit
                  sx={{
                    cursor: "pointer",
                    fontSize: "25px",
                    color: "grey",
                    mx: "10px",
                  }}
                  onClick={() => handleEdit(traveller)}
                />
                <Delete
                  sx={{ cursor: "pointer", fontSize: "25px", color: "red" }}
                  onClick={() => {
                    if (window.confirm("Are you sure?")) {
                      handleDeleteTraveller(traveller._id);
                    }
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
        <Drawer
      open={drawerOpen}
      anchor="right"
      PaperProps={{
        sx: { width: "1200px" },
      }}
      onClose={() => setDrawerOpen(false)}
    >
      <Button onClick={() => setDrawerOpen(false)} sx={{mt:"10px"}}>Close</Button>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, p:2 }}>
  {Object.entries(drawerData).map(([key, value], idx) => (
    <Card
      key={idx}
      sx={{
        padding: 2,
        borderRadius: "10px",
        boxShadow: "sm",
        width: "calc(33.33% - 16px)", 
        minWidth: "48%", 
      }}
    >
      <Typography level="body2" sx={{ fontWeight: "bold", color: "gray" }}>
        {key}
      </Typography>

    
    <Typography level="body1">{value|| "N/A"}</Typography>
      
    </Card>
  ))}
</Box>



    </Drawer>
      </Table>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Sheet
          variant="outlined"
          sx={{ maxWidth: 700, borderRadius: "md", p: 3, boxShadow: "lg" }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <AddEditForm
            type={modalType}
            traveller={currentTraveller} 
            onClose={() => setOpen(false)} 
          />        </Sheet>
      </Modal>
    </Box>
  );
};

export default AllTravellers;
