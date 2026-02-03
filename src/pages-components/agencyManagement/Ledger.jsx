import axios from "axios";
import React, { useEffect, useState } from "react";
import { agentLedger, getAgencyById, getAllLedger } from "../../server/api";
import { useSelector } from "react-redux";
import {
  Box,
  Table,
  CircularProgress,
  Typography,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  ToggleButtonGroup,
  Select,
  Option
} from "@mui/joy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { formatDate } from "../../components/utils";
import { motion } from "framer-motion";
import LedgerModal from "../../components/modals/LedgerModal";
import moment from "moment"

const Ledger = () => {
  const [cashLimit, setCashLimit] = useState(null)
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [agencyNameOption, setAgencyNameOption] = useState(null)
  const [supplierData, setSupplierData] = useState(null);
  const [incomeData, setIncomeData] = useState(null);
  const userData = useSelector((state) => state.user.loginUser);
  const hi = useSelector((state) => state.user);
  const [value, setValue] = React.useState('customer');
  const [id, setId] = useState();
  const [viewOption, setViewOption] = useState('supplier')

  console.log(agencyNameOption)

  const [openModal, setOpenModal] = useState(false)

  const fetchAgency = async () => {
    if (!userData?.agency_id) return;
    const agencyData = await getAgencyById(userData?.agency_id);

    if (agencyData?.status === "success") {
      setAgencyNameOption(agencyData?.result?.agencyName)
      setCashLimit(agencyData?.result?.cashLimit)
    }
  }

  useEffect(() => {
    if (userData?.role === "agency") {
      setId(userData.agency_id);
    } else {
      setId(userData.id);
    }
    fetchAgency()
  }, [userData]);

  useEffect(() => {
    if (id) {
      getTicketsData();
    }
  }, [id]);


  const getTicketsData = async () => {
    setLoading(true);
    setError(null);
    if (userData.role === "super_admin") {
      try {
        const response = await agentLedger();
        const res = await getAllLedger();
        setIncomeData(res?.result?.incomeStatements);
        setSupplierData(res?.result?.supplierLedgers)
        setAllData(response.result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const response = await agentLedger(id);
        const res = await getAllLedger();
        setIncomeData(res?.result?.incomeStatements);
        setSupplierData(res?.result?.supplierLedgers)
        setAllData(response.result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Group data by agency
  const groupedData = allData.reduce((acc, row) => {
    const agencyName = row.agencyId?.agencyName || "Unknown Agency";
    if (!acc[agencyName]) {
      acc[agencyName] = { bookings: [], totalSales: 0 };
    }
    acc[agencyName].bookings.push(row);
    acc[agencyName].totalSales += row.finalPrice || 0;
    return acc;
  }, {});

  // // Group data by Agency and calculate total sales for the agency
  // const groupedDataForSuperAdmin = allData.reduce((acc, row) => {
  //   const agencyName = row.agencyId?.agencyName || "Unknown Agency";  // Get agency name
  //   if (!acc[agencyName]) {
  //     acc[agencyName] = {
  //       totalSales: 0, // Total sales for the agency
  //       agents: {} // Object to hold agents under this agency
  //     };
  //   }

  //   // Sum up the total sales for this agency
  //   acc[agencyName].totalSales += row.finalPrice || 0;

  //   // Group data by Agent
  //   const agentId = row.userId?._id;  // Agent's ID
  //   const agentName = row.userId?.firstName;  // Agent's Name

  //   if (!acc[agencyName].agents[agentId]) {
  //     acc[agencyName].agents[agentId] = {
  //       agentName: agentName,
  //       agentId: agentId,
  //       totalSales: 0, // Total sales for the agent
  //       bookings: [] // Array to store bookings for this agent
  //     };
  //   }

  //   // Add the booking to the agent's list and add to the total sales
  //   acc[agencyName].agents[agentId].bookings.push(row);
  //   acc[agencyName].agents[agentId].totalSales += row.finalPrice || 0;

  //   return acc;
  // }, {});

  function groupedDataForSuperAdmin(allData) {
    const groupedData = {};

    allData.forEach((dataItem) => {
      const agencyName = dataItem.agencyId?.agencyName || userData?.role === "agency" ? agencyNameOption : 'N/A';
      const agentId = dataItem.userId?._id;
      const agentName = dataItem.userId?.firstName;


      if (!agencyName) return; // Skip if agency name is missing

      // Initialize the agency in the groupedData object if it doesn't exist
      if (!groupedData[agencyName]) {
        groupedData[agencyName] = {
          totalSales: 0,
          agents: {},
          totalBookings: 0,
          spoms: {},
        };
      }

      // Accumulate total sales and bookings at the agency level
      groupedData[agencyName].totalSales += dataItem.finalPrice || 0;
      groupedData[agencyName].totalBookings += 1;

      // Check if the agent is assigned to an SPO
      const spoId = dataItem.userId?.assignedSPO?._id;
      const spoName = dataItem.userId?.assignedSPO?.firstName;

      if (spoId && spoName) {
        // Initialize SPO if it doesn't exist
        if (!groupedData[agencyName].spoms[spoId]) {
          groupedData[agencyName].spoms[spoId] = {
            spoName,
            totalSales: 0,
            totalBookings: 0,
            teamMembers: [],
          };
        }

        // Now assign data for team members under each SPO
        groupedData[agencyName].spoms[spoId].totalSales += dataItem.finalPrice || 0;
        groupedData[agencyName].spoms[spoId].totalBookings += 1;

        // Add agent's data under the respective SPO's team
        groupedData[agencyName].spoms[spoId].teamMembers.push({
          agentId,
          agentName,
          totalSales: dataItem.finalPrice || 0,
          totalBookings: 1,
        })
      }
    });

    return groupedData;
  }

  function groupedDataForSupplier(allData) {
    const groupedData = {};

    allData.forEach((dataItem) => {
      const agencyName = dataItem.agencyId?.agencyName || userData?.role === "agency" ? agencyNameOption : 'N/A';
      const agentId = dataItem.userId?._id;
      const agentName = dataItem.userId?.firstName;
      const supplierName = dataItem?.supplierName;
      const payMode = dataItem?.payMode;
      const totalAmounts = dataItem?.amount ? parseInt(dataItem?.amount) : 0;
      const type = dataItem?.type || 'N/A';
      const createdAt = dataItem?.createdAt



      if (!supplierName) return; // Skip if agency name is missing

      // Initialize the agency in the groupedData object if it doesn't exist
      if (!groupedData[supplierName]) {
        groupedData[supplierName] = {
          totalSales: 0,
          detail: [],
        };
      }

      // Accumulate total sales and bookings at the agency level
      groupedData[supplierName].totalSales += dataItem.amount ? parseInt(dataItem.amount) : 0;

      console.log(dataItem)

      if (agencyName) {
        groupedData[supplierName].detail.push({
          agencyName,
          totalAmounts,
          payMode,
          type,
          createdAt
        });

        // Now assign data for team members under each SPO
        // groupedData[supplierName].agency[agencyName].totalSales += dataItem.amount ? parseInt(dataItem.amount) : 0;

        // // Add agent's data under the respective SPO's team
        // groupedData[supplierName].spoms[spoId].teamMembers.push({
        //   agentId,
        //   agentName,
        //   totalSales: dataItem.finalPrice || 0,
        //   totalBookings: 1,
        // })
      }
    });

    return groupedData;
  }

  const handleChange = (event, newValue) => {
    setViewOption(newValue)
  };

  console.log(groupedDataForSupplier(supplierData ? supplierData : []))

  return (
    <Box sx={{ margin: 3, overflowX: "auto" }}>
      {loading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && ["super_admin", "agency"].includes(userData?.role) && (
        <ToggleButtonGroup
          variant="outlined"
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          sx={{ mb: 2 }}
        >
          <Button value="customer" sx={{ fontSize: '15px' }}>Customer Sheet</Button>
          <Button value="supplier" sx={{ fontSize: '15px' }}>Supplier Sheet</Button>
          <Button value="income" sx={{ fontSize: '15px' }}>Income Statement</Button>
        </ToggleButtonGroup>
      )}

      {!loading && !error && userData?.role === "super_admin" && value === "customer" && (
        <>
          {Object.entries(groupedDataForSuperAdmin(allData)).map(([agencyName, data], index) => (
            <motion.div
              key={agencyName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Accordion
                sx={{
                  mb: 2,
                  borderRadius: "12px",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                  background: 'lightgrey'
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      m: 4
                    }}
                  >
                    <Typography fontWeight="bold">{agencyName}</Typography>
                    <Typography fontWeight="bold">
                      Initial Credit:  N/A
                    </Typography>
                    <Typography fontWeight="bold">
                      Remaining Credit: N/A
                    </Typography>
                    <Typography fontWeight="bold">
                      Total Sales: RS. {data.totalSales}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Table
                    aria-labelledby="tableTitle"
                    sx={{
                      minWidth: "100%",
                      borderCollapse: "collapse",
                      backgroundColor: "#f4f4f4",
                      "& th, & td": {
                        padding: "12px",
                        textAlign: "center",
                      },
                      "& th": {
                        backgroundColor: "#f4f4f4",
                        fontWeight: "bold",
                        borderBottom: "2px solid #ddd",
                      },
                      "& tr:nth-of-type(even)": {
                        backgroundColor: "#fafafa",
                      },
                    }}
                  >
                    <thead>
                      <tr>
                        <th>SPO Name</th>
                        <th>Team Agents</th>
                        <th>Total Sales</th>
                        <th>Bookings</th>
                      </tr>
                    </thead>
                    <motion.tbody
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: { staggerChildren: 0.1 },
                        },
                      }}
                    >
                      {Object.entries(data.spoms).map(([agentId, agentData], index) => (
                        <motion.tr
                          key={agentId}
                          variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0 },
                          }}
                          transition={{ duration: 0.3 }}

                        >
                          <td style={{
                            color: 'blue', cursor: 'pointer', ":hover": {
                              color: "red"
                            }
                          }} onClick={() => setOpenModal({ value: true, agentName: agentData.spoName, data: allData?.filter(item => item?.userId?.assignedSPO?._id === agentId) })}>{agentData.spoName}</td> {/* Agent's Name */}
                          <td>
                            {[...new Set(agentData.teamMembers?.map(item => item?.agentId))].map((uniqueAgentId, index) => {
                              const uniqueAgent = agentData.teamMembers?.find(item => item?.agentId === uniqueAgentId);
                              return (
                                <span
                                  key={index}
                                  style={{ cursor: 'pointer', color: 'blue' }}
                                  onClick={() => setOpenModal({
                                    value: true,
                                    agentName: uniqueAgent?.agentName,
                                    data: allData?.filter(dataItem => dataItem?.userId?._id === uniqueAgent?.agentId)
                                  })}
                                >
                                  {uniqueAgent?.agentName}
                                  {index < agentData.teamMembers?.length - 1 && <br />}
                                </span>
                              );
                            })}

                          </td>
                          {/* Agent's ID */}
                          <td>RS. {agentData.totalSales}</td> {/* Total Sales for this agent */}
                          <td>
                            {agentData.totalBookings} {/* Number of bookings for this agent */}
                          </td>
                        </motion.tr>
                      ))}
                    </motion.tbody>
                  </Table>
                </AccordionDetails>
              </Accordion>
            </motion.div>
          ))}

        </>
      )}{" "}

      {!loading && value === "supplier" && ["super_admin", "agency"].includes(userData?.role) && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 2 }}>
            <Typography sx={{ mr: 1, color: 'grey' }} level="body-md" >Display as:</Typography>
            <Select defaultValue="supplier" onChange={handleChange}>
              <Option value="supplier">Supplier View</Option>
              <Option value="table">Table View</Option>
            </Select>
          </Box>

          {viewOption === "supplier" ? (
            supplierData?.length !== 0 ? Object.entries(groupedDataForSupplier(supplierData ? supplierData : [])).map(([supplierName, data], index) => (
              <motion.div
                key={supplierName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Accordion
                  sx={{
                    mb: 2,
                    borderRadius: "12px",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                    background: 'lightgrey'
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        m: 4
                      }}
                    >
                      <Typography fontWeight="bold">{supplierName}</Typography>
                      <Typography fontWeight="bold">
                        Total Amount: RS. {data.totalSales}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Table
                      aria-labelledby="tableTitle"
                      sx={{
                        minWidth: "100%",
                        borderCollapse: "collapse",
                        backgroundColor: "#f4f4f4",
                        "& th, & td": {
                          padding: "12px",
                          textAlign: "center",
                        },
                        "& th": {
                          backgroundColor: "#f4f4f4",
                          fontWeight: "bold",
                          borderBottom: "2px solid #ddd",
                        },
                        "& tr:nth-of-type(even)": {
                          backgroundColor: "#fafafa",
                        },
                      }}
                    >
                      <thead>
                        <tr>
                          <th>Agency Name</th>
                          <th>Amount</th>
                          <th>Pay Mode</th>
                          <th>Type</th>
                          <th>Created At</th>
                        </tr>
                      </thead>
                      <motion.tbody
                        initial="hidden"
                        animate="visible"
                        variants={{
                          hidden: { opacity: 0 },
                          visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 },
                          },
                        }}
                      >
                        {data?.detail?.map((item, index) => (
                          <motion.tr
                            key={index}
                            variants={{
                              hidden: { opacity: 0, y: 10 },
                              visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.3 }}

                          >
                            <td style={{ color: 'blue' }}>{item?.agencyName}</td> {/* Supplier Name */}
                            <td>{Number(item?.totalAmounts) ? `Rs. ${item?.totalAmounts}` : 'N/A'}</td> {/* Amount */}
                            <td>{item?.payMode}</td> {/* Pay Mode */}
                            <td style={{ textTransform: "capitalize" }}>{item?.type}</td> {/* Type */}
                            <td>{moment(item?.createdAt).format('YYYY-MM-DD')}</td> {/* Created At */}
                          </motion.tr>
                        ))}
                      </motion.tbody>
                    </Table>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            )) : <h3>No Data Found!</h3>
          ) : (
            <Table
              aria-labelledby="tableTitle"
              sx={{
                minWidth: "100%",
                borderCollapse: "collapse",
                backgroundColor: "#f4f4f4",
                "& th, & td": {
                  padding: "12px",
                  textAlign: "center",
                },
                "& th": {
                  backgroundColor: "#f4f4f4",
                  fontWeight: "bold",
                  borderBottom: "2px solid #ddd",
                },
                "& tr:nth-of-type(even)": {
                  backgroundColor: "#fafafa",
                },
              }}
            >
              <thead>
                <tr>
                  <th>Supplier Name</th>
                  <th>Amount</th>
                  <th>Pay Mode</th>
                  <th>Type</th>
                  <th>Created At</th>
                </tr>
              </thead>
              {supplierData?.map((item, index) => (
                <tr key={index}>
                  <td >{item?.supplierName}</td> {/* Supplier Name */}
                  <td>{Number(item?.amount) ? `RS. ${item?.amount}` : 'N/A'}</td> {/* Amount */}
                  <td>{item?.payMode}</td> {/* Pay Mode */}
                  <td style={{ textTransform: "capitalize" }}>{item?.type}</td> {/* Type */}
                  <td>{moment(item?.createdAt).format('YYYY-MM-DD')}</td> {/* Created At */}
                </tr>
              ))}
            </Table>
          )}

          <h4 style={{ textAlign: 'end' }}>Grand Total: RS. {supplierData?.reduce((sum, current) => {
            if (current.amount) {
              return sum + Number(current.amount); // Convert string to number and add to sum
            }
            return sum;
          }, 0)}</h4>
        </>
      )}

      {console.log(incomeData)}

      {!loading && value === "income" && ["super_admin", "agency"].includes(userData?.role) && (
        <>
          {incomeData?.length !== 0 ? (
            <Table
              aria-labelledby="tableTitle"
              sx={{
                minWidth: "100%",
                borderCollapse: "collapse",
                backgroundColor: "#f4f4f4",
                "& th, & td": {
                  padding: "12px",
                  textAlign: "center",
                },
                "& th": {
                  backgroundColor: "#f4f4f4",
                  fontWeight: "bold",
                  borderBottom: "2px solid #ddd",
                },
                "& tr:nth-of-type(even)": {
                  backgroundColor: "#fafafa",
                },
                // "& td:hover": {
                //   color: "red", // Hover effect on table data
                //   cursor: "pointer",
                // }
              }}
            >
              <thead>
                <tr>
                  <th>SPO</th>
                  <th>Amount</th>
                  <th>Supplier Name</th>
                  <th>Ticket No.</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {incomeData?.map((item, index) => (
                  <tr key={index}>
                    <td >{item?.spo?.firstName ? item?.spo?.firstName : 'N/A'}</td> {/* Supplier Name */}
                    <td>{Number(item?.amount) ? `RS. ${item?.amount}` : 'N/A'}</td> {/* Amount */}
                    <td>{item?.supplierLedger?.supplierName || 'N/A'}</td> {/* Pay Mode */}
                    <td >{item?.customerLedger?.ticketNumber || 'N/A'}</td> {/* Type */}
                    <td>{moment(item?.createdAt).format('YYYY-MM-DD')}</td> {/* Created At */}
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : <h3>No Data Found!</h3>}

          <h4 style={{ textAlign: 'end' }}>
            Grand Total: RS. {incomeData?.reduce((sum, current) => {
              const amount = Number(current.amount);
              // Check if amount is a valid number (not NaN or invalid strings like 'NaN')
              if (!isNaN(amount) && amount > 0) {
                return sum + amount;
              }
              return sum; // Skip invalid or zero amounts
            }, 0)}
          </h4>
        </>
      )}

      {!loading &&
        !error &&
        (userData?.role === "sale" || userData?.role === "SPO" || userData?.role === "agency") && value === "customer" && (
          <>
            {Object.entries(groupedDataForSuperAdmin(allData)).map(([agencyName, data], index) => (
              <motion.div
                key={agencyName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Accordion
                  sx={{
                    mb: 2,
                    borderRadius: "12px",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                    background: 'lightgrey'
                  }}
                  expanded={true}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        m: 4
                      }}
                    >
                      <Typography fontWeight="bold">{agencyName}</Typography>
                      <Typography fontWeight="bold">
                        Initial Credit:  RS. {Number(cashLimit) + Number(data.totalSales)}
                      </Typography>
                      <Typography fontWeight="bold">
                        Remaining Credit: RS. {cashLimit}
                      </Typography>
                      <Typography fontWeight="bold">
                        Total Sales: RS. {data.totalSales}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Table
                      aria-labelledby="tableTitle"
                      sx={{
                        minWidth: "100%",
                        borderCollapse: "collapse",
                        backgroundColor: "#f4f4f4",
                        "& th, & td": {
                          padding: "12px",
                          textAlign: "center",
                        },
                        "& th": {
                          backgroundColor: "#f4f4f4",
                          fontWeight: "bold",
                          borderBottom: "2px solid #ddd",
                        },
                        "& tr:nth-of-type(even)": {
                          backgroundColor: "#fafafa",
                        },
                      }}
                    >
                      <thead>
                        <tr>
                          <th>SPO Name</th>
                          <th>Team Agents</th>
                          <th>Total Sales</th>
                          <th>Bookings</th>
                        </tr>
                      </thead>
                      <motion.tbody
                        initial="hidden"
                        animate="visible"
                        variants={{
                          hidden: { opacity: 0 },
                          visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 },
                          },
                        }}
                      >
                        {Object.entries(data.spoms).map(([agentId, agentData], index) => (
                          <motion.tr
                            key={agentId}
                            variants={{
                              hidden: { opacity: 0, y: 10 },
                              visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.3 }}

                          >
                            <td style={{
                              color: 'blue', cursor: 'pointer', ":hover": {
                                color: "red"
                              }
                            }} onClick={() => setOpenModal({ value: true, agentName: agentData.spoName, data: allData?.filter(item => item?.userId?.assignedSPO?._id === agentId) })}>{agentData.spoName}</td> {/* Agent's Name */}
                            <td>
                              {[...new Set(agentData.teamMembers?.map(item => item?.agentId))].map((uniqueAgentId, index) => {
                                const uniqueAgent = agentData.teamMembers?.find(item => item?.agentId === uniqueAgentId);
                                return (
                                  <span
                                    key={index}
                                    style={{ cursor: 'pointer', color: 'blue' }}
                                    onClick={() => setOpenModal({
                                      value: true,
                                      agentName: uniqueAgent?.agentName,
                                      data: allData?.filter(dataItem => dataItem?.userId?._id === uniqueAgent?.agentId)
                                    })}
                                  >
                                    {uniqueAgent?.agentName}
                                    {index < agentData.teamMembers?.length - 1 && <br />}
                                  </span>
                                );
                              })}

                            </td>
                            {/* Agent's ID */}
                            <td>RS. {agentData.totalSales}</td> {/* Total Sales for this agent */}
                            <td>
                              {agentData.totalBookings} {/* Number of bookings for this agent */}
                            </td>
                          </motion.tr>
                        ))}
                      </motion.tbody>
                    </Table>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            ))}
          </>
        )}

      {openModal?.value && (
        <LedgerModal {...{ open: openModal, setOpen: setOpenModal, agentName: openModal?.agentName, data: openModal?.data }} />
      )}

    </Box>
  );
};

export default Ledger;
