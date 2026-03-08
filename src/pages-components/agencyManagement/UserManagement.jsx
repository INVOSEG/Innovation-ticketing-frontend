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
import InputField from "../../components/common/InputField";
import {
  addAgencyUser,
  getTravelAgency,
  getAgencyUsers,
  getAgencyUserRoles,
  updateAgencyUserStatus,
  getAgencyAllUsers,
  searchAgencySatff,
  searchAgencySatffAdmin,
  updateStaffUser,
  updateAgencyStaff,
  getAllSPOStaff,
  deleteStaffUser,
} from "../../server/api";
import AppButton from "../../components/common/AppButton";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/reducer/loaderSlice";
import { passwordRegex } from "../../components/utils";
import AddAgencyUserModal from "../../components/modals/AddAgencyStaff";
import EditAgencyStaffModal from "../../components/modals/EditAgencyStaff";
import { Checkbox, Tooltip } from "@mui/joy";
import AddCardIcon from '@mui/icons-material/AddCard';
import AddTopupModal from "../../components/modals/AddTopupModal";
import EditIcon from '@mui/icons-material/Edit';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import DeleteIcon from '@mui/icons-material/Delete';
import { City } from "country-state-city";



const CONSULTANTS = [
  "ABDUL GHAFFAR",
  "FARRUKH KHAN",
  "MIRZA ZEESHAN BAIG",
  "MOHAMMAD ASIF",
  "SABA NISAR BUTT",
  "SAJID QAMAR",
  "SAMI UR REHMAN",
  "SHAHID HAMEED",
  "SHOAIB MEHMOOD",
  "TAHIR IQBAL CH",
  "WAQAS ALI"
];

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

