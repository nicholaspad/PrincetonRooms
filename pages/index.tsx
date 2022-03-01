import { Box, Container, Grid, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import type { NextPage } from "next";
import Head from "next/head";
import useSWR from "swr";

const columns: GridColDef[] = [
  { field: "building_name", headerName: "Building", minWidth: 130 },
  { field: "room_number", headerName: "Room #", width: 70 },
  {
    field: "room_sqft",
    headerName: "Sq Ft",
    type: "number",
    width: 70,
  },
  {
    field: "room_bathroomtype",
    headerName: "Bathroom",
    width: 90,
  },
  {
    field: "room_occ",
    headerName: "Occ",
    type: "number",
    width: 70,
  },
  {
    field: "room_numrooms",
    headerName: "# Rooms",
    type: "number",
    width: 70,
  },
  {
    field: "room_floor",
    headerName: "Floor",
    type: "number",
    width: 70,
  },
  {
    field: "room_subfree",
    headerName: "Sub Free",
    width: 70,
  },
  { field: "date", headerName: "Date", type: "dateTime", width: 100 },
  {
    field: "content",
    headerName: "Review",
    sortable: false,
    width: 1000,
    renderCell: (params: GridValueGetterParams) => (
      <Typography fontSize={14}>{params.row.content}</Typography>
    ),
  },
];

const Home: NextPage = () => {
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data, error } = useSWR("/api/get-room-reviews", fetcher);

  if (!data) return <div>loading</div>;
  if (error) return <div>error</div>;

  return (
    <>
      <Head>
        <title>Room Reviews</title>
      </Head>
      <Container maxWidth="lg">
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid item xs={3} sx={{ textAlign: "center" }}>
            <Box height={"80vh"} width={1000}>
              <DataGrid
                getRowId={(row) => row._id}
                rows={data}
                columns={columns}
                pageSize={25}
                rowsPerPageOptions={[5, 10]}
                sx={{
                  "& .MuiDataGrid-columnHeaderTitle": {
                    textOverflow: "clip",
                    whiteSpace: "break-spaces",
                    lineHeight: 1,
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Home;
