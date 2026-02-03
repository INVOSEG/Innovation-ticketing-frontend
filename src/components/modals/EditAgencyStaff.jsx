import { Box, Checkbox, Divider, Grid, Sheet, Typography } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import InputField from "../common/InputField";
import AppButton from "../common/AppButton";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import FormSelect from "../common/FormSelect";
import { useSelector } from "react-redux";
import AppTextArea from "../common/AppTextArea";

const EditAgencyStaffModal = ({
    openEditModal,
    setOpenEditModal,
    handleStaffChange,
    handleSaveEdit,
    editStaff,
    allAgencies,
    usersRoles,
    cities = [],
    consultants = []
}) => {
    const isLoading = useSelector(state => state.loading.loading);

    return (
        <Modal open={openEditModal} onClose={() => setOpenEditModal(false)} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ModalDialog sx={{
                minWidth: '70vw',
                maxWidth: '90vw',
                borderRadius: 'lg',
                boxShadow: 'xl',
                p: 4,
                overflowY: 'auto',
                border: '1px solid',
                borderColor: 'neutral.outlinedBorder',
            }}>
                <ModalClose />

                <Typography id="filter-modal" level="h2" sx={{ color: '#185ea5', fontWeight: 'bold', mb: 0.5 }}>
                    Edit Staff Details
                </Typography>
                <Typography level="body-sm" sx={{ color: 'neutral.500', mb: 2 }}>
                    Update branding, identification, and account settings for this staff member.
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Sheet sx={{ display: "flex", flexDirection: "column", gap: 3, background: 'transparent' }}>

                    <Box>
                        <Typography level="title-md" sx={{ mb: 2, color: '#185ea5', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 4, height: 16, bgcolor: '#185ea5', borderRadius: 'pill' }} />
                            Branding Information
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <InputField
                                    label="Agency Name *"
                                    name="agencyName"
                                    value={editStaff?.agencyName || ""}
                                    onChange={handleStaffChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <AppTextArea
                                    label="Office Address *"
                                    name="officeAddress"
                                    value={editStaff?.officeAddress || ""}
                                    onChange={handleStaffChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormSelect
                                    label="City *"
                                    name="city"
                                    options={cities}
                                    onChange={handleStaffChange}
                                    value={editStaff?.city || ""}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormSelect
                                    label="Consultant *"
                                    name="consultant"
                                    options={consultants}
                                    onChange={handleStaffChange}
                                    value={editStaff?.consultant || ""}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Divider />

                    <Box>
                        <Typography level="title-md" sx={{ mb: 2, color: '#185ea5', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 4, height: 16, bgcolor: '#185ea5', borderRadius: 'pill' }} />
                            Contact & identification
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <InputField
                                    label="Full Name *"
                                    name="userName"
                                    value={editStaff?.firstName || ""}
                                    onChange={handleStaffChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <InputField
                                    label="Email *"
                                    name="email"
                                    value={editStaff?.email || ""}
                                    onChange={handleStaffChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <InputField
                                    label="Cell # *"
                                    name="phone"
                                    value={editStaff?.phone || ""}
                                    onChange={handleStaffChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <InputField
                                    label="CNIC *"
                                    name="userCnic"
                                    value={editStaff?.CNIC || ""}
                                    onChange={handleStaffChange}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Divider />

                    <Box>
                        <Typography level="title-md" sx={{ mb: 2, color: '#185ea5', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 4, height: 16, bgcolor: '#185ea5', borderRadius: 'pill' }} />
                            Account Settings
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <FormSelect
                                    label="Parent Agency / Company Name *"
                                    name="selectedAgency"
                                    options={allAgencies.map((role) => ({ id: role._id, name: role.agencyName || role.affiliateName }))}
                                    onChange={handleStaffChange}
                                    value={editStaff?.selectedAgency || editStaff?.agencyId?._id || editStaff?.agencyId}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormSelect
                                    label="Role Selection *"
                                    name="role"
                                    options={usersRoles.map((role) => role.name)}
                                    onChange={handleStaffChange}
                                    value={editStaff?.role ? (editStaff.role === "SPO" ? editStaff.role : editStaff.role?.charAt(0)?.toUpperCase() + editStaff?.role?.slice(1)) : ""}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box sx={{
                                    mt: 3,
                                    p: 1.5,
                                    borderRadius: 'sm',
                                    bgcolor: 'neutral.softBg',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <Typography level="title-sm">Allow Profile Editing</Typography>
                                    <Checkbox
                                        name="editPermission"
                                        checked={editStaff?.editPermission}
                                        onChange={(e) =>
                                            handleStaffChange({
                                                target: { name: e.target.name, value: e.target.checked },
                                            })
                                        }
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <AppButton
                            text="Cancel"
                            variant="outlined"
                            onClick={() => setOpenEditModal(false)}
                            sx={{ minWidth: 120 }}
                        />
                        <AppButton
                            onClick={handleSaveEdit}
                            text="Save Changes"
                            loading={isLoading}
                            sx={{ minWidth: 200, bgcolor: '#185ea5' }}
                        />
                    </Box>

                </Sheet>
            </ModalDialog>
        </Modal>
    )
}

export default EditAgencyStaffModal