export default function UserManagement() {
  const [userManagement, setUserManagement] = useState({});
  const [order, setOrder] = useState("desc");
  const [agencies, setAgencies] = useState([]);
  const [open, setOpen] = useState(false);
  const [usersRoles, setUsersRoles] = useState([]);
  const [allSPOStaff, setAllSPOStaff] = useState([]);
  const [editStaff, setEditStaff] = useState(null); // state tUserManagemento store the staff being edited
  const [openEditModal, setOpenEditModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.loginUser);
  const searchStaffRef = useRef({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allAgencies, setAllAgencies] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [openTopup, setOpenTopup] = useState(false);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const pkCities = City.getCitiesOfCountry("PK").map(city => city.name);
    setCities(pkCities);
  }, []);

  const fetchAgencyUserRoles = async () => {
    try {
      const res = await getAgencyUserRoles();
      if (res.result.length > 0) {
        setUsersRoles(res.result?.map(item => ({ ...item, name: item.name.charAt(0).toUpperCase() + item.name.slice(1) })));
      }
    } catch (error) { }
  };

  const handleEditStaff = (staff) => {
    setEditStaff(staff); // Set the staff data in the state
    setOpenEditModal(true); // Open the modal for editing
  };

  const fetchAgencies = async (page) => {
    dispatch(setLoading(true));
    try {
      const res = await getTravelAgency(page);
      setAllAgencies(res.result.agency);
    } catch (error) {
      console.log("error ---", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const deleteStaff = (id) => {
    dispatch(setLoading(true));
    deleteStaffUser(id).then((res) => {
      console.log(res)
      enqueueSnackbar(res?.message, {
        variant: "success",
      });
      dispatch(setLoading(false));
      fetchAgencyUsers()
    }).catch((err) => {
      console.log(err)
      enqueueSnackbar(err || "Cannot delete staff!", {
        variant: "error",
      });
      dispatch(setLoading(false));
    })
  }

  const handleSearchInputChange = (event) => {
    const { name, type, checked, value } = event.target;

    // Check if the input is a checkbox
    if (type === "checkbox") {
      // Use checked to determine the boolean value
      searchStaffRef.current[name] = checked; // This will be true or false
    } else {
      // For other input types, use value
      searchStaffRef.current[name] = value;
    }
  };

  function RowMenu({ userId, status, staff, handleEditStaff, setOpenTopup, deleteStaff }) {
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
          title="Add Credit"
        >
          <AddCardIcon onClick={() => setOpenTopup({ value: true, data: staff })} sx={{ fontSize: '25px', cursor: 'pointer', mr: 1 }} />
        </Tooltip>

        <Tooltip
          arrow={false}
          color="neutral"
          size="md"
          variant="solid"
          title="Edit Staff"
        >
          <EditIcon onClick={() => handleEditStaff(staff)} sx={{ fontSize: '25px', cursor: 'pointer', mr: 1 }} />
        </Tooltip>

        <Tooltip
          arrow={false}
          color="neutral"
          size="md"
          variant="solid"
          title="Delete Staff"
        >
          <DeleteIcon onClick={() => deleteStaff(staff?._id)} sx={{ fontSize: '25px', cursor: 'pointer', mr: 1 }} />
        </Tooltip>
      </>
    );
  }

  const handleAgencyUserStatus = async (userId, status) => {
    const userStatus = status === "INACTIVE" ? "ACTIVE" : "INACTIVE";
    const body = {
      status: userStatus,
    };
    try {
      const res = await updateAgencyUserStatus(userId, body);
      fetchAgencyUsers();
    } catch (error) {
      console.log("error fetching user status", error);
    }
  };

  const fetchAgencyUsers = async (page = 1) => {
    try {
      dispatch(setLoading(true));
      let res;
      if (userData?.agency_id && userData.role !== "super_admin") {
        res = await getAgencyUsers(userData?.agency_id, page);
      } else if (userData.role === "super_admin") {
        res = await getAgencyAllUsers(page);
      }

      if (res?.result) {
        setAgencies(res.result.staff);
        setTotalPages(res.result.totalPages); // Update totalPages based on response
      }
    } catch (error) {
      // enqueueSnackbar("Error fetching users.", { variant: "error" });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchAllSPOStaff = async (id) => {
    try {
      const res = await getAllSPOStaff(id);
      setAllSPOStaff(res?.result)
    } catch (error) {
      console.log(error)
    }
  }

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    // Create a copy of the current state
    setUserManagement((prevUserManagement) => {
      const userManagementReplica = { ...prevUserManagement };

      // Adjust value based on name (e.g., 'role')
      if (name === "role") {
        userManagementReplica[name] = value === "SPO" ? value : value?.toLowerCase();
      } else {
        userManagementReplica[name] = value;
      }

      // If the selectedAgency changes, call the fetch function
      if (name === "selectedAgency") {
        fetchAllSPOStaff(value); // Pass value directly instead of userManagementReplica.selectedAgency
      }

      return userManagementReplica; // Return the updated replica to set state
    });
  }, []);


  const handleStaffSearch = async () => {
    const { cnic, staffEmail, staffName, activeAgencies } =
      searchStaffRef.current;

    // Validation checks
    if (
      staffEmail &&
      !/^[\w-\.]+@(gmail\.com|[\w-]+\.asaam\.pk)$/.test(staffEmail)
    ) {
      enqueueSnackbar("Please enter a valid email address.");
      return;
    }

    if (cnic && !/^\d{13}$/.test(cnic)) {
      enqueueSnackbar("Please enter a valid CNIC (13 digits).");
      return;
    }

    if (staffName && staffName.length < 5) {
      enqueueSnackbar("Staff name should be at least 5 characters long.");
      return;
    }

    // Prepare the search parameters
    const searchParams = {
      CNIC: cnic,
      email: staffEmail,
      firstName: staffName,
      status: activeAgencies ? "ACTIVE" : "INACTIVE",
    };

    // Remove empty fields
    Object.keys(searchParams).forEach((key) => {
      if (!searchParams[key]) {
        delete searchParams[key];
      }
    });

    // Make the search API call
    dispatch(setLoading(true));
    try {
      if (userData?.agency_id && userData?.role === "agency") {
        const res = await searchAgencySatff(searchParams, userData?.agency_id);
        setAgencies(res.result.staff);
      }

      if (userData?.role === "super_admin") {
        const adminRes = await searchAgencySatffAdmin(searchParams);
        setAgencies(adminRes.result.staff);
      }
    } catch (error) {
      console.error("Error searching agencies:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchAgencyUsers(page);
  };

  const handleAddUser = async () => {
    const {
      userCnic,
      userEmail,
      userName,
      role: stateRole,
      password,
      selectedAgency: stateSelectedAgency,
      phone,
      assignedSPO
    } = userManagement;

    const role = stateRole || (usersRoles[0]?.name ? (usersRoles[0].name === "SPO" ? "SPO" : usersRoles[0].name.toLowerCase()) : "");
    const selectedAgency = stateSelectedAgency || (allAgencies[0]?._id ? allAgencies[0]._id : "");

    console.log(
      "we are checking all ",
      userCnic,
      userEmail,
      userName,
      role,
      password
    );

    // Validate CNIC
    if (!userCnic || !/^\d{13}$/.test(userCnic)) {
      enqueueSnackbar("Please enter a valid CNIC (13 digits).");
      return;
    }

    // Validate Password
    if (!password || !passwordRegex.test(password)) {
      enqueueSnackbar("Please enter a valid password.");
      return;
    }

    // Check for role
    if (!role) {
      enqueueSnackbar("Please enter staff role");
      return;
    }
    if (!selectedAgency && !userData?.agency_id) {
      enqueueSnackbar("Please select agency");
      return;
    }

    // Validate user name length
    if (!userName) {
      enqueueSnackbar("Staff name should be at least 5 characters long.");
      return;
    }

    if (!phone) {
      enqueueSnackbar("Staff phone number is missing!");
      return;
    }

    // Create request body
    const body = {
      firstName: userName,
      email: userEmail,
      CNIC: userCnic,
      password,
      role: role === "SPO" ? role : role?.toLowerCase(),
      agencyId: selectedAgency || userData?.agency_id,
      phone: phone.replace(/\s+/g, ""),
      assignedSPO,
      agencyName: userManagement.agencyName,
      officeAddress: userManagement.officeAddress,
      city: userManagement.city,
      consultant: userManagement.consultant
    };

    try {
      dispatch(setLoading(true));
      const res = await addAgencyUser(body);

      if (res.result) {
        enqueueSnackbar("User added successfully.", { variant: "success" });
        setOpen(false);
        fetchAgencyUsers();
      } else {
        enqueueSnackbar(res.message || "Failed to add user.", {
          variant: "error",
        }); // Show server error message if available
      }
      setOpen(false);
      setUserManagement({})
    } catch (res) {
      console.log(res, "user adding error/...");
      enqueueSnackbar(res || "Failed to add user.", {
        variant: "error",
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleAddStaff = () => {
    fetchAgencies(1);
    setOpen(true);
  };

  const renderFilters = () => (
    <React.Fragment>
      <InputField
        type="number"
        label="CNIC"
        name="cnic"
        placeholder="CNIC Number"
        onChange={handleSearchInputChange}
      />

      <InputField
        type="email"
        label="Email ID"
        name="staffEmail"
        placeholder="Email ID"
        onChange={handleSearchInputChange}
      />

      <InputField
        label="Staff Name"
        name="StaffName"
        placeholder="Satff Name"
        onChange={handleSearchInputChange}
      />
      <Checkbox
        label="Active Only"
        size="lg"
        name="activeAgencies"
        onChange={handleSearchInputChange}
      />

      <AppButton
        text="Search"
        size="sm"
        width="120px"
        onClick={handleStaffSearch}
      />
    </React.Fragment>
  );

  const handleSaveEdit = async () => {
    dispatch(setLoading(true))

    const body = {
      firstName: editStaff.userName || editStaff.firstName,
      email: editStaff?.email,
      role: editStaff?.role === "SPO" ? editStaff?.role : editStaff?.role?.toLowerCase(),
      CNIC: editStaff?.userCnic || editStaff?.CNIC,
      phone: editStaff?.phone,
      agencyName: editStaff?.agencyName,
      officeAddress: editStaff?.officeAddress,
      city: editStaff?.city,
      consultant: editStaff?.consultant,
      agencyId: editStaff?.selectedAgency || editStaff?.agencyId
    };
    try {
      const res = await updateAgencyStaff(editStaff._id, body);
      enqueueSnackbar("Staff details updated successfully.", {
        variant: "success",
      });
      fetchAgencyUsers(); // Refetch the users to get the updated data
      setOpenEditModal(false); // Close the modal after saving
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      enqueueSnackbar("Error updating staff details.", { variant: "error" });
    }
  };

  const handleStaffChange = (e) => {
    setEditStaff({ ...editStaff, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchAgencyUsers(currentPage);
  }, []);

  useEffect(() => {
    fetchAgencyUserRoles();
  }, []);

  useEffect(() => {
    if (userManagement?.selectedAgency && userManagement?.role) {
      setIsDisabled(userManagement?.selectedAgency && userManagement?.role !== 'sale')
    }
  }, [userManagement])

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "700px",
      }}
    >
      <Box>
        <Sheet
          className="SearchAndFilters-mobile"
          sx={{ display: { xs: "flex", sm: "none" }, my: 1, gap: 1 }}
        >
          <Input
            size="sm"
            placeholder="Search"
            startDecorator={<SearchIcon />}
            sx={{ flexGrow: 1 }}
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

        <Box
          className="SearchAndFilters-tabletUp"
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "end",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          {renderFilters()}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <div></div>
          <AppButton text="Add Staff" onClick={handleAddStaff} />
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
              textAlign: "center",
            }}
          >
            <thead>
              <tr>
                {/* <th>
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
              </th> */}
                <th style={{ textAlign: "center" }}>Agenct Code</th>
                <th style={{ textAlign: "center" }}>
                  {/* <Link
                  underline="none"
                  color="primary"
                  onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                > */}
                  Staff Name
                  {/* </Link> */}
                </th>
                <th style={{ textAlign: "center" }}>Staff Email</th>

                {/* <th style={{ textAlign: "center" }}>Role</th> */}
                <th style={{ textAlign: "center" }}>Balance</th>
                <th style={{ textAlign: "center" }}>Status</th>
                {/* <th style={{ textAlign: "center" }}>Balance</th> */}
                <th />
              </tr>
            </thead>
            {agencies.length > 0 && (
              <tbody>
                {stableSort(agencies, getComparator(order, "userName"))?.map(
                  (row) => (
                    <tr key={row?.agencyName}>
                      {/* <td>
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
                    </td> */}
                      <td>{row?.agentCode ? row?.agentCode : "N/A"}</td>
                      <td>{row?.firstName}</td>
                      <td>{row?.email}</td>
                      {/* <td>{row.role.charAt(0).toUpperCase() + row.role.slice(1)}</td> */}
                      <td>{row?.allocatedBalance ? `RS. ${row?.allocatedBalance}` : 'N/A'}</td>
                      <td>{row.status}</td>
                      {/* <td>{row.allocatedBalance ? `RS.${row?.allocatedBalance}` : 'N/A'}</td> */}

                      <td>
                        {" "}
                        <RowMenu
                          userId={row._id}
                          status={row?.status}
                          staff={row}
                          handleEditStaff={handleEditStaff}
                          setOpenTopup={setOpenTopup}
                          deleteStaff={deleteStaff}
                        />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            )}
          </Table>
        </Sheet>
      </Box>
      {totalPages > 1 && (
        <Box
          className="Pagination-laptopUp"
          sx={{
            pt: 2,
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
          }}
        >
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

      {open && (
        <AddAgencyUserModal
          open={open}
          setOpen={setOpen}
          handleInputChange={handleInputChange}
          usersRoles={usersRoles}
          handleAddUser={handleAddUser}
          allAgencies={allAgencies}
          allSPOStaff={allSPOStaff}
          isDisabled={isDisabled}
          cities={cities}
          consultants={CONSULTANTS}
          formValues={userManagement}
        />
      )}

      {openEditModal && (
        <EditAgencyStaffModal
          handleStaffChange={handleStaffChange}
          openEditModal={openEditModal}
          setOpenEditModal={setOpenEditModal}
          allAgencies={allAgencies}
          usersRoles={usersRoles}
          handleSaveEdit={handleSaveEdit}
          editStaff={editStaff}
          cities={cities}
          consultants={CONSULTANTS}
        />
      )}

      {openTopup?.value && (
        <AddTopupModal open={openTopup?.value} setOpen={setOpenTopup} data={openTopup?.data} fetchAgencyUsers={fetchAgencyUsers} />
      )}
    </Box>
  );
}
