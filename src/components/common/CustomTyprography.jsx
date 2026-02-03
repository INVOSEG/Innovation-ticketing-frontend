import { Typography } from "@mui/joy";
import * as React from "react";

export default function CustomTypography({
  level,
  variant,
  fontSize,
  color,
  fontWeight,
  ...props
}) {
  const responsiveFontSize = {
    xs: fontSize?.xs || '0.65rem', 
    sm: fontSize?.sm || '0.775rem', 
    md: fontSize?.md || '0.8rem', 
    lg: fontSize?.lg || '0.9rem', 
    xl: fontSize?.xl || '1.2rem', 
  };

  return (
    <Typography
      level={level}
      variant={variant}
      fontSize={responsiveFontSize || fontSize}
      color={color || "#141f2b"}
      fontWeight={fontWeight}
      {...props}
    />
  );
}
