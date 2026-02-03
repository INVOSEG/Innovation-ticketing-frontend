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

const CommandBuilder = () => {
  const flightBookingRef = useRef({});
  const [selected, setSelected] = useState([]);
  const [commandBuilder, setCommandBuilder] = useState([]);
  const [errors, setErrors] = useState({});

  const formFields = [
    {
      component: InputField,
      label: "Rule Name",
      name: "ruleName",
      error: errors.ruleName,
    },
    {
      component: FormSelect,
      label: "Company",
      name: "company",
      error: errors.company,
    },
    {
      component: FormSelect,
      label: "Branch",
      name: "branch",
      error: errors.branch,
    },
    {
      component: FormSelect,
      label: "Agent Category",
      name: "agentCategory",
      error: errors.agentCategory,
    },
    {
      component: FormSelect,
      label: "Affiliate Type",
      name: "affiliateType",
      error: errors.affiliateType,
    },
    {
      component: FormSelect,
      label: "Affiliate",
      name: "affiliate",
      error: errors.affiliate,
      placeholder: "Please enter 3 or more characters",
    },
  ];

  //   const validateForm = () => {

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    flightBookingRef.current[name] = value;
  }, []);

  return (
    <>
      <Box display="flex" flexDirection="column" gap={3} px={2} mt={5}>
        <Box display="flex" justifyContent="space-between">
          <TextHeading text="Command Builder" level="h4" />
          <AppButton
            text="Add Command Builder Rule"
            variant="solid"
            color="#fff"
            bgColor="#185ea5"
          // onClick={handleFlightBookingSearch}
          />
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
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
          </Box>
        </Box>
        <Divider />
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
                      selected.length > 0 &&
                      selected.length !== commandBuilder.length
                    }
                    checked={selected.length === commandBuilder.length}
                    onChange={(event) =>
                      setSelected(
                        event.target.checked
                          ? commandBuilder.map((row) => row.id)
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
            {commandBuilder.length > 0 && (
              <tbody>
                {stableSort(commandBuilder, getComparator(order, "userName"))?.map(
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

export default CommandBuilder;
