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
    getBalanceOfStaff,
    resetLimitOfStaff,
    addlimitOfStaff,
} from "../../server/api";
import AppButton from "../../components/common/AppButton";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/reducer/loaderSlice";
import { passwordRegex } from "../../components/utils";
import AddAgencyUserModal from "../../components/modals/AddAgencyStaff";
import EditAgencyStaffModal from "../../components/modals/EditAgencyStaff";
import { Card, Checkbox, Tooltip, Typography } from "@mui/joy";
import AddCardIcon from '@mui/icons-material/AddCard';
import AddTopupModal from "../../components/modals/AddTopupModal";
import EditIcon from '@mui/icons-material/Edit';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import CloseIcon from '@mui/icons-material/Close';
import moment from "moment";


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

const SubUser = () => {
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
    const [isEdited, setIsEdited] = useState({ value: false, id: null })
    const [newBalance, setNewBalance] = useState(0)

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
            fetchAgencies()
        }).catch((err) => {
            console.log(err)
            enqueueSnackbar(err || "Cannot delete staff!", {
                variant: "error",
            });
            dispatch(setLoading(false));
        })
    }

    const handleResetLimitOfStaff = (id) => {
        dispatch(setLoading(true));
        resetLimitOfStaff({ userId: id }).then((res) => {
            console.log(res)
            enqueueSnackbar(res?.message, {
                variant: "success",
            });
            dispatch(setLoading(false));
            fetchBalanceOfStaff()
        }).catch((err) => {
            console.log(err)
            enqueueSnackbar(err || "Cannot reset staff limit!", {
                variant: "error",
            });
            dispatch(setLoading(false));
        })
    }

    const handleAddlimitOfStaff = (id, limit) => {

        dispatch(setLoading(true));
        addlimitOfStaff({ userId: id, cashLimit: parseInt(limit) }).then((res) => {
            console.log(res)
            enqueueSnackbar(res?.message, {
                variant: "success",
            });
            dispatch(setLoading(false));
            setIsEdited({ value: false, id: null })
            setNewBalance(0)
            fetchBalanceOfStaff()
        }).catch((err) => {
            console.log(err)
            enqueueSnackbar(err || "Cannot add staff limit!", {
                variant: "error",
            });
            dispatch(setLoading(false));
        })
    }

    function RowMenu({ userId, status, staff, handleEditStaff, setOpenTopup, handleResetLimitOfStaff, handleAddlimitOfStaff }) {
        const textStyle = {
            color: "blue", textDecoration: "underline", cursor: "pointer", '&:hover': {
                color: 'red',
            },
        };
        return (
            <>
                <Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>

                    <Typography sx={textStyle} onClick={() => { isEdited?.value && isEdited?.id === userId ? handleAddlimitOfStaff(userId, newBalance) : setIsEdited({ value: true, id: userId }); setNewBalance(parseInt(staff?.usageLimit)) }}>
                        {isEdited?.value && isEdited?.id === userId
                            ? <>Save <span onClick={(e) => { e.stopPropagation(); setIsEdited({ value: false, id: null }); setNewBalance(0) }}><CloseIcon /></span></>
                            : "Edit"}

                    </Typography>
                    <Typography sx={textStyle} onClick={() => handleResetLimitOfStaff(userId)}>Reset</Typography>
                </Box >
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
            // fetchAgencyUsers();
            fetchBalanceOfStaff()
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

    const fetchBalanceOfStaff = async () => {
        try {
            const res = await getBalanceOfStaff();
            console.log(res)
            setAgencies(res?.result?.staff)
            // setAllSPOStaff(res?.result)
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
        // fetchAgencyUsers(page);
        fetchBalanceOfStaff()
    };

    const handleAddUser = async () => {
        const {
            userCnic,
            userEmail,
            userName,
            role,
            password,
            selectedAgency,
            phone,
            assignedSPO
        } = userManagement;
        console.log(
            "we are checking all ",
            userCnic,
            userEmail,
            userName,
            role,
            password
        );
        // Validate email
        // if (
        //   !userEmail ||
        //   !/^[\w-\.]+@(gmail\.com|[\w-]+\.asaam\.pk)$/.test(userEmail)
        // ) {
        //   enqueueSnackbar("Please enter a valid email address.");
        //   return;
        // }

        // Validate CNIC
        if (!userCnic || !/^\d{13}$/.test(userCnic)) {
            enqueueSnackbar("Please enter a valid CNIC (13 digits).");
            return;
        }

        // Validate CNIC
        if (!password || !passwordRegex.test(password)) {
            enqueueSnackbar("Please enter a valid password.");
            return;
        }

        // Check for role
        if (!role) {
            enqueueSnackbar("Please enter staff role");
            return;
        }
        if (!selectedAgency) {
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
            role,
            agencyId: selectedAgency || userData?.agency_id,
            phone: phone.replace(/\s+/g, ""),
            assignedSPO
        };

        try {
            dispatch(setLoading(true));
            const res = await addAgencyUser(body);

            if (res.result) {
                enqueueSnackbar("User added successfully.", { variant: "success" });
                setOpen(false);
                // fetchAgencyUsers();
                fetchBalanceOfStaff()
            } else {
                enqueueSnackbar(res.message || "Failed to add user.", {
                    variant: "error",
                }); // Show server error message if available
            }
        } catch (res) {
            console.log(res, "user adding error/...");
        } finally {
            dispatch(setLoading(false));
            setOpen(false);
            setUserManagement({})
        }
    };

    const handleAddStaff = () => {
        fetchAgencies(1);
        setOpen(true);
    };


    const handleSaveEdit = async () => {
        console.log("editstaff ", editStaff);

        dispatch(setLoading(true))

        const body = {
            firstName: editStaff.userName,
            email: editStaff?.email,
            role: editStaff?.role === "SPO" ? editStaff?.role : editStaff?.role?.toLowerCase(),
            CNIC: editStaff?.CNIC,
        };
        try {
            const res = await updateAgencyStaff(editStaff._id, body);
            enqueueSnackbar("Staff details updated successfully.", {
                variant: "success",
            });
            // fetchAgencyUsers(); // Refetch the users to get the updated data
            fetchBalanceOfStaff()
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
        // fetchAgencyUsers(currentPage);
        fetchBalanceOfStaff()
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
        <Card sx={{ p: 3, mb: 3, boxShadow: 'sm', border: '1px solid #e0e0e0', background: '#fff', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <GroupIcon sx={{ color: '#185ea5', fontSize: 24 }} />
                <Typography level="h5" sx={{ fontWeight: 600, color: '#222' }}>
                    Sub User Usage Limit
                </Typography>
            </Box>
            <Box sx={{ borderBottom: '1px solid #eee', mb: 2 }} />
            <Table aria-label="sub user usage table" stripe="odd" sx={{ background: '#fff', borderRadius: 2, fontSize: 14 }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: "center" }}>
                            Name
                        </th>
                        <th style={{ textAlign: "center" }}>Email</th>
                        <th style={{ textAlign: "center" }}>Usage Limit</th>
                        <th style={{ textAlign: "center" }}>Balance</th>
                        <th style={{ textAlign: "center" }}>Date And Time</th>
                        <th style={{ textAlign: "center" }}>Action</th>
                    </tr>
                </thead>
                {agencies.length > 0 && (
                    <tbody>
                        {stableSort(agencies, getComparator(order, "userName"))?.map(
                            (row) => (
                                <tr key={row?.agencyName}>
                                    <td style={{ textAlign: "center" }}>{row?.firstName}</td>
                                    <td style={{ textAlign: "center", wordBreak: "break-all" }}>{row?.email}</td>
                                    <td style={{ textAlign: "center" }}>{
                                        row?._id === isEdited?.id && isEdited?.value ? <input type="number" min={0} value={newBalance} onChange={(e) => setNewBalance(e.target.value)} /> :
                                            row?.usageLimit ? `Rs. ${row?.usageLimit}` : "Rs. 0"
                                    }</td>
                                    <td style={{ textAlign: "center" }}>{
                                        row?.allocatedBalance ? `Rs. ${row?.allocatedBalance}` : "Rs. 0"
                                    }</td>

                                    <td style={{ textAlign: "center" }}>{
                                        row?.allocatedBalanceTime ? moment(row?.allocatedBalanceTime).format("M/D/YYYY h:mm:ss A") : "Nil"
                                    }</td>

                                    <td style={{ textAlign: "center" }}>
                                        {" "}
                                        <RowMenu
                                            userId={row._id}
                                            status={row?.status}
                                            staff={row}
                                            handleEditStaff={handleEditStaff}
                                            setOpenTopup={setOpenTopup}
                                            handleResetLimitOfStaff={handleResetLimitOfStaff}
                                            handleAddlimitOfStaff={handleAddlimitOfStaff}
                                        />
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                )}
            </Table>
        </Card>
    )
}

export default SubUser