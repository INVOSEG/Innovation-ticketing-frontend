import React, {
  useRef,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from "react";
import Box from "@mui/joy/Box";
import InputField from "../../components/common/InputField";
import FormSelect from "../../components/common/FormSelect";
import AppTextArea from "../../components/common/AppTextArea";
import AppButton from "../../components/common/AppButton";
import { Country, City } from "country-state-city";
import { useSnackbar } from "notistack";
import TextHeading from "../../components/common/TextHeading";
import { addTravelAgency, getAgencyTypes } from "../../server/api";
import { Checkbox, Divider } from "@mui/joy";
import AddIcon from "@mui/icons-material/Add"; // Import the Add icon
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../redux/reducer/loaderSlice";
import DeleteIcon from '@mui/icons-material/Delete';
import { cnicRegex, emailRegex, passwordRegex, phoneNumberRegex, validatePassword } from "../../components/utils";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { setDashboardOption } from "../../redux/reducer/dashboardSlice";
const AddAgency = () => {
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
  const agencyDetailsRef = useRef({});
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [timeZones, setTimeZones] = useState([]);
  const [languages, setLanguages] = useState([
    "English",
    "Spanish",
    "French",
    "German",
    "Urdu",
    "Hindi",
    "Punjabi",
  ]);
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [fileName, setFileName] = useState(["Upload File"]);
  const [agencyLogo, setAgencyLogo] = useState(null);
  const [agencyLogoName, setAgencyLogoName] = useState("Upload Agency Logo");
  const [agencyTypes, setAgencyTypes] = useState([])
  const { enqueueSnackbar } = useSnackbar();
  const loading = useSelector((state) => state.loading.loading);
  const [showPassword, setShowPassword] = React.useState(false);
  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const dispatch = useDispatch()
  useEffect(() => {
    setCountries(Country.getAllCountries());
    setTimeZones([Intl.DateTimeFormat().resolvedOptions().timeZone]); // Wrap in array
    fetchAgencyTypes()
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleAgencyLogoUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        enqueueSnackbar(`File exceeds the 5MB limit`, { variant: "error" });
        return;
      }
      setAgencyLogo(file);
      setAgencyLogoName(file.name);
    }
  }, [enqueueSnackbar]);
  const fetchAgencyTypes = async () => {
    try {

      const res = await getAgencyTypes()
      console.log("res of agency types is ", res)
      setAgencyTypes(res || []);
    }
    catch (error) {
      console.log("error in fetching agnecy types", error)
    }


  }


  const handleFileDelete = (index) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1); // Remove the file at the specified index
      return updatedImages;
    });

    setFileName((prevFileNames) => {
      const updatedFileNames = [...prevFileNames];
      updatedFileNames.splice(index, 1); // Remove the file name at the specified index
      return updatedFileNames;
    });
  };
  const handleInputChange = useCallback(
    (event, index) => {

      const { name, value, files } = event.target;

      if (files && files.length > 0) {
        const selectedFiles = Array.from(files);

        if (images.flat().length + selectedFiles.length > MAX_FILES) {
          enqueueSnackbar(`You can upload a maximum of ${MAX_FILES} files.`, { variant: "error" });
          return;
        }

        // Check file sizes
        const oversizedFiles = selectedFiles.filter(file => file.size > MAX_FILE_SIZE);
        if (oversizedFiles.length > 0) {
          enqueueSnackbar(`File(s) exceed the 5MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`, { variant: "error" });
          return;
        }

        // Handle multiple file uploads for images
        setImages((prevImages) => {
          const updatedImages = [...prevImages];
          updatedImages[index] = selectedFiles;
          return updatedImages;
        });

        const newFileName =
          selectedFiles.length > 1
            ? `${selectedFiles.length} files selected`
            : selectedFiles[0]?.name || "Upload File";

        setFileName((prevFileNames) => {
          const updatedFileNames = [...prevFileNames];
          updatedFileNames[index] = newFileName;
          return updatedFileNames;
        });
      } else {
        agencyDetailsRef.current[name] = name === "showLabel" ? event.target.checked : value;
        console.log(agencyDetailsRef)

        if (name === "country") {
          const selectedCountry = countries.find((c) => c.name === value);
          if (selectedCountry) {
            setCities(
              City.getCitiesOfCountry(selectedCountry.isoCode).map(
                (city) => city.name
              )
            );
          } else {
            setCities([]);
          }
        }
      }
    },
    [countries, enqueueSnackbar, images, MAX_FILES, MAX_FILE_SIZE]
  );

  const addFileUploadField = () => {
    setFileName((prevFileNames) => [...prevFileNames, "Upload File"]);
    setImages((prevImages) => [...prevImages, []]);
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "agencyName",
      "affiliateName",
      "personName",
      "cnic",
      "designation",
      "phoneNumber",
      "affiliateType",
      "agencyType",
      "agencyEmail",
      "agencyPassword",
      "agencyConfirmPassword",
      "DTN",
      "cashRecived",
      "salesChannel",
      "consultant",
      "address",
    ];
    requiredFields.forEach((field) => {
      if (!agencyDetailsRef.current[field]) {
        console.log("missing fiels", field)
        newErrors[field] = true;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAgency = async () => {
    if (!validateForm()) {
      enqueueSnackbar("Please fill in all required fields.", {
        variant: "error",
      });
      return;
    }
    if (!agencyLogo) {
      enqueueSnackbar("Please add agency logo.", {
        variant: "error",
      });
      return;
    }

    const agencyEmail = agencyDetailsRef.current.agencyEmail;
    if (agencyEmail && !emailRegex.test(agencyEmail)) {
      enqueueSnackbar("Invalid Email Format", {
        variant: "error",
      });
      return
    }

    const agencyCnic = agencyDetailsRef.current.cnic;
    if (agencyCnic && !cnicRegex.test(agencyCnic)) {
      enqueueSnackbar("Invalid CNIC Format", {
        variant: "error",
      });
      return
    }

    const agencyPhone = agencyDetailsRef.current.phoneNumber;
    if (agencyPhone && !phoneNumberRegex.test(agencyPhone)) {
      enqueueSnackbar("Invalid Phone Format", {
        variant: "error",
      });
      return
    }

    // Validate password
    const agencyPassword = agencyDetailsRef.current.agencyPassword;
    const agencyConfirmPassword = agencyDetailsRef.current.agencyConfirmPassword;

    if (agencyPassword !== agencyConfirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      return;
    }


    if (agencyPassword) {
      const validation = validatePassword(agencyPassword);

      if (!validation.isValid) {
        // Option 1: Show all errors at once
        const errorMessage = validation.errors?.[0];
        enqueueSnackbar(errorMessage, {
          variant: "error",
        });
        return;
      }
    }



    const formData = new FormData();
    formData.append("affiliateName", agencyDetailsRef.current.affiliateName);
    formData.append("personName", agencyDetailsRef.current.personName);
    formData.append("designation", agencyDetailsRef.current.designation);
    formData.append("phoneNumber", agencyDetailsRef.current.phoneNumber);
    formData.append("country", agencyDetailsRef.current.country);
    formData.append("city", agencyDetailsRef.current.city);
    formData.append("timeZone", agencyDetailsRef.current.timeZone);
    formData.append("defaultCurrency", agencyDetailsRef.current.defaultCurrency);
    formData.append("currency", agencyDetailsRef.current.currency);
    formData.append("addStaff", agencyDetailsRef.current.staffNumber);
    formData.append("salesChannel", agencyDetailsRef.current.salesChannel);
    formData.append("poBoxNumber", agencyDetailsRef.current.poBoxNumber);
    formData.append("affiliateType", agencyDetailsRef.current.affiliateType);
    formData.append("arCode", agencyDetailsRef.current.arCode);
    formData.append("groupArCode", agencyDetailsRef.current.groupArCode);
    formData.append("address", agencyDetailsRef.current.address);
    formData.append("agencyEmail", agencyDetailsRef.current.agencyEmail);
    formData.append("agencyPassword", agencyDetailsRef.current.agencyPassword);
    formData.append("type", agencyDetailsRef.current.agencyType);
    formData.append("showLabel", agencyDetailsRef.current.showLabel);
    formData.append("cashRecived", agencyDetailsRef.current.cashRecived);
    formData.append("DTN", agencyDetailsRef.current.DTN);
    formData.append("consultant", agencyDetailsRef.current.consultant);

    formData.append("agencyName", agencyDetailsRef.current.agencyName);
    formData.append("CNIC", agencyDetailsRef.current.cnic);
    formData.append("role", "agency");
    formData.append('logo', agencyLogo);
    // Create an array to hold all files
    const allFiles = images.flat(); // Flatten nested arrays

    // Append all files to FormData
    allFiles.forEach((file) => {
      formData.append('files', file); // Use the same key ''
    });


    try {
      dispatch(setLoading(true));
      const res = await addTravelAgency(formData);
      enqueueSnackbar("Agency added successfully!", { variant: "success" });
      dispatch(setDashboardOption("View Agency"))
    } catch (error) {
      console.error("Error adding agency:", error);
      enqueueSnackbar(error, { variant: "error" });
    } finally {
      dispatch(setLoading(false));
    }
  };

  console.log("agencyTypes", agencyTypes)
  const formFields = [
    {
      component: InputField,
      label: "Parent Agency / Company Name *",
      name: "affiliateName",
      error: errors.affiliateName,
    },
    {
      component: InputField,
      label: "Agency Name *",
      name: "agencyName",
      error: errors.agencyName,
    },
    {
      component: InputField,
      label: "Email *",
      name: "agencyEmail",
      error: errors.agencyEmail,
    },
    {
      component: InputField,
      label: "Name *",
      name: "personName",
      error: errors.personName,
    },
    {
      component: AppTextArea,
      label: "Office Address *",
      name: "address",
      error: errors.address,
    },
    {
      component: InputField,
      label: "Cell # *",
      name: "phoneNumber",
      type: "number",
      error: errors.phoneNumber,
    },
    {
      component: FormSelect,
      label: "City *",
      name: "city",
      options: cities,
      error: errors.city,
    },
    {
      component: FormSelect,
      label: "Consultant *",
      name: "consultant",
      options: CONSULTANTS,
      error: errors.consultant,
    },
    {
      component: InputField,
      label: "CNIC *",
      name: "cnic",
      type: "number",
      error: errors.cnic,
    },
    {
      component: InputField,
      label: "Designation *",
      name: "designation",
      error: errors.designation,
    },
    {
      component: FormSelect,
      label: "Country",
      name: "country",
      options: countries.map((c) => c.name),
      error: errors.country,
    },
    {
      component: FormSelect,
      label: "TimeZone",
      name: "timeZone",
      options: timeZones,
      error: errors.timeZone,
    },
    {
      component: FormSelect,
      label: "Default Currency",
      name: "defaultCurrency",
      options: ["USD", "EUR", "PKR", "RMB"],
      error: errors.defaultCurrency,
    },
    {
      component: FormSelect,
      label: "Currency",
      name: "currency",
      options: ["USD", "EUR", "PKR", "RMB"],
      error: errors.currency,
    },
    {
      component: InputField,
      label: "Number of staff can be added",
      name: "staffNumber",
      type: "number",
      error: errors.staffNumber,
    },
    {
      component: FormSelect,
      label: "Sales Channel *",
      name: "salesChannel",
      options: ["Online", "Offline"],
      error: errors.salesChannel,
    },
    {
      component: InputField,
      label: "PO Box Number",
      name: "poBoxNumber",
      error: errors.poBoxNumber,
      type: "number",
    },
    {
      component: FormSelect,
      label: "Affiliate Type *",
      name: "affiliateType",
      options: ["B2B", "B2C"],
      error: errors.affiliateType,
    },
    {
      component: FormSelect,
      label: "Agency Type *",
      name: "agencyType",
      options: agencyTypes.map((c) => ({ id: c._id, name: c.type })),
      error: errors.affiliateType,
    },
    {
      component: InputField,
      label: "AR Code",
      name: "arCode",
      error: errors.arCode,
    },
    {
      component: InputField,
      label: "Group AR Code",
      name: "groupArCode",
      error: errors.groupArCode,
    },
    {
      component: InputField,
      label: "Password *",
      name: "agencyPassword",
      error: errors.agencyPassword,
      type: showPassword ? "text" : "password",
      endDecorator: showPassword ? (
        <VisibilityIcon
          sx={{ cursor: "pointer" }}
          onClick={togglePasswordVisibility}
        />
      ) : (
        <VisibilityOffIcon
          sx={{ cursor: "pointer" }}
          onClick={togglePasswordVisibility}
        />
      ),
    },
    {
      component: InputField,
      label: "Confirm Password *",
      name: "agencyConfirmPassword",
      error: errors.agencyConfirmPassword,
      type: showPassword ? "text" : "password",
      endDecorator: showPassword ? (
        <VisibilityIcon
          sx={{ cursor: "pointer" }}
          onClick={togglePasswordVisibility}
        />
      ) : (
        <VisibilityOffIcon
          sx={{ cursor: "pointer" }}
          onClick={togglePasswordVisibility}
        />
      ),
    },
    {
      component: InputField,
      label: "DTN *",
      name: "DTN",
      type: "number",
      error: errors.DTN,
    },
    {
      component: InputField,
      label: "Cash Received *",
      name: "cashRecived",
      type: "number",
      error: errors.cashRecived,
    },
    {
      component: Checkbox,
      label: "Show Label",
      name: "showLabel",
    },
  ];

  useEffect(() => {
    agencyDetailsRef.current.showLabel = true;
  }, [])

  const renderAgencyForm = useMemo(
    () => (
      <div>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            marginBottom: 3,
          }}
        >
          {formFields.slice(0, 8).map(
            (
              { component: Field, label, name, options, error, placeholder, type, endDecorator },
              index
            ) => (
              <Box
                key={index}
                sx={{
                  flexBasis: name === "address" ? "100%" : "calc(50% - 16px)",
                  flexGrow: 1,
                  flexShrink: 0
                }}
              >
                <Field
                  label={label}
                  name={name}
                  options={options}
                  fullWidth
                  type={type}
                  onChange={handleInputChange}
                  error={error}
                  placeholder={placeholder}
                  endDecorator={endDecorator}
                />
              </Box>
            )
          )}
        </Box>
        <Divider sx={{ my: 3 }} />
        <TextHeading text="Additional Information" level="h5" />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            marginTop: 2,
            marginBottom: 3,
          }}
        >
          {formFields.slice(7).map(
            (
              { component: Field, label, name, options, error, placeholder, type, endDecorator },
              index
            ) => (
              <Box
                key={index}
                sx={{
                  flexBasis: "calc(33.333% - 16px)",
                  flexGrow: 0,
                  flexShrink: 0

                }}
              >
                {name === "showLabel" ? (
                  <Checkbox
                    label={label}
                    name={name}
                    onChange={(e) => handleInputChange(e, index)}
                    size="sm"
                    variant="solid"
                    sx={{ mt: '2.3em' }}
                    defaultChecked
                  />
                ) : (
                  <Field
                    label={label}
                    name={name}
                    options={options}
                    fullWidth
                    type={type}
                    onChange={handleInputChange}
                    error={error}
                    placeholder={placeholder}
                    endDecorator={endDecorator}
                  />
                )}
              </Box>
            )
          )}
        </Box>
        <Box mt={3}>
          <TextHeading text="Affiliate Documents" level="h5" />
          <Divider sx={{ mt: 2, mb: 2 }} />
          <Box>
            <AppButton
              text={agencyLogoName}
              type="file"
              variant="outlined"
              color="#fff"
              bgColor="#185ea5"
              onChange={handleAgencyLogoUpload}
              component="label"
              accept=".jpg, .jpeg, .png"
            />
          </Box>
          <Divider sx={{ mt: 2, mb: 2 }} />
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Box display="flex" flexDirection="column" gap={2}>
              {fileName.map((name, index) => (
                <Box key={index} display="flex" gap={2}>
                  <AppButton
                    text={name || "Upload File"}
                    type="file"
                    variant="outlined"
                    color="#fff"
                    bgColor="#185ea5"
                    onChange={(e) => handleInputChange(e, index)}
                    component="label"
                    multiple
                    accept=".jpg, .jpeg, .png, .pdf"
                  />
                  <AppButton
                    text=""
                    variant="outlined"
                    color="#fff"
                    bgColor="#fff"
                    borderColor="#fff"
                    onClick={() => handleFileDelete(index)}
                    startDecorator={<DeleteIcon sx={{ color: "#000", fontSize: '30px' }} />}
                  />
                </Box>
              ))}
              <Box display="flex" alignItems="center" mt={2}>
                <AppButton
                  text="Add Another File"
                  onClick={addFileUploadField}
                  variant="outlined"
                  width="250px"
                  color="#fff"
                  bgColor="#185ea5"
                  endDecorator={<AddIcon />} // Add "+" icon
                />
              </Box>
            </Box>
            <AppButton
              text="Add Agency"
              onClick={handleAddAgency}


              height="30px"
              disabled={loading}
            />
          </Box>
        </Box>
      </div>
    ),
    [fileName, formFields, handleInputChange]
  );

  return <Box sx={{ mt: 2, mb: 5 }}>{renderAgencyForm}</Box>;
};

export default AddAgency;
