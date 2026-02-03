import React, { useRef, useCallback, useState } from "react";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import AppButton from "../../components/common/AppButton";
import TextHeading from "../../components/common/TextHeading";
import FormCheckBox from "../../components/common/Checkbox";

const Migration = () => {
  return (
    <>
      <Box display="flex" flexDirection="column" gap={3} px={2} mt={5}>
        <Box>
          <TextHeading text="Migration Settings" level="h4" />
        </Box>
        <Divider />
        <FormCheckBox size="md" label="Migrate Commercial Flight Rule to V2" />

        <FormCheckBox size="md" label="Enable Flight Commercial Rule V2" />
        <TextHeading text="Once the flight commercial rule V2 is activated then the Flight Commercial Rule V1 can't be used unless this setting is deactivated" />
        <Divider />
        <Box display="flex" justifyContent="space-between">
          <Box></Box>
          <AppButton
            text="Save"
            variant="solid"
            color="#fff"
            bgColor="#185ea5"
          // onClick={handleFlightBookingSearch}
          />
        </Box>
      </Box>
    </>
  );
};

export default Migration;
