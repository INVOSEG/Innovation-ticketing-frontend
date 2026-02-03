import {
  Box,
  Button,
  Card,
  Drawer,
  Modal,
  ModalClose,
  Sheet,
  Table,
  Typography,
} from "@mui/joy";
import React, { useEffect, useState } from "react";
import InputField from "../../components/common/InputField";
import AppTextArea from "../../components/common/AppTextArea";
import axios from "axios";
import { Delete, Edit, RemoveRedEye } from "@mui/icons-material";
import AddEditModalGDS from "../../components/utils/AddEditModalGDS";
import { NEXT_PUBLIC_PROD_URL } from "../../env";

const AddGDS = () => {
  const [gdsAllData, setGdsAllData] = useState();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    code: "",
    title: "",
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState([]);

  const [modalType, setModalType] = useState("Add");
  const [currentGDS, setCurrentGDS] = useState(null);

  const handleEdit = (gds) => {
    console.log("object");
    setModalType("Edit");
    setCurrentGDS(gds);
    setOpen(true);
  };

  const handleAdd = () => {
    setModalType("Add");
    setCurrentGDS(null);
    setOpen(true);
  };

  useEffect(() => {
    const fetchGDS = async () => {
      try {
        const response = await axios.get(`${NEXT_PUBLIC_PROD_URL}gds/getAll`, {
          params: filters,
        });
        setGdsAllData(response.data.result.data || []);
        console.log(gdsAllData, "gds");
      } catch (err) {
        console.log("Failed to fetch gds.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGDS();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetGDS = () => {
    setFilters({
      code: "",
      title: "",
    });
  };

  const handleDeleteGDS = async (documentId) => {
    try {
      const response = await axios.delete(
        `${NEXT_PUBLIC_PROD_URL}gds/delete/${documentId}`
      );
      console.log(response.data, "GDS deleted successfully");
      setGdsAllData((prev) => prev.filter((gds) => gds._id !== documentId));
    } catch (error) {
      console.error("Error deleting gds:", error);
    }
  };

  const handleGDSDrawer = (gds) => {
    setDrawerData(gds);
    setDrawerOpen(true);
  };

  return (
    <>
      <Box sx={{ mt: 2, overflowX: "auto" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap" }}>
            <InputField
              placeholder="Code"
              name="code"
              value={filters.code}
              onChange={handleFilterChange}
              sx={{ mr: 2 }}
            />
            <InputField
              placeholder="Title"
              name="title"
              value={filters.title}
              onChange={handleFilterChange}
              sx={{ mr: 2 }}
            />

            <Button
              onClick={handleResetGDS}
              sx={{ mr: 16 }}
              variant="outlined"
              color="neutral"
            >
              Reset Filters
            </Button>
          </Box>
          <Button onClick={handleAdd} sx={{ width: "150px", height: "40px" }}>
            Add GDS
          </Button>
        </Box>
        <Table aria-label="basic table">
          <thead>
            <tr>
              <th style={{ width: "20%" }}>Code</th>
              <th style={{ width: "20%" }}>Title</th>
              <th style={{ width: "50%" }}>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {gdsAllData?.map((gds, index) => (
              <tr key={index}>
                <td
                  style={{
                    width: "20%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {gds?.code}
                </td>
                <td
                  style={{
                    width: "20%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {gds?.title}
                </td>
                <td
                  style={{
                    width: "55%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {gds?.description}
                </td>

                <td>
                  <RemoveRedEye
                    sx={{ cursor: "pointer", fontSize: "25px", color: "red" }}
                    onClick={() => handleGDSDrawer(gds)}
                  />
                  <Edit
                    sx={{
                      cursor: "pointer",
                      fontSize: "25px",
                      color: "grey",
                      mx: "10px",
                    }}
                    onClick={() => handleEdit(gds)}
                  />
                  <Delete
                    sx={{ cursor: "pointer", fontSize: "25px", color: "red" }}
                    onClick={() => {
                      if (window.confirm("Are you sure?")) {
                        handleDeleteGDS(gds._id);
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
            <Button onClick={() => setDrawerOpen(false)} sx={{ mt: "10px" }}>
              Close
            </Button>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, p: 2 }}>
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
                  <Typography
                    level="body2"
                    sx={{ fontWeight: "bold", color: "gray" }}
                  >
                    {key}
                  </Typography>

                  <Typography level="body1">{value || "N/A"}</Typography>
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
            <AddEditModalGDS
              type={modalType}
              gds={currentGDS}
              onClose={() => setOpen(false)}
            />
          </Sheet>
        </Modal>
      </Box>
    </>
  );
};

export default AddGDS;
