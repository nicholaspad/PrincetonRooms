import {
  Box,
  Button,
  Container,
  Grid,
  LinearProgress,
  Modal,
  SvgIcon,
  Typography,
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import useSWR from "swr";

const Loading: NextPage = () => {
  return (
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
          <Box>
            <Typography variant="h5" marginBottom={5}>
              Loading...
            </Typography>
            <LinearProgress />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

const Error: NextPage = () => {
  return (
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
          <Box>
            <Typography variant="h5" marginBottom={2}>
              Oops! Something went wrong. Please contact the{" "}
              <a
                href="https://www.tigerapps.org/#about"
                style={{ color: "#2196f3", textDecoration: "underline" }}
                target="_blank"
              >
                TigerApps team
              </a>{" "}
              is this persists.
            </Typography>
            <SvgIcon color="error" fontSize="large">
              <ErrorIcon />
            </SvgIcon>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

const Home: NextPage = () => {
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data: data_, error } = useSWR("/api/get-room-reviews", fetcher);
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState("");
  const [title, setTitle] = useState("");
  const [data, setData] = useState();

  const handleOpen = (rev: string, title: string) => {
    setReview(rev);
    setTitle(title);
    setOpen(true);
  };
  const handleClose = () => {
    setReview("");
    setTitle("");
    setOpen(false);
  };

  useEffect(() => {
    setData(data_);
  }, [data_]);

  if (error) return <Error />;
  if (!data) return <Loading />;

  const columns: GridColDef[] = [
    { field: "building_name", headerName: "Building", flex: 1 },
    { field: "room_number", headerName: "Room #" },
    {
      field: "content",
      headerName: "Review",
      sortable: false,
      filterable: false,
      flex: 1,
      renderCell: (params: GridValueGetterParams) => (
        <Button
          onClick={() =>
            handleOpen(
              params.row.content,
              `${params.row.building_name} ${params.row.room_number}`
            )
          }
        >
          Open Review
        </Button>
      ),
    },
    {
      field: "room_sqft",
      headerName: "Sq Ft",
      type: "number",
    },
    {
      field: "room_bathroomtype",
      headerName: "Bathroom",
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
    {
      field: "room_floor",
      headerName: "Floor",
      type: "number",
    },
    {
      field: "room_subfree",
      headerName: "Sub Free",
    },
    { field: "date", headerName: "Date", type: "dateTime" },
  ];

  return (
    <>
      <Head>
        <title>Room Reviews</title>
      </Head>
      <Container maxWidth="lg">
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute" as "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              borderRadius: "3px",
              boxShadow: 24,
              pt: 2,
              px: 4,
              pb: 3,
            }}
          >
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
            <Typography sx={{ mt: 2 }}>{review}</Typography>
          </Box>
        </Modal>
        <Typography variant="h3" mt={5} textAlign="center" fontWeight="medium">
          Room Reviews
        </Typography>
        <Typography variant="subtitle1" mb={2} textAlign="center">
          The TigerApps team has recovered room review data from the now-defunct
          Rooms app. Click the <b>Filters</b> button below to begin!
          <br />
          <i>App design credit: Nicholas Padmanabhan '23</i>
        </Typography>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={3} sx={{ textAlign: "center" }}>
            <Box height={"80vh"} width={1100}>
              <DataGrid
                components={{ Toolbar: GridToolbar }}
                getRowId={(row) => row._id}
                rows={data}
                columns={columns}
                pageSize={20}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Home;
