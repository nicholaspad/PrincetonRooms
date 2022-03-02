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
                rel="noreferrer"
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
    {
      field: "building_name",
      headerName: "Building",
      minWidth: 120,
      flex: 0.33,
    },
    { field: "room_number", headerName: "Room #", minWidth: 80, flex: 0.33 },
    {
      field: "content",
      headerName: "Review",
      sortable: false,
      filterable: false,
      minWidth: 110,
      flex: 0.33,
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
      <Container maxWidth="xl">
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
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={3} sx={{ textAlign: "center", width: "100%", px: 0 }}>
            <Typography
              variant="h3"
              mt={5}
              mb={1}
              textAlign="center"
              fontWeight="medium"
            >
              Room Reviews
            </Typography>
            <Typography
              variant="subtitle1"
              fontWeight="medium"
              textAlign="center"
            >
              The{" "}
              <a
                href="https://www.tigerapps.org/"
                style={{ color: "#2196f3", textDecoration: "underline" }}
                target="_blank"
                rel="noreferrer"
              >
                TigerApps team
              </a>{" "}
              has recovered room review data from the now-defunct Rooms app.
            </Typography>
            <Typography fontSize={16}>
              Click the <b>Filters</b> button below to begin! This web app is
              best experienced on desktop.
            </Typography>
            <Typography fontStyle="italic" fontSize={16} mt={1}>
              App design: Nicholas Padmanabhan &apos;23
            </Typography>
            <Typography fontStyle="italic" fontSize={16} mb={2}>
              Team: Shannon Heh &apos;23, Nicholas Padmanabhan &apos;23, Charles
              An &apos;22
            </Typography>
            <Box height={"60vh"} width={"100%"} display="flex" mb={2}>
              <DataGrid
                components={{ Toolbar: GridToolbar }}
                getRowId={(row) => row._id}
                rows={data}
                columns={columns}
                pageSize={20}
                rowsPerPageOptions={[]}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Home;
