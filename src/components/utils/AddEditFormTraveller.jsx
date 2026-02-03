import { Box, Button, Option, Select, Typography } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import { countries } from '../../utils/DummyData'
import InputField from '../common/InputField'
import axios from 'axios'
import {NEXT_PUBLIC_PROD_URL} from "../../env"
const AddEditFormTraveller = ({ type, traveller, onClose }) => {
 const documentId = traveller?._id
    useEffect(() => {
        if (type === "Edit" && traveller) {
          setNewCustomer({ ...traveller });
          console.log(traveller)
          console.log(documentId, "id")
        }
      }, [type, traveller]);
  
  const [newCustomer, setNewCustomer] = useState({
    firstname: "",
    lastname: "",
    code: "",
    cnic: "",
    passportNumber: "",
    phoneNumber: "",
    email: "",
    dob: "",
    cnicExpiry: "",
    passportExpiry: "",
  });

  const handleNewCustomer = (key, value) => {
    if (!key || value === undefined) {
      console.error("Invalid field or value:", key, value);
      return;
    }
    setNewCustomer((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getCode = async () => {
    const firstNameInitial = newCustomer.firstname.charAt(0).toLowerCase();
    const lastNameInitial = newCustomer.lastname.charAt(0).toLowerCase();
    const customId = `${firstNameInitial}${lastNameInitial}`;
console.log("object")
    try {
      const response = await axios.get(`http://192.168.100.26:3002veller/code?prefix=${customId}`);
      console.log(response.data.result)
      setNewCustomer((prev) => ({
        ...prev,
        code: response.data.result.nextCode,
      }));
      if (response.data.length > 0) {
        alert("The generated code is already in use. Please try again.");
        return;
      }
    } catch (error) {
      console.error("Error checking code availability:", error);
      alert("Error checking code availability. Please try again.");
      return;
    }
  };


  const AddEditTraveller = async () => {
    if (!newCustomer.firstname) {
      alert("Please Enter First Name");
      return;
    }
    if (!newCustomer.lastname) {
      alert("Please Enter Last Name");
      return;
    }

    if (!newCustomer.dob) {
      alert("Please Enter Date of Birth");
      return;
    }
    if (!newCustomer.phoneNumber) {
      alert("Please Enter Phone Number");
      return;
    }
    if (newCustomer.phoneNumber.length !== 12) {
      alert("Please Enter 12 digit Phone Number");
      return;
    }
    if (!newCustomer.email) {
      alert("Please Enter Email");
      return;
    }
    if (!newCustomer.email.includes("@")) {
      alert("Please Follow Correct Email Format");
      return;
    }

    const isCNICEmpty = !newCustomer.cnic;
    const isPassportEmpty = !newCustomer.passportNumber;

    if (isCNICEmpty && isPassportEmpty) {
      alert("Please provide at least one: CNIC or Passport");
      return;
    }

    if (!isCNICEmpty) {
      if (newCustomer.cnic.length !== 13) {
        alert("CNIC must be exactly 13 characters long");
        return;
      }
      if (!newCustomer.cnicExpiry) {
        alert("Please provide CNIC Expiry Date");
        return;
      }
    }

    if (!isPassportEmpty) {
      if (newCustomer.passportNumber.length !== 9) {
        alert("Passport Number must be exactly 9 characters long");
        return;
      }
      if (!newCustomer.passportExpiry) {
        alert("Please provide Passport Expiry Date");
        return;
      }
    }

    const dataToSend = { ...newCustomer };

    try {
        if (type === 'Add') {
      const response = await axios.post(`http://192.168.100.26:3002veller/create`,dataToSend);
      console.log(response.data.result, "Traveller added successfully!");
      onClose();
    }else{
        editTraveller()
      }
    } catch (error) {
      console.error("Error adding traveller:", error);
      alert("There was an error adding the traveller.");
    }
  };

  const editTraveller = async () => {
    try {
      const response = await axios.put(`http://192.168.100.26:3002veller/update/${documentId}`, newCustomer);
      alert('Traveller updated successfully!');
      onClose();

    } catch (error) {
      console.error('Error updating traveller:', error);
      alert('Error updating traveller.');
    }
  };


// const handleSave = async () => {
//     if (!newCustomer.firstname || !newCustomer.lastname) {
//       alert('First Name and Last Name are required.');
//       return;
//     }

//     if (type === 'Add') {
//       await AddTraveller();
//     } else if (type === 'Edit') {
//       await editTraveller(traveller.id);
//     }

//     onClose();
//   };
  return (
    <>
      <Typography sx={{ fontSize: '28px', fontWeight: '800', my: '10px' }}>
        {type === 'Add' ? 'Add Traveller' : 'Edit Traveller'}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {[
          { label: 'First Name', key: 'firstname', type: 'text', placeholder: 'M.Usman' },
          { label: 'Last Name', key: 'lastname', type: 'text', placeholder: 'M.Iqbal' },
          { label: 'Code', key: 'code', type: 'text', placeholder: 'Code', readOnly: true, onClick : getCode },
          { label: 'CNIC', key: 'cnic', type: 'number', placeholder: '35***-*******-*' },
          { label: 'Passport', key: 'passportNumber', type: 'text', placeholder: 'PK*******' },
          { label: 'Phone', key: 'phoneNumber', type: 'number', placeholder: '92309*******' },
          { label: 'Email', key: 'email', type: 'email', placeholder: 'example@gmail.com' },
          { label: 'DOB', key: 'dob', type: 'date' },
          { label: 'CNIC Expiry Date', key: 'cnicExpiry', type: 'date' },
          { label: 'Passport Expiry Date', key: 'passportExpiry', type: 'date' },
        ].map(({ label, key, type, placeholder, ...rest }, index) => (
          <InputField
            key={index}
            label={label}
            type={type}
            placeholder={placeholder}
            width="300px"
            value={newCustomer[key] || ''}
            onChange={(e) => handleNewCustomer(key, e.target.value)}
            {...rest}
          />
        ))}

        <Select
          placeholder="Select Nationality"
          value={newCustomer.nationality || ''}
          onChange={(event, newValue) => handleNewCustomer('nationality', newValue)}
          sx={{ width: '300px' }}
        >
          {countries.map((country) => (
            <Option key={country} value={country}>
              {country}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Select Pax Type"
          value={newCustomer.paxType || ''}
          onChange={(event, newValue) => handleNewCustomer('paxType', newValue)}
          sx={{ width: '300px' }}
        >
          {['Adult', 'Child', 'Infant'].map((type) => (
            <Option key={type} value={type}>
              {type}
            </Option>
          ))}
        </Select>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button onClick={AddEditTraveller}>{type === 'Add' ? 'Add' : 'Edit'}</Button>
      </Box>
    </>
  )
}

export default AddEditFormTraveller
