"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Table,
  Sheet,
  Button,
  Modal,
  ModalDialog,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Stack
} from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";

export default function HotelSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    price: "",
    distance: "",
    shutterService: false,
  });

  const [hotelData, setHotelData] = useState([
    {
      id: "1",
      name: "Haram Hotel",
      email: "haram@hotel.com",
      phone: "03001234567",
      price: "5000",
      distance: "20 KM",
      shutterService: "Available",
    },
    {
      id: "2",
      name: "Makkah Rides",
      email: "makkah@rides.com",
      phone: "03111234567",
      price: "7000",
      distance: "35 KM",
      shutterService: "Not Available",
    },
    {
      id: "2",
      name: "Makkah Rides",
      email: "makkah@rides.com",
      phone: "03111234567",
      price: "7000",
      distance: "35 KM",
      shutterService: "Not Available",
    },
    {
      id: "2",
      name: "Makkah Rides",
      email: "makkah@rides.com",
      phone: "03111234567",
      price: "7000",
      distance: "35 KM",
      shutterService: "Not Available",
    },
    {
      id: "2",
      name: "Makkah Rides",
      email: "makkah@rides.com",
      phone: "03111234567",
      price: "7000",
      distance: "35 KM",
      shutterService: "Not Available",
    },
    {
      id: "2",
      name: "Makkah Rides",
      email: "makkah@rides.com",
      phone: "03111234567",
      price: "7000",
      distance: "35 KM",
      shutterService: "Not Available",
    },
    {
      id: "2",
      name: "Makkah Rides",
      email: "makkah@rides.com",
      phone: "03111234567",
      price: "7000",
      distance: "35 KM",
      shutterService: "Not Available",
    },
    {
      id: "2",
      name: "Makkah Rides",
      email: "makkah@rides.com",
      phone: "03111234567",
      price: "7000",
      distance: "35 KM",
      shutterService: "Not Available",
    },
    {
      id: "2",
      name: "Makkah Rides",
      email: "makkah@rides.com",
      phone: "03111234567",
      price: "7000",
      distance: "35 KM",
      shutterService: "Not Available",
    },
    {
      id: "2",
      name: "Makkah Rides",
      email: "makkah@rides.com",
      phone: "03111234567",
      price: "7000",
      distance: "35 KM",
      shutterService: "Not Available",
    },
    {
      id: "2",
      name: "Makkah Rides",
      email: "makkah@rides.com",
      phone: "03111234567",
      price: "7000",
      distance: "35 KM",
      shutterService: "Not Available",
    },
    {
      id: "2",
      name: "Makkah Rides",
      email: "makkah@rides.com",
      phone: "03111234567",
      price: "7000",
      distance: "35 KM",
      shutterService: "Not Available",
    },
    {
      id: "2",
      name: "Makkah Rides",
      email: "makkah@rides.com",
      phone: "03111234567",
      price: "7000",
      distance: "35 KM",
      shutterService: "Not Available",
    },
    {
      id: "2",
      name: "Makkah Rides",
      email: "makkah@rides.com",
      phone: "03111234567",
      price: "7000",
      distance: "35 KM",
      shutterService: "Not Available",
    },
    {
      id: "2",
      name: "Makkah Rides",
      email: "makkah@rides.com",
      phone: "03111234567",
      price: "7000",
      distance: "35 KM",
      shutterService: "Not Available",
    },
  ]);

  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    const newHotel= {
      ...formData,
      id: (hotelData.length + 1).toString(),
      shutterService: formData.shutterService ? "Available" : "Not Available",
    };

    setHotelData((prev) => [...prev, newHotel]);
    setFormData({
      name: "",
      email: "",
      phone: "",
      price: "",
      distance: "",
      shutterService: false,
    });
    setModalOpen(false);
  };

  
  const renderModal = () => (
    <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
      <ModalDialog>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography level="h5">Add Hotel</Typography>
          <IconButton onClick={() => setModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Stack spacing={2}>
          <FormControl>
            <FormLabel>Hotel Name</FormLabel>
            <Input name="name" value={formData.name} onChange={handleInputChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input name="email" type="email" value={formData.email} onChange={handleInputChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Phone</FormLabel>
            <Input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Price</FormLabel>
            <Input name="price" type="number" value={formData.price} onChange={handleInputChange} />
          </FormControl>
          <FormControl>
            <FormLabel>Distance (KM)</FormLabel>
            <Input name="distance" type="text" value={formData.distance} onChange={handleInputChange} />
          </FormControl>
          <FormControl orientation="horizontal" sx={{ justifyContent: "space-between" }}>
            <FormLabel>Shutter Service</FormLabel>
            <Switch name="shutterService" checked={formData.shutterService} onChange={handleInputChange} />
          </FormControl>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Stack>
      </ModalDialog>
    </Modal>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography level="h4">Hotel Services</Typography>
        <Button onClick={() => setModalOpen(true)}>Add Hotel</Button>
      </Box>

      <Sheet variant="outlined">
        <Table sx={{ textAlign: "center",  "& td, & th": {
      textAlign: "center",
      padding: "12px", // equal padding for clean alignment
    },
    "& th": {
      verticalAlign: "middle", // align header text vertically
    },
    "& td": {
      verticalAlign: "middle", // align row text vertically
    },
     }}>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Price</th>
              <th>Distance</th>
              <th>Shutter Service</th>
            </tr>
          </thead>
          <tbody>
            {hotelData.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>{item.price}</td>
                <td>{item.distance}</td>
                <td>{item.shutterService}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>

      {renderModal()}
    </Box>
  );
}
