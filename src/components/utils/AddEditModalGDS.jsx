import { Box, Button } from "@mui/joy";
import React, { useEffect, useState } from "react";
import InputField from "../common/InputField";
import AppTextArea from "../common/AppTextArea";
import axios from "axios";
import { NEXT_PUBLIC_PROD_URL } from "../../env";

const AddEditModalGDS = ({ type, gds, onClose }) => {
  const [newGds, setGds] = useState({
    code: "",
    title: "",
    description: "",
  });

  useEffect(() => {
    if (type === "Edit" && gds) {
      setGds(gds);
    } else {
      setGds({ code: "", title: "", description: "" });
    }
  }, [type, gds]);

  const handleChange = (name, value) => {
    setGds((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const AddEditGDS = async () => {
    try {
      if (type === "Add") {
        const response = await axios.post(
          `${NEXT_PUBLIC_PROD_URL}gds/create`,
          newGds
        );
        console.log(response);
      } else {
        const response = await axios.put(
          `${NEXT_PUBLIC_PROD_URL}gds/update/${gds._id}`,
          newGds
        );
        console.log(response);
      }
      onClose();
    } catch (err) {
      console.log("Failed to save GDS.", err);
    }
  };

  const getCode = async () => {
    if (!newGds.title) {
      console.log("Title is empty, cannot generate code.");
      return;
    }
    const code = newGds.title.charAt(0).toLowerCase();
    try {
      const response = await axios.get(
        `${NEXT_PUBLIC_PROD_URL}gds/code?title=${code}`
      );
      setGds((prevData) => ({
        ...prevData,
        code: response.data.result.nextCode,
      }));
    } catch (err) {
      console.log("Failed to fetch GDS code.", err);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: "20px", my: "20px" }}>
        <InputField
          label="Title"
          width="200px"
          value={newGds.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        <InputField
          label="Code"
          width="200px"
          value={newGds.code}
          readOnly
          onClick={getCode}
        />
      </Box>
      <AppTextArea
        label="Description"
        width="420px"
        minRows={6}
        value={newGds.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />
      <Button onClick={AddEditGDS} sx={{ my: "10px" }}>
        {type === "Add" ? "Add GDS" : "Update GDS"}
      </Button>
    </>
  );
};

export default AddEditModalGDS;
