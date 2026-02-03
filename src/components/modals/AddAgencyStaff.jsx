import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import FormSelect from "../common/FormSelect";
import InputField from "../common/InputField";
import AppButton from "../common/AppButton";
import Checkbox from '@mui/joy/Checkbox';
import Typography from '@mui/joy/Typography';
import Sheet from "@mui/joy/Sheet";
import Divider from "@mui/joy/Divider";
import Grid from '@mui/joy/Grid';
import React from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useSelector } from "react-redux";
import AppTextArea from "../common/AppTextArea";
import { Box } from "@mui/joy";

const AddAgencyUserModal = ({
  open,
  setOpen,
  handleInputChange,
  usersRoles,
  handleAddUser,
  allAgencies,
  allSPOStaff,
  isDisabled,
  cities = [],
  consultants = [],
  formValues = {}
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isLoading = useSelector(state => state.loading.loading);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
          Add Staff
        </Typography>
        <Typography level="body-sm" sx={{ color: 'neutral.500', mb: 2 }}>
          Create a new staff member with specific branding and permissions.
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
                  placeholder="Enter specific agency branding name"
                  onChange={handleInputChange}
                  value={formValues.agencyName}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <AppTextArea
                  label="Office Address *"
                  name="officeAddress"
                  placeholder="Complete office address for this agent"
                  onChange={handleInputChange}
                  value={formValues.officeAddress}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormSelect
                  label="City *"
                  name="city"
                  options={cities}
                  onChange={handleInputChange}
                  value={formValues.city}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormSelect
                  label="Consultant *"
                  name="consultant"
                  options={consultants}
                  onChange={handleInputChange}
                  value={formValues.consultant}
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
                  placeholder="Legal name of the staff member"
                  onChange={handleInputChange}
                  value={formValues.userName}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <InputField
                  label="Email Address *"
                  name="userEmail"
                  placeholder="staff@example.com"
                  onChange={handleInputChange}
                  value={formValues.userEmail}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <InputField
                  label="Cell # *"
                  name="phone"
                  placeholder="+923000000000"
                  onChange={handleInputChange}
                  type="number"
                  value={formValues.phone}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <InputField
                  label="CNIC *"
                  name="userCnic"
                  placeholder="13-digit CNIC number"
                  onChange={handleInputChange}
                  type="number"
                  value={formValues.userCnic}
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
                <InputField
                  label="Password *"
                  name="password"
                  placeholder="Secure password"
                  onChange={handleInputChange}
                  type={showPassword ? "text" : "password"}
                  value={formValues.password}
                  endDecorator={showPassword ? <VisibilityIcon sx={{ cursor: 'pointer' }} onClick={togglePasswordVisibility} /> : <VisibilityOffIcon sx={{ cursor: 'pointer' }} onClick={togglePasswordVisibility} />}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormSelect
                  label="Parent Agency / Company Name *"
                  name="selectedAgency"
                  value={formValues.selectedAgency || (allAgencies[0]?._id ? allAgencies[0]._id : "")}
                  options={allAgencies.map((role) => ({ id: role._id, name: role.agencyName || role.affiliateName }))}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormSelect
                  label="Role Selection *"
                  name="role"
                  value={formValues.role || (usersRoles[0]?.name ? usersRoles[0].name : "")}
                  options={usersRoles.map((role) => role.name)}
                  onChange={handleInputChange}
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
                    checked={formValues.editPermission}
                    onChange={(e) =>
                      handleInputChange({
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
              onClick={() => setOpen(false)}
              sx={{ minWidth: 120 }}
            />
            <AppButton
              text="Add Staff Member"
              onClick={handleAddUser}
              loading={isLoading}
              sx={{ minWidth: 200, bgcolor: '#185ea5' }}
            />
          </Box>

        </Sheet>
      </ModalDialog>
    </Modal>
  );
}

export default AddAgencyUserModal;
