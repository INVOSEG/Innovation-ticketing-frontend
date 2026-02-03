import React, { useCallback, useEffect, useState } from "react";
import InputField from "../../components/common/InputField";
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
import AppTextArea from "../../components/common/AppTextArea";
import Checkbox from "@mui/joy/Checkbox";
import axios, { Axios } from "axios";
import { Delete, Edit, RemoveRedEye, Search } from "@mui/icons-material";
import SearchSelect from "../../components/common/SearchSelect";
import { NEXT_PUBLIC_PROD_URL } from "../../env";

const CustomTable = ({ onChange }) => {
  return (
    <table
      style={{ width: "95%", borderCollapse: "collapse", marginTop: "10px" }}
    >
      <thead>
        <tr>
          <th
            style={{
              borderRight: "1px solid lightgrey",
              borderBottom: "1px solid lightgrey",
              padding: "5px",
            }}
          >
            Title
          </th>
          <th
            style={{
              borderRight: "1px solid lightgrey",
              borderBottom: "1px solid lightgrey",
              padding: "5px",
            }}
          >
            Details
          </th>
        </tr>
      </thead>
      <tbody>
        {[...Array(4)].map((_, index) => (
          <tr key={index} style={{ height: "30px" }}>
            <td
              style={{
                borderRight: "1px solid lightgrey",
                borderBottom: "1px solid lightgrey",
                padding: "5px",
              }}
            >
              <input
                type="text"
                onChange={(e) => onChange(index, "title", e.target.value)}
                style={{ width: "100%" }}
              />
            </td>
            <td
              style={{
                borderRight: "1px solid lightgrey",
                borderBottom: "1px solid lightgrey",
                padding: "5px",
              }}
            >
              <input
                type="text"
                onChange={(e) => onChange(index, "details", e.target.value)}
                style={{ width: "100%" }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ConatctTable = ({ onChange, type, page, customerData, supplierData }) => {
  const isCustomer = page === "Add Customer" || type === "Edit Customer"; // Check if it's for customer
  const contacts = isCustomer
    ? customerData?.contact || []
    : supplierData?.contact || []; // Use customerData if it's for customer, else use supplierData

  console.log(contacts, "ooooo");

  // Ensure at least 4 rows and make sure they are separate instances (not shared references)
  const displayedContacts =
    contacts.length >= 4
      ? contacts
      : [
          ...contacts,
          ...Array(4 - contacts.length).fill({
            name: "",
            designation: "",
            phone: "",
          }),
        ];

  return (
    <table
      style={{ width: "95%", borderCollapse: "collapse", marginTop: "10px" }}
    >
      <thead>
        <tr>
          <th
            style={{
              borderRight: "1px solid lightgrey",
              borderBottom: "1px solid lightgrey",
              padding: "5px",
            }}
          >
            Name
          </th>
          <th
            style={{
              borderRight: "1px solid lightgrey",
              borderBottom: "1px solid lightgrey",
              padding: "5px",
            }}
          >
            Designation
          </th>
          <th
            style={{
              borderRight: "1px solid lightgrey",
              borderBottom: "1px solid lightgrey",
              padding: "5px",
            }}
          >
            Phone
          </th>
        </tr>
      </thead>
      <tbody>
        {displayedContacts.map((data, index) => (
          <tr key={index} style={{ height: "30px" }}>
            <td
              style={{
                borderRight: "1px solid lightgrey",
                borderBottom: "1px solid lightgrey",
                padding: "5px",
              }}
            >
              <input
                type="text"
                onChange={(e) => onChange(index, "name", e.target.value)}
                style={{ width: "100%" }}
                value={data?.name || ""}
              />
            </td>
            <td
              style={{
                borderRight: "1px solid lightgrey",
                borderBottom: "1px solid lightgrey",
                padding: "5px",
              }}
            >
              <input
                type="text"
                onChange={(e) => onChange(index, "designation", e.target.value)}
                style={{ width: "100%" }}
                value={data?.designation || ""}
              />
            </td>
            <td
              style={{
                borderRight: "1px solid lightgrey",
                borderBottom: "1px solid lightgrey",
                padding: "5px",
              }}
            >
              <input
                type="text"
                onChange={(e) => onChange(index, "phone", e.target.value)}
                style={{ width: "100%" }}
                value={data?.phone || ""}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const AddForm = ({ page }) => {
  const [activeOption, setActiveOption] = useState("General Information");
  // const [activeOption1, setActiveOption1] = useState("Airline");
  const [open, setOpen] = useState();
  const [customersAll, setCustomersAll] = useState();
  const [supplierAll, setSupplierAll] = useState();
  const [type, setType] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState([]);

  useEffect(() => {
    getAllCustomerSupplier();
  }, []);

  const getAllCustomerSupplier = async () => {
    if (page !== "Add Supplier") {
      try {
        const response = await axios.get(
          `${NEXT_PUBLIC_PROD_URL}customer/getAllCustomer`
        );
        setCustomersAll(response.data.result);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const response = await axios.get(
          `${NEXT_PUBLIC_PROD_URL}supplier/getAll`
        );
        setSupplierAll(response.data.result);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const [customerData, setCustomerData] = useState({
    code: "",
    title: "",
    shortName: "",
    details: "",
    address1: "",
    address2: "",
    state: "",
    zip: "",
    country: "",
    city: "",
    phone1: "",
    phone2: "",
    contact: Array(4).fill({ name: "", designation: "", phone: "" }),
    parentCustomer: "",
    customerType: "",
    creditLimit: "",
    NTNNumber: "",
    saleTaxNumber: "",
    dateOfCreation: "",
    dateOfExpiry: "",
    IATANumber: "",
    createAutoLedgerAccount: true,
    visibleToAllBranches: true,
    hideOnInvoice: false,
    SPO: "",
    creditTerm: "",
    fax: "",
  });
  const [supplierData, setSupplierData] = useState({
    code: "",
    title: "",
    shortName: "",
    details: "",
    address1: "",
    address2: "",
    state: "",
    zip: "",
    country: "",
    city: "",
    phone1: "",
    phone2: "",
    contact: Array(4).fill({ name: "", designation: "", phone: "" }),
    GLAccount: "",
    NTNNumber: "",
    creditLimit: "",
    createAutoLedgerAccount: true,
    visibleToAllBranches: true,
    addAllVendors: false,
    fax: "",
  });

  const handleInputChange = (field, value) => {
    if (page === "Add Supplier" || type === "Edit Supplier") {
      setSupplierData((prev) => ({ ...prev, [field]: value }));
    } else {
      setCustomerData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleCheckboxChange = (field, value) => {
    const updateData = (data) => ({ ...data, [field]: value });
    if (page === "Add Supplier") setSupplierData(updateData);
    else setCustomerData(updateData);
  };

  const handleTableChange = (index, key, value) => {
    if (page === "Add Supplier" || type === "Edit Supplier") {
      setSupplierData((prev) => {
        const updatedContacts = [
          ...(prev.contact ||
            Array(4).fill({ name: "", designation: "", phone: "" })),
        ];
        updatedContacts[index] = { ...updatedContacts[index], [key]: value };
        console.log("this is  working");

        return { ...prev, contact: updatedContacts };
      });
    } else {
      setCustomerData((prev) => {
        const updatedContacts = [
          ...(prev.contact ||
            Array(4).fill({ name: "", designation: "", phone: "" })),
        ];
        updatedContacts[index] = { ...updatedContacts[index], [key]: value };
        return { ...prev, contact: updatedContacts };
      });
    }
  };

  const addEditSupplier = async (id) => {
    console.log(supplierData, "777");
    if (type !== "Edit Supplier") {
      try {
        const data = supplierData;

        const response = await axios.post(
          `${NEXT_PUBLIC_PROD_URL}supplier/create`,
          data
        );
        console.log(response, "888888");
        alert(`Supplier added successfully!`);
        setOpen(false);
      } catch (error) {
        console.error("Error adding data:", error);
        alert(`Failed to add ${page}`);
      }
    } else {
      try {
        const data = supplierData;

        const response = await axios.put(
          `${NEXT_PUBLIC_PROD_URL}supplier/update/${id}`,
          data
        );
        console.log(response, "888888");
        alert(`Supplier Edit successfully!`);
        setOpen(false);
      } catch (error) {
        console.error("Error adding data:", error);
        alert(`Failed to add ${page}`);
      }
    }
  };

  const addEditCustomer = async (id) => {
    console.log(customerData);
    if (type !== "Edit Customer") {
      try {
        const data = customerData;

        const response = await axios.post(
          `${NEXT_PUBLIC_PROD_URL}customer/createCustomer`,
          data
        );
        console.log(response, "55555");
        setOpen(false);

        alert(`Customer added successfully!`);
      } catch (error) {
        console.error("Error adding data:", error);
        alert(`Failed to add ${page}`);
      }
    } else {
      try {
        const data = customerData;

        const response = await axios.put(
          `${NEXT_PUBLIC_PROD_URL}customer/updateCustomer/${id}`,
          data
        );
        console.log(response, "55555");
        setOpen(false);

        alert(`Customer Edit successfully!`);
      } catch (error) {
        console.error("Error adding data:", error);
        alert(`Failed to add ${page}`);
      }
    }
  };

  const loadSPOOptions = useCallback(async (inputValue) => {
    if (inputValue.length < 3) return [];
    try {
      const response = await axios.get(`${NEXT_PUBLIC_PROD_URL}spo/getAll`);

      return response.data.result.map((data) => ({
        label: `${data.firstName} ${data.lastName} ${data.code} `,
        value: {
          firstName: data.firstName,
          lastName: data.lastName,
          code: data.code,
          _id: data._id,
        },
      }));
    } catch (error) {
      console.error("Error fetching customer options:", error);
      return [];
    }
  }, []);

  const loadParentCustomerOptions = useCallback(async (inputValue) => {
    if (inputValue.length < 3) return [];
    try {
      const response = await axios.get(
        `${NEXT_PUBLIC_PROD_URL}customer/parent`
      );

      return response.data.result.map((data) => ({
        label: `${data.title} ${data.code}  `,
        value: {
          title: data.title,
          code: data.code,
          code: data.code,
          _id: data._id,
        },
      }));
    } catch (error) {
      console.error("Error fetching customer options:", error);
      return [];
    }
  }, []);

  const loadCustomerTypeOptions = useCallback(async (inputValue) => {
    if (inputValue.length < 3) return [];
    try {
      const response = await axios.get(
        `${NEXT_PUBLIC_PROD_URL}customer/getAll`
      );

      return response.data.result.map((data) => ({
        label: `${data.title}`,
        value: { _id: data._id, title: data.title },
      }));
    } catch (error) {
      console.error("Error fetching customer options:", error);
      return [];
    }
  }, []);

  const handleCustomerTypeSelection = (selectedOption) => {
    if (selectedOption) {
      setCustomerData((prevData) => ({
        ...prevData,
        customerType: selectedOption.value._id,
      }));
    }
  };

  const handleSPOSelection = (selectedOption) => {
    if (selectedOption) {
      setCustomerData((prevData) => ({
        ...prevData,
        SPO: selectedOption.value._id,
      }));
    }
  };

  const handleParentCustomerSelection = (selectedOption) => {
    if (selectedOption) {
      setCustomerData((prevData) => ({
        ...prevData,
        parentCustomer: selectedOption.value._id,
      }));
    }
  };

  const handleAdd = () => {
    setOpen(true);
  };

  const handleEditCustomer = (customer) => {
    setType("Edit Customer");
    console.log(customer);
    setOpen(true);
    setCustomerData(customer);
    console.log(customerData, "ccc");
  };
  const handleEditSupplier = (supplier) => {
    setType("Edit Supplier");
    console.log(supplier);
    setOpen(true);
    setSupplierData(supplier);
  };

  const handleCustomerDrawer = (customer) => {
    setDrawerData(customer);
    setDrawerOpen(true);
  };

  const handleSupplierDrawer = (supplier) => {
    setDrawerData(supplier);
    setDrawerOpen(true);
  };

  const handleDeleteCustomer = async (documentId) => {
    try {
      const response = await axios.delete(
        `${NEXT_PUBLIC_PROD_URL}customer/deleteCustomer/${documentId}`
      );
      console.log(response.data, "Customer deleted successfully");
      setCustomersAll((prev) =>
        prev.filter((customer) => customer._id !== documentId)
      );
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };
  const handleDeleteSupplier = async (documentId) => {
    try {
      const response = await axios.delete(
        `${NEXT_PUBLIC_PROD_URL}supplier/delete/${documentId}`
      );
      console.log(response.data, "Supplier deleted successfully");
      setSupplierAll((prev) =>
        prev.filter((supplier) => supplier._id !== documentId)
      );
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  useEffect(() => {
    console.log(drawerData, "Updated Drawer Data");
  }, [drawerData]);

  return (
    <>
      <Box sx={{ mt: 2, overflowX: "auto" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap" }}>
            <InputField
              placeholder="Code"
              name="code"
              // value={filters.code}
              // onChange={handleFilterChange}
              sx={{ mr: 2 }}
            />
            <InputField
              placeholder="Title"
              name="title"
              // value={filters.title}
              // onChange={handleFilterChange}
              sx={{ mr: 2 }}
            />

            <Button
              // onClick={handleResetGDS}
              sx={{ mr: 16 }}
              variant="outlined"
              color="neutral"
            >
              Reset Filters
            </Button>
          </Box>
          <Button onClick={handleAdd} sx={{ width: "150px", height: "40px" }}>
            {page !== "Add Supplier" ? "Add Customer" : "Add Supplier"}
          </Button>
        </Box>
        <Table aria-label="basic table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Title</th>
              <th>Short Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Designation</th>
              <th>City</th>
              <th>State</th>
              <th>Country</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customersAll?.map((customer, index) => (
              <tr key={index}>
                <td>{customer.code}</td>
                <td>{customer.title}</td>
                <td>{customer.shortName}</td>
                <td>{customer.address1}</td>
                <td>{customer.contact[0]?.phone}</td>
                <td>{customer.contact[0]?.designation}</td>
                <td>{customer.city}</td>
                <td>{customer.state}</td>
                <td>{customer.country}</td>

                <td>
                  <RemoveRedEye
                    sx={{ cursor: "pointer", fontSize: "25px", color: "red" }}
                    onClick={() => handleCustomerDrawer(customer)}
                  />
                  <Edit
                    sx={{
                      cursor: "pointer",
                      fontSize: "25px",
                      color: "grey",
                      marginRight: "10px",
                    }}
                    onClick={() => handleEditCustomer(customer)}
                  />
                  <Delete
                    sx={{ cursor: "pointer", fontSize: "25px", color: "red" }}
                    onClick={() => {
                      if (window.confirm("Are you sure?")) {
                        handleDeleteCustomer(customer._id);
                      }
                    }}
                  />
                </td>
              </tr>
            ))}

            {supplierAll?.map((supplier, index) => (
              <tr key={index}>
                <td>{supplier.code}</td>
                <td>{supplier.title}</td>
                <td>{supplier.shortName}</td>
                <td>{supplier.address1}</td>
                <td>{supplier.contact[0]?.phone}</td>
                <td>{supplier.contact[0]?.designation}</td>
                <td>{supplier.city}</td>
                <td>{supplier.state}</td>
                <td>{supplier.country}</td>

                <td>
                  <RemoveRedEye
                    sx={{ cursor: "pointer", fontSize: "25px", color: "red" }}
                    onClick={() => handleSupplierDrawer(supplier)}
                  />
                  <Edit
                    sx={{
                      cursor: "pointer",
                      fontSize: "25px",
                      color: "grey",
                      mx: "10px",
                    }}
                    onClick={() => handleEditSupplier(supplier)}
                  />
                  <Delete
                    sx={{ cursor: "pointer", fontSize: "25px", color: "red" }}
                    onClick={() => {
                      if (window.confirm("Are you sure?")) {
                        handleDeleteSupplier(supplier._id);
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

                  {value && typeof value === "object" ? (
                    Array.isArray(value) ? (
                      value.length > 0 ? (
                        value.map((item, i) => (
                          <Box key={i}>
                            {Object.entries(item).map(
                              ([subKey, subValue], subIdx) => (
                                <Typography key={subIdx} level="body1">
                                  <strong>{subKey}:</strong>{" "}
                                  {String(subValue) || "N/A"}
                                </Typography>
                              )
                            )}
                          </Box>
                        ))
                      ) : (
                        <Typography level="body1">No Data</Typography>
                      )
                    ) : (
                      Object.entries(value).map(
                        ([subKey, subValue], subIdx) => (
                          <Typography key={subIdx} level="body1">
                            <strong>{subKey}:</strong>{" "}
                            {String(subValue) || "N/A"}
                          </Typography>
                        )
                      )
                    )
                  ) : (
                    <Typography level="body1">
                      {String(value) || "N/A"}
                    </Typography>
                  )}
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
            sx={{ maxWidth: 1200, borderRadius: "md", p: 3, boxShadow: "lg" }}
          >
            <ModalClose variant="plain" sx={{ m: 1 }} />
            <Box>
              <Box
                sx={{
                  display: "flex",
                  gap: "20px",
                  width: "100%",
                  flexWrap: "wrap",
                }}
              >
                <Box
                  sx={{
                    marginTop: "30px",
                    width: "48%",
                    height: "auto",
                    border: "1px solid lightgrey",
                    borderRadius: "15px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      borderBottom: "1px solid lightgrey",
                    }}
                  >
                    <Typography
                      onClick={() => setActiveOption("General Information")}
                      sx={{
                        borderRight: "1px solid lightgrey",
                        p: 1,
                        cursor: "pointer",
                        backgroundColor:
                          activeOption === "General Information"
                            ? "black"
                            : "none",
                        color:
                          activeOption === "General Information"
                            ? "white"
                            : "black",
                      }}
                    >
                      General Information
                    </Typography>
                    <Typography
                      onClick={() => setActiveOption("Address")}
                      sx={{
                        borderRight: "1px solid lightgrey",
                        p: 1,
                        cursor: "pointer",
                        backgroundColor:
                          activeOption === "Address" ? "black" : "none",
                        color: activeOption === "Address" ? "white" : "black",
                      }}
                    >
                      Address
                    </Typography>
                    <Typography
                      onClick={() => setActiveOption("Contact Person")}
                      sx={{
                        borderRight: "1px solid lightgrey",
                        p: 1,
                        cursor: "pointer",
                        backgroundColor:
                          activeOption === "Contact Person" ? "black" : "none",
                        color:
                          activeOption === "Contact Person" ? "white" : "black",
                      }}
                    >
                      Contact Person
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      width: "100%",
                      padding: "8px",
                      gap: "10px",
                    }}
                  >
                    {activeOption === "General Information" && (
                      <>
                        <InputField
                          label="Code"
                          width="250px"
                          onChange={(e) =>
                            handleInputChange("code", e.target.value)
                          }
                          value={
                            page === "Add Supplier" || type === "Edit Supplier"
                              ? supplierData?.code
                              : customerData?.code
                          }
                        />

                        <InputField
                          label="Title"
                          width="250px"
                          onChange={(e) =>
                            handleInputChange("title", e.target.value)
                          }
                          value={
                            page === "Add Supplier" || type === "Edit Supplier"
                              ? supplierData?.title
                              : customerData?.title
                          }
                        />
                        <InputField
                          label="Short Name"
                          width="250px"
                          onChange={(e) =>
                            handleInputChange("shortName", e.target.value)
                          }
                          value={
                            page === "Add Supplier" || type === "Edit Supplier"
                              ? supplierData?.shortName
                              : customerData?.shortName
                          }
                        />
                        <AppTextArea
                          label="Details"
                          width="250px"
                          minRows="4"
                          onChange={(e) =>
                            handleInputChange("details", e.target.value)
                          }
                          value={
                            page === "Add Supplier" || type === "Edit Supplier"
                              ? supplierData?.details
                              : customerData?.details
                          }
                        />
                      </>
                    )}
                    {activeOption === "Address" && (
                      <>
                        <InputField
                          label="Address 1"
                          width="160px"
                          onChange={(e) =>
                            handleInputChange("address1", e.target.value)
                          }
                          value={
                            page === "Add Supplier" || type === "Edit Supplier"
                              ? supplierData?.address1
                              : customerData?.address1
                          }
                        />
                        <InputField
                          label="Address 2"
                          width="160px"
                          onChange={(e) =>
                            handleInputChange("address2", e.target.value)
                          }
                          value={
                            page === "Add Supplier" || type === "Edit Supplier"
                              ? supplierData?.address2
                              : customerData?.address2
                          }
                        />
                        <InputField
                          label="State"
                          width="160px"
                          onChange={(e) =>
                            handleInputChange("state", e.target.value)
                          }
                          value={
                            page === "Add Supplier" || type === "Edit Supplier"
                              ? supplierData?.state
                              : customerData?.state
                          }
                        />
                        <InputField
                          label="Zip/Postal Code"
                          width="160px"
                          onChange={(e) =>
                            handleInputChange("zip", e.target.value)
                          }
                          value={
                            page === "Add Supplier" || type === "Edit Supplier"
                              ? supplierData?.zip
                              : customerData?.zip
                          }
                        />
                        <InputField
                          label="Country"
                          width="160px"
                          onChange={(e) =>
                            handleInputChange("country", e.target.value)
                          }
                          value={
                            page === "Add Supplier" || type === "Edit Supplier"
                              ? supplierData?.country
                              : customerData?.country
                          }
                        />
                        <InputField
                          label="City"
                          width="160px"
                          onChange={(e) =>
                            handleInputChange("city", e.target.value)
                          }
                          value={
                            page === "Add Supplier" || type === "Edit Supplier"
                              ? supplierData?.city
                              : customerData?.city
                          }
                        />
                        <InputField
                          label="Phone 1"
                          width="160px"
                          onChange={(e) =>
                            handleInputChange("phone1", e.target.value)
                          }
                          value={
                            page === "Add Supplier" || type === "Edit Supplier"
                              ? supplierData?.phone1
                              : customerData?.phone1
                          }
                        />
                        <InputField
                          label="Phone 2"
                          width="160px"
                          onChange={(e) =>
                            handleInputChange("phone2", e.target.value)
                          }
                          value={
                            page === "Add Supplier" || type === "Edit Supplier"
                              ? supplierData?.phone2
                              : customerData?.phone2
                          }
                        />
                        <InputField
                          label="Fax"
                          width="160px"
                          onChange={(e) =>
                            handleInputChange("fax", e.target.value)
                          }
                          value={
                            page === "Add Supplier" || type === "Edit Supplier"
                              ? supplierData?.fax
                              : customerData?.fax
                          }
                        />
                      </>
                    )}
                    {activeOption === "Contact Person" && (
                      <Box sx={{ width: "100%" }}>
                        <Box
                          sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <ConatctTable
                            onChange={handleTableChange}
                            type={type}
                            customerData={customerData}
                            supplierData={supplierData}
                          />
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>

                {page !== "Add Supplier" && (
                  <Box sx={{ width: "48%", padding: "8px" }}>
                    <Typography
                      sx={{
                        padding: "3px",
                        backgroundColor: "black",
                        color: "white",
                        borderRadius: "0px 10px",
                      }}
                    >
                      Customer Information
                    </Typography>
                    <Box sx={{ marginTop: "20px" }}>
                      <Box sx={{ display: "flex", gap: "10px" }}>
                        <SearchSelect
                          label="Parent Customer"
                          placeholder="Search"
                          onChange={handleParentCustomerSelection}
                          loadOptions={loadParentCustomerOptions}
                        />
                        <SearchSelect
                          label="Customer Type"
                          onChange={handleCustomerTypeSelection}
                          loadOptions={loadCustomerTypeOptions}
                        />
                      </Box>
                      <Box
                        sx={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                      >
                        <InputField
                          label="Credit Limit"
                          onChange={(e) =>
                            handleInputChange("creditLimit", e.target.value)
                          }
                          sx={{ width: "260px" }}
                          value={
                            page === "Add Supplier" || type === "Edit Supplier"
                              ? supplierData?.creditLimit
                              : customerData?.creditLimit
                          }
                        />
                        <InputField
                          label="Credit Term"
                          placeholder="Search"
                          sx={{ width: "260px" }}
                          onChange={(e) =>
                            handleInputChange("creditTerm", e.target.value)
                          }
                          value={
                            page === "Add Supplier" || type === "Edit Supplier"
                              ? supplierData?.creditTerm
                              : customerData?.creditTerm
                          }
                        />
                        <InputField
                          label="NTN Number"
                          onChange={(e) =>
                            handleInputChange("NTNNumber", e.target.value)
                          }
                          sx={{ width: "260px" }}
                          value={
                            page === "Add Supplier" || type === "Edit Supplier"
                              ? supplierData?.NTNNumber
                              : customerData?.NTNNumber
                          }
                        />
                        <InputField
                          label="Sale Tax Number"
                          onChange={(e) =>
                            handleInputChange("saleTaxNumber", e.target.value)
                          }
                          sx={{ width: "260px" }}
                          value={
                            page === "Add Supplier" || type === "Edit Supplier"
                              ? supplierData?.saleTaxNumber
                              : customerData?.saleTaxNumber
                          }
                        />
                        <InputField
                          label="Date of creation"
                          onChange={(e) =>
                            handleInputChange("dateOfCreation", e.target.value)
                          }
                          sx={{ width: "260px" }}
                          value={
                            page === "Add Supplier" || type === "Edit Supplier"
                              ? supplierData?.dateOfCreation
                              : customerData?.dateOfCreation
                          }
                        />
                        <InputField
                          label="Date of expiry"
                          onChange={(e) =>
                            handleInputChange("dateOfExpiry", e.target.value)
                          }
                          sx={{ width: "260px" }}
                          value={
                            page === "Add Supplier" || type === "Edit Supplier"
                              ? supplierData?.dateOfExpiry
                              : customerData?.dateOfExpiry
                          }
                        />
                        <InputField
                          label="IATA Number"
                          placeholder="Search"
                          onChange={(e) =>
                            handleInputChange("IATANumber", e.target.value)
                          }
                          sx={{ width: "260px" }}
                          value={
                            page === "Add Supplier" || type === "Edit Supplier"
                              ? supplierData?.IATANumber
                              : customerData?.IATANumber
                          }
                        />
                      </Box>
                    </Box>
                  </Box>
                )}

                <Box sx={{ width: "48%", padding: "8px" }}>
                  <Typography
                    sx={{
                      padding: "3px",
                      backgroundColor: "black",
                      color: "white",
                      borderRadius: "0px 10px",
                    }}
                  >
                    Account Information
                  </Typography>
                  <Box sx={{ marginTop: "20px" }}>
                    <InputField
                      label="GL Account"
                      onChange={(e) =>
                        handleInputChange("GLAccount", e.target.value)
                      }
                      sx={{ width: page !== "Add Supplier" ? "250px" : "auto" }}
                      value={
                        page === "Add Supplier" || type === "Edit Supplier"
                          ? supplierData?.GLAccount
                          : customerData?.GLAccount
                      }
                    />
                    {page === "Add Supplier" && (
                      <>
                        <InputField
                          label="Credit Limit"
                          onChange={(e) =>
                            handleInputChange("creditLimit", e.target.value)
                          }
                          value={
                            page === "Add Supplier" || type === "Edit Supplier"
                              ? supplierData?.creditLimit
                              : customerData?.creditLimit
                          }
                        />
                        <InputField
                          label="NTN Number"
                          onChange={(e) =>
                            handleInputChange("NTNNumber", e.target.value)
                          }
                          value={
                            page === "Add Supplier" || type === "Edit Supplier"
                              ? supplierData?.NTNNumber
                              : customerData?.NTNNumber
                          }
                        />
                      </>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        marginTop: "10px",
                      }}
                    >
                      <Checkbox
                        label="Create Auto Ledger Account"
                        onChange={(e) =>
                          handleCheckboxChange(
                            "createAutoLedgerAccount",
                            e.target.checked
                          )
                        }
                        checked={
                          page === "Add Supplier" || type === "Edit Supplier"
                            ? supplierData?.createAutoLedgerAccount
                            : customerData?.createAutoLedgerAccount
                        }
                      />
                      <Checkbox
                        label="Visible To All Branches"
                        onChange={(e) =>
                          handleCheckboxChange(
                            "visibleToAllBranches",
                            e.target.checked
                          )
                        }
                        checked={
                          page === "Add Supplier" || type === "Edit Supplier"
                            ? supplierData?.visibleToAllBranches
                            : customerData?.visibleToAllBranches
                        }
                      />
                      {page === "Add Supplier" ? (
                        <Checkbox
                          label="Add all Vendors"
                          onChange={(e) =>
                            handleCheckboxChange(
                              "addAllVendors",
                              e.target.checked
                            )
                          }
                          checked={
                            page === "Add Supplier" || type === "Edit Supplier"
                              ? supplierData?.addAllVendors
                              : customerData?.addAllVendors
                          }
                        />
                      ) : (
                        <Checkbox
                          label="Hide on Invoices"
                          onChange={(e) =>
                            handleCheckboxChange(
                              "hideOnInvoice",
                              e.target.checked
                            )
                          }
                          checked={
                            page === "Add Supplier" || type === "Edit Supplier"
                              ? supplierData?.hideOnInvoice
                              : customerData?.hideOnInvoice
                          }
                        />
                      )}
                      {page !== "Add Supplier" && (
                        <Button>Import From Excel</Button>
                      )}
                    </Box>
                  </Box>
                </Box>

                {page !== "Add Supplier" && (
                  <Box sx={{ width: "48%", padding: "8px" }}>
                    <Typography
                      sx={{
                        padding: "3px",
                        backgroundColor: "black",
                        color: "white",
                        borderRadius: "0px 10px",
                      }}
                    >
                      SPO
                    </Typography>
                    <Box sx={{ marginTop: "20px" }}>
                      <SearchSelect
                        label="SPO"
                        onChange={handleSPOSelection}
                        loadOptions={loadSPOOptions}
                      />
                    </Box>
                  </Box>
                )}
                {/* <Box
          sx={{
            marginTop: "30px",
            width: "48%",
            height: "auto",
            border: "1px solid lightgrey",
            borderRadius: "15px",
          }}
        >
          <Box sx={{ display: "flex", borderBottom: "1px solid lightgrey" }}>
            <Typography
              onClick={() => setActiveOption1("Airline")}
              sx={{
                borderRight: "1px solid lightgrey",
                p: 1,
                cursor: "pointer",
                backgroundColor: activeOption1 === "Airline" ? "black" : "none",
                color: activeOption1 === "Airline" ? "white" : "black",
              }}
            >
              Airline
            </Typography>
            <Typography
              onClick={() => setActiveOption1("Hotel")}
              sx={{
                borderRight: "1px solid lightgrey",
                p: 1,
                cursor: "pointer",
                backgroundColor: activeOption1 === "Hotel" ? "black" : "none",
                color: activeOption1 === "Hotel" ? "white" : "black",
              }}
            >
              Hotel
            </Typography>
            <Typography
              onClick={() => setActiveOption1("Transport")}
              sx={{
                borderRight: "1px solid lightgrey",
                p: 1,
                cursor: "pointer",
                backgroundColor: activeOption1 === "Transport" ? "black" : "none",
                color: activeOption1 === "Transport" ? "white" : "black",
              }}
            >
              Transport
            </Typography>
            <Typography
              onClick={() => setActiveOption1("Visa Agency")}
              sx={{
                borderRight: "1px solid lightgrey",
                p: 1,
                cursor: "pointer",
                backgroundColor: activeOption1 === "Visa Agency" ? "black" : "none",
                color: activeOption1 === "Visa Agency" ? "white" : "black",
              }}
            >
              Visa Agency
            </Typography>
            <Typography
              onClick={() => setActiveOption1("General")}
              sx={{
                borderRight: "1px solid lightgrey",
                p: 1,
                cursor: "pointer",
                backgroundColor: activeOption1 === "General" ? "black" : "none",
                color: activeOption1 === "General" ? "white" : "black",
              }}
            >
              General
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", width: "100%", padding: "8px", gap: "10px" }}>
            {["Airline", "Hotel", "Transport", "Visa Agency", "General"].includes(activeOption1) && (
              <CustomTable onChange={handleTableChange} />
            )}
          </Box>
        </Box> */}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                {page == "Add Supplier" ? (
                  <Button onClick={() => addEditSupplier(supplierData._id)}>
                    {type == "Edit Supplier" ? "Edit Supplier" : "Add Supplier"}
                  </Button>
                ) : (
                  <Button onClick={() => addEditCustomer(customerData._id)}>
                    {type == "Edit Customer" ? "Edit Customer" : "Add Customer"}
                  </Button>
                )}
              </Box>
            </Box>
          </Sheet>
        </Modal>
      </Box>
    </>
  );
};

export default AddForm;
