import { Box, Grid, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";

export default function RoomsTable(props: { data: any }) {
  const columns: GridColDef[] = [
    {
      field: "college_name",
      headerName: "College",
      minWidth: 250,
    },
    {
      field: "building_name",
      headerName: "Building",
      minWidth: 250,
    },
    { field: "room_number", headerName: "Room #", minWidth: 80 },
    {
      field: "room_sqft",
      headerName: "Sq Ft",
      type: "number",
    },
    {
      field: "room_occ",
      description: "Occupancy",
      headerName: "Occ",
      type: "number",
    },
    {
      field: "room_numrooms",
      headerName: "# Rooms",
      type: "number",
    },
  ];

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Grid item xs={3} sx={{ textAlign: "center", width: "100%", px: 0 }}>
        <Typography
          variant="h4"
          fontWeight="medium"
          textAlign="center"
          color="primary"
          mt={4}
          mb={1}
        >
          All Available Rooms (2022-2023)
        </Typography>
        <Box height={"60vh"} width={"100%"} display="flex" mb={2}>
          <DataGrid
            components={{ Toolbar: GridToolbar }}
            getRowId={(row) => row._id}
            rows={props.data}
            columns={columns}
            pageSize={20}
            rowsPerPageOptions={[]}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
