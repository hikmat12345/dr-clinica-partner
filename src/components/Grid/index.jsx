import { Box } from "@mui/material";

import { StyledDataGrid } from "./grid.style";
import { DataGrid } from "@mui/x-data-grid";

const Grid = ({ gridData, gridColumns }) => {
  return (
    <Box className="dark:text-navy-50">
      <StyledDataGrid>
        <DataGrid
          isLoading={false}
          getRowId={(row) => row.mobileNumber + row.email}
          rows={gridData || []}
          columns={gridColumns}
          checkboxSelection
          GridColDef="center"
          getRowHeight={({ _id, densityFactor }) => 80 * densityFactor}
        />
      </StyledDataGrid>
    </Box>
  );
};

export default Grid;
