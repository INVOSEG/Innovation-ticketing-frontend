import React from "react";
import { Menu, MenuButton, MenuItem, Dropdown, IconButton } from "@mui/joy";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";

function RowMenu({ status }) {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: "plain", color: "neutral", size: "sm" } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem>{status === "ACTIVE" ? "InActive" : "Active"}</MenuItem>
      </Menu>
    </Dropdown>
  );
}

export default RowMenu;
