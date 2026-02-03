import React from "react";
import Typography from "@mui/joy/Typography";

const TextHeading = ({ text, level }) => {
  return <Typography level={level}>{text}</Typography>;
};

export default TextHeading;
