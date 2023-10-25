import styled from "styled-components";
import { Box } from "@mui/material";

export const StyledDataGrid = styled(Box)(() => ({
  height: "60vh",
  marginTop: "20px",
  "& .MuiDataGrid-root": {
    border: "none",
    padding: "8px",
  },
  "& .MuiDataGrid-cell": {},
  "& .MuiDataGrid-row": {
    fontWeight: "500",
  },
  "& .MuiDataGrid-columnHeaders": {
    fontWeight: "bold",
  },
  "& .MuiSvgIcon-root": {
    color:
      window.localStorage.getItem("dark-mode") === "dark"
        ? "#e7e9ef"
        : "inherit",
  },
  "& .MuiToolbar-root": {
    color:
      window.localStorage.getItem("dark-mode") === "dark"
        ? "#e7e9ef"
        : "inherit",
  },
  "& .MuiDataGrid-virtualScroller": {
    cursor: "pointer",
  },
}));
