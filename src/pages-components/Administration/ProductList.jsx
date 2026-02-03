import React, { useRef, useCallback, useState } from "react";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import AppButton from "../../components/common/AppButton";
import TextHeading from "../../components/common/TextHeading";
import InputField from "../../components/common/InputField";
import FormSelect from "../../components/common/FormSelect";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Link from "@mui/joy/Link";
import Checkbox from "@mui/joy/Checkbox";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import IconButton, { iconButtonClasses } from "@mui/joy/IconButton";

const ProductList = () => {
  const flightBookingRef = useRef({});
  const [selected, setSelected] = useState([]);
  const [productList, setProductList] = useState([]);
  const [errors, setErrors] = useState({});

  const formFields = [
    {
      component: FormSelect,
      label: "Product Type",
      name: "productType",
      error: errors.productType,
    },
    {
      component: InputField,
      label: "Product Name",
      name: "productName",
      error: errors.productName,
    },
    {
      component: FormSelect,
      label: "Affiliate",
      name: "affiliate",
      error: errors.affiliate,
      placeholder: "Please enter 3 or more characters",
    },
  ];

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    flightBookingRef.current[name] = value;
  }, []);

  //   const validateForm = () => {
  //     const newErrors = {};
  //     const requiredFields = ["tripID", "bookingID"];

  //     requiredFields.forEach((field) => {
  //       if (!flightBookingRef.current[field]) {
  //         newErrors[field] = true;
  //       }
  //     });

  //     setErrors(newErrors);
  //     return Object.keys(newErrors).length === 0;
  //   };

  //   const handleFlightBookingSearch = async () => {
  //     if (!validateForm()) {
  //       enqueueSnackbar("Please fill in all required fields.", {
  //         variant: "error",
  //       });
  //       return;
  //     }

  //     const body = {
  //       // agent_ID: agentID
  //     };

  //     try {
  //       const res = await getFlightBooking(body);
  //       enqueueSnackbar("Flight Search Successful!", { variant: "success" });
  //       // Reset form or handle any post-submit actions
  //     } catch (error) {
  //       console.error("Error searching flight:", error);
  //       enqueueSnackbar("Error searching flight", { variant: "error" });
  //     }
  //   };

  return (
    <>
      <Box px={2} mt={5}>
        <Box display="flex" justifyContent="space-between">
          <TextHeading text="Search Product Master" level="h4" />
          <AppButton
            text="Add Product"
            variant="solid"
            color="#fff"
            bgColor="#185ea5"
          // onClick={handleFlightBookingSearch}
          />
        </Box>

        <Divider sx={{ mt: 3 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            mt: 3,
          }}
        >
          {formFields.map(
            ({ component: Field, label, name, error, placeholder }, index) => (
              <Box
                key={index}
                sx={{
                  flexBasis: "calc(33.333% - 16px)",
                  flexGrow: 0,
                  flexShrink: 0,
                }}
              >
                <Field
                  label={label}
                  name={name}
                  fullWidth
                  onChange={handleInputChange}
                  error={error}
                  placeholder={placeholder}
                />
              </Box>
            )
          )}
        </Box>

        <Box display="flex" justifyContent="space-between" mt={3}>
          <Box display="flex" gap={1}>
            <AppButton
              text="Reset"
              variant="outlined"
              color="#185ea5"
              bgColor="#185ea5"
            />
            <AppButton
              text="Search"
              variant="solid"
              color="#fff"
              bgColor="#185ea5"
            />
          </Box>
          <Box display="flex" gap={1}>
            <AppButton
              text="Save Priority"
              variant="solid"
              color="#fff"
              bgColor="#185ea5"
            />
            <AppButton
              text="Save Sequence"
              variant="solid"
              color="#fff"
              bgColor="#185ea5"
            />
          </Box>
        </Box>

        <Divider sx={{ mt: 3 }} />

        <Box display="flex" justifyContent="space-between" mt={3}>
          <Box display="flex" gap={1}>
            <AppButton
              text="CSV"
              variant="outlined"
              color="#185ea5"
              bgColor="#185ea5"
            />
            <AppButton
              text="Excel"
              variant="outlined"
              color="#185ea5"
              bgColor="#185ea5"
            />
            <AppButton
              text="PDF"
              variant="outlined"
              color="#185ea5"
              bgColor="#185ea5"
            />
          </Box>
          <Box display="flex" gap={1}>
            <InputField placeholder="Search" size="sm" width="300px" />
          </Box>
        </Box>

        <Sheet
          className="OrderTableContainer"
          variant="outlined"
          sx={{
            display: { xs: "none", sm: "initial" },
            width: "100%",
            borderRadius: "sm",
            flexShrink: 1,
            overflow: "auto",
            minHeight: 0,
          }}
        >
          <Table
            aria-labelledby="tableTitle"
            // stickyHeader
            hoverRow
            sx={{
              "--TableCell-headBackground":
                "var(--joy-palette-background-level1)",
              "--Table-headerUnderlineThickness": "1px",
              "--TableRow-hoverBackground":
                "var(--joy-palette-background-level1)",
              "--TableCell-paddingY": "4px",
              "--TableCell-paddingX": "8px",
            }}
          >
            <thead>
              <tr>
                <th>
                  <Checkbox
                    size="sm"
                    indeterminate={
                      selected.length > 0 && selected.length !== productList.length
                    }
                    checked={selected.length === productList.length}
                    onChange={(event) =>
                      setSelected(
                        event.target.checked
                          ? productList.map((row) => row.id)
                          : []
                      )
                    }
                  />
                </th>
                <th>Product ID</th>
                <th>
                  <Link
                    underline="none"
                    color="primary"
                    onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                  >
                    Product Name
                  </Link>
                </th>
                <th>Priority</th>
                <th style={{ width: "12%" }}>Sequence</th>
                <th>Product Type</th>
                <th>Product Category</th>
                <th>Updated By</th>
                <th>Updated On</th>
                <th>Status</th>
                <th>Action</th>
                <th />
              </tr>
            </thead>
            {productList.length > 0 && (
              <tbody>
                {stableSort(productList, getComparator(order, "userName"))?.map(
                  (row) => (
                    <tr key={row.agencyName}>
                      <td>
                        <Checkbox
                          size="sm"
                          checked={selected.includes(row.userName)}
                          onChange={(event) =>
                            setSelected(
                              event.target.checked
                                ? [...selected, row.userName]
                                : selected.filter(
                                  (name) => name !== row.userName
                                )
                            )
                          }
                        />
                      </td>
                      <td>{row.personName}</td>
                      <td>Active</td>
                      <td>{row?.availableLimit}</td>
                      <td>{row.country}</td>
                      <td>{row.groupArCode}</td>
                      <td>{row.agencyType}</td>
                      <td>{row.arCode}</td>
                      <td>
                        <RowMenu />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            )}
          </Table>
        </Sheet>

        <Box
          className="Pagination-laptopUp"
          sx={{ pt: 2, display: { xs: "none", md: "flex" } }}
        >
          <AppButton
            size="sm"
            width="120px"
            text="Previous"
            variant="outlined"
            color="#185ea5"
            bgColor="#185ea5"
            startDecorator={<KeyboardArrowLeftIcon />}
          />

          <Box sx={{ flex: 1 }} />

          <Box display="flex" gap={1}>
            {["1", "2", "3", "…", "8", "9", "10"].map((page) => (
              <IconButton
                key={page}
                size="sm"
                variant={Number(page) ? "outlined" : "plain"}
                sx={{
                  color: "#185ea5",
                  borderColor: "#185ea5",
                  borderWidth: 1,
                  "&:hover": {
                    backgroundColor: "#185ea5",
                    color: "#ffffff",
                    borderColor: "#185ea5",
                  },
                  backgroundColor: "transparent",
                }}
              >
                {page}
              </IconButton>
            ))}
          </Box>

          <Box sx={{ flex: 1 }} />
          <AppButton
            size="sm"
            width="120px"
            text="Next"
            variant="outlined"
            color="#185ea5"
            bgColor="#185ea5"
            endDecorator={<KeyboardArrowRightIcon />}
          />
        </Box>
      </Box>
    </>
  );
};

export default ProductList;
