import React, { useCallback, useRef, useState } from 'react'
import AppButton from '../../components/common/AppButton';
import InputField from "../../components/common/InputField";
import FormSelect from "../../components/common/FormSelect";
import FormCheckBox from "../../components/common/Checkbox";
import Divider from "@mui/joy/Divider";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Link from "@mui/joy/Link";
import Checkbox from "@mui/joy/Checkbox";
import { useSelector } from 'react-redux';


const TransactionReports = () => {
  const [errors, setErrors] = useState({});
  const flightBookingRef = useRef({});
  const agentData = useSelector((state) => state.user.loginUser);
  const [selected, setSelected] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const agentID = agentData;

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    flightBookingRef.current[name] = value;
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["tripID", "bookingID"];

    requiredFields.forEach((field) => {
      if (!flightBookingRef.current[field]) {
        newErrors[field] = true;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFlightBookingSearch = async () => {
    if (!validateForm()) {
      enqueueSnackbar("Please fill in all required fields.", {
        variant: "error",
      });
      return;
    }

    const body = {
      // agent_ID: agentID
    };

    try {
      const res = await getFlightBooking(body);
      enqueueSnackbar("Flight Search Successful!", { variant: "success" });
      // Reset form or handle any post-submit actions
    } catch (error) {
      console.error("Error searching flight:", error);
      enqueueSnackbar("Error searching flight", { variant: "error" });
    }
  };

  const formFields = [
    {
      component: FormSelect,
      label: "Affiliate",
      name: "affiliate",
      error: errors.affiliate,
      placeholder: "Please enter 3 or more characters",
      width: '500px'
      // size: "large"

    },
    {
      component: InputField,
      label: "Trip ID",
      name: "tripId",
      error: errors.tripId,

    },
    {
      component: InputField,
      label: "Pax First Name",
      name: "paxFirstName",
      error: errors.paxFirstName,
    },
    {
      component: InputField,
      label: "Pax Last Name",
      name: "paxLastName",
      error: errors.paxLastName,
    },
    {
      component: FormSelect,
      label: "Booking Status",
      name: "bookingReferenceNo",
      error: errors.bookingReferenceNo,
    },
    {
      component: FormSelect,
      label: "Validating Airline",
      name: "bookingId",
      error: errors.bookingId,
    },
    {
      component: InputField,
      label: "Ticket Number",
      name: "serviceType",
      error: errors.serviceType,
    },
    {
      component: FormSelect,
      label: "Ticket Status",
      name: "paymentMode",
      error: errors.paymentMode,
    },
    {
      component: InputField,
      label: "Supplier PNR",
      name: "bookingStatus",
      error: errors.bookingStatus,
    },
    {
      component: InputField,
      label: "Airline PNR",
      name: "dateType",
      error: errors.dateType,
    },
    {
      component: FormSelect,
      label: "Date Type",
      name: "startDate",
      error: errors.startDate,
      placeholder: "Select Date",

    },
    {
      component: InputField,
      label: "From Date",
      name: "endDate",
      error: errors.endDate,
      placeholder: "Select Date",

    },
    {
      component: FormSelect,
      label: "To Date",
      name: "ticketVoucherStatus",
      error: errors.ticketVoucherStatus,
    },


  ];

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {formFields.map(
          ({ component: Field, label, name, error, placeholder, width }, index) => (
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
                width={width}
                onChange={handleInputChange}
                error={error}
                placeholder={placeholder}
              />

            </Box>

          )
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: 'space-around',
          gap: 0,
          mt: 3,
        }}
      >
        <FormCheckBox label="Is Ticketed" />
        <FormCheckBox label="Is Pay At Affiliate" />
        <FormCheckBox label="Is Promo Code" />


      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mt: 3,
        }}
      >
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
          onClick={handleFlightBookingSearch}
        />
      </Box>
      {console.log(flightBookingRef)}

      <Divider sx={{ mt: 3 }} />

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
                    selected.length > 0 && selected.length !== agencies.length
                  }
                  checked={selected.length === agencies.length}
                  onChange={(event) =>
                    setSelected(
                      event.target.checked ? agencies.map((row) => row.id) : []
                    )
                  }
                />
              </th>
              <th>Trip ID</th>
              <th>
                <Link
                  underline="none"
                  color="primary"
                  onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                >
                  Booking ID
                </Link>
              </th>
              <th style={{ width: "15%" }}>Booking Date & Time (UTC)</th>
              <th >Action Type</th>
              <th>Booking Status</th>
              <th>Pax Type</th>
              <th>Title</th>
              <th style={{ width: "12%" }}>Pax First Middle Name</th>
              <th>Pax Last Name</th>

              <th />
            </tr>
          </thead>
          {agencies.length > 0 && (
            <tbody>
              {stableSort(agencies, getComparator(order, "userName"))?.map(
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
                              : selected.filter((name) => name !== row.userName)
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
    </div>
  )
}

export default TransactionReports