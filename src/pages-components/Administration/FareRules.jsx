import React, { useRef } from "react";
import FormSelect from "../../components/common/FormSelect";
import { Box } from "@mui/joy";
import InputField from "../../components/common/InputField";


const FareRules = () => {

    const fareRules = useRef({});

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        fareRules.current[name] = value;
    }



    return (
        <Box>
            <InputField name="ruleName" label="Enter Rule Name" onChange={handleInputChange} />
            <FormSelect name="apiName" label="Select Api" options={["Sabre", "Amadaeus"]} onChange={handleInputChange} />
            <InputField name="flightsCode" label="Enter Flight Comma Seprated" onChange={handleInputChange} />
            <FormSelect name="markUpType" label="Select Markup Type" options={["Fixed", "Percentage"]} onChange={handleInputChange} />
            <InputField name="markUpValue" label="Enter Markup Value" onChange={handleInputChange} />



        </Box>

    )
}

export default FareRules