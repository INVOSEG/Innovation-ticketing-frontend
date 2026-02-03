import React, { useRef, useCallback, useState } from "react";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import AppButton from "../../components/common/AppButton";
import TextHeading from "../../components/common/TextHeading";
import InputField from "../../components/common/InputField";
import FormSelect from "../../components/common/FormSelect";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Link from "@mui/joy/Link";
import Checkbox from "@mui/joy/Checkbox";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import IconButton, { iconButtonClasses } from "@mui/joy/IconButton";

const CommercialPlans = () => {
  const [selected, setSelected] = useState([]);
  const [commercialPlans, setCommercialPlans] = useState([]);
  const [errors, setErrors] = useState({});

  return (
    <>
      <Box px={2} mt={5}>
        <Box display="flex" justifyContent="space-between">
          <TextHeading text="Commercial Plans" level="h4" />
          <AppButton
            text="Add Plan"
            variant="solid"
            color="#fff"
            bgColor="#185ea5"
          // onClick={handleFlightBookingSearch}
          />
        </Box>

        <Divider sx={{ mt: 3 }} />

        <Box display="flex" justifyContent="space-between" mt={3}>
          <Box display="flex" gap={1}>
            <AppButton
              text="CSV"
              variant="outlined"
              color="#185ea5"
              bgColor="#185ea5"
            />
            <AppButton
              text="Excel"
              variant="outlined"
              color="#185ea5"
              bgColor="#185ea5"
            />
            <AppButton
              text="PDF"
              variant="outlined"
              color="#185ea5"
              bgColor="#185ea5"
            />
          </Box>
          <Box display="flex" gap={1}>
            <InputField placeholder="Search" size="sm" width="300px" />
          </Box>
        </Box>

        <Sheet
          className="OrderTableContainer"
          variant="outlined"
          sx={{
            display: { xs: "none", sm: "initial" },
            width: "100%",
            borderRadius: "sm",
            flexShrink: 1,
            overflow: "auto",
            minHeight: 0,
          }}
        >
          <Table
            aria-labelledby="tableTitle"
            // stickyHeader
            hoverRow
            sx={{
              "--TableCell-headBackground":
                "var(--joy-palette-background-level1)",
              "--Table-headerUnderlineThickness": "1px",
              "--TableRow-hoverBackground":
                "var(--joy-palette-background-level1)",
              "--TableCell-paddingY": "4px",
              "--TableCell-paddingX": "8px",
            }}
          >
            <thead>
              <tr>
                <th>
                  <Checkbox
                    size="sm"
                    indeterminate={
                      selected.length > 0 &&
                      selected.length !== commercialPlans.length
                    }
                    checked={selected.length === commercialPlans.length}
                    onChange={(event) =>
                      setSelected(
                        event.target.checked
                          ? commercialPlans.map((row) => row.id)
                          : []
                      )
                    }
                  />
                </th>
                <th>ID</th>
                <th>
                  <Link
                    underline="none"
                    color="primary"
                    onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                  >
                    Name
                  </Link>
                </th>
                <th>Updated By</th>
                <th>Updated On</th>
                <th>Status</th>
                <th>Action</th>
                <th />
              </tr>
            </thead>
            {commercialPlans.length > 0 && (
              <tbody>
                {stableSort(
                  commercialPlans,
                  getComparator(order, "userName")
                )?.map((row) => (
                  <tr key={row.agencyName}>
                    <td>
                      <Checkbox
                        size="sm"
                        checked={selected.includes(row.userName)}
                        onChange={(event) =>
                          setSelected(
                            event.target.checked
                              ? [...selected, row.userName]
                              : selected.filter((name) => name !== row.userName)
                          )
                        }
                      />
                    </td>
                    <td>{row.personName}</td>
                    <td>Active</td>
                    <td>{row?.availableLimit}</td>
                    <td>{row.country}</td>
                    <td>{row.groupArCode}</td>
                    <td>{row.agencyType}</td>
                    <td>{row.arCode}</td>
                    <td>
                      <RowMenu />
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </Table>
        </Sheet>

        <Box
          className="Pagination-laptopUp"
          sx={{ pt: 2, display: { xs: "none", md: "flex" } }}
        >
          <AppButton
            size="sm"
            width="120px"
            text="Previous"
            variant="outlined"
            color="#185ea5"
            bgColor="#185ea5"
            startDecorator={<KeyboardArrowLeftIcon />}
          />

          <Box sx={{ flex: 1 }} />

          <Box display="flex" gap={1}>
            {["1", "2", "3", "…", "8", "9", "10"].map((page) => (
              <IconButton
                key={page}
                size="sm"
                variant={Number(page) ? "outlined" : "plain"}
                sx={{
                  color: "#185ea5",
                  borderColor: "#185ea5",
                  borderWidth: 1,
                  "&:hover": {
                    backgroundColor: "#185ea5",
                    color: "#ffffff",
                    borderColor: "#185ea5",
                  },
                  backgroundColor: "transparent",
                }}
              >
                {page}
              </IconButton>
            ))}
          </Box>

          <Box sx={{ flex: 1 }} />
          <AppButton
            size="sm"
            width="120px"
            text="Next"
            variant="outlined"
            color="#185ea5"
            bgColor="#185ea5"
            endDecorator={<KeyboardArrowRightIcon />}
          />
        </Box>
      </Box>
    </>
  );
};

export default CommercialPlans;
