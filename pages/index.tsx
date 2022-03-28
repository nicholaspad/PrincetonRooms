import {
  Box,
  Container,
  Grid,
  LinearProgress,
  SvgIcon,
  Typography,
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import useSWR from "swr";
import ReviewsTable from "../components/ReviewsTable";
import RoomsTable from "../components/RoomsTable";

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
  const { data: dataReviews_, error: errorReviews } = useSWR(
    "/api/get-room-reviews",
    fetcher
  );
  const { data: dataRooms_, error: errorRooms } = useSWR(
    "/api/get-room-data",
    fetcher
  );

  const [dataReviews, setDataReviews] = useState();
  const [dataRooms, setDataRooms] = useState();

  useEffect(() => {
    setDataReviews(dataReviews_);
    setDataRooms(dataRooms_);
  }, [dataReviews_, dataRooms_]);

  if (errorReviews || errorRooms) return <Error />;
  if (!dataReviews) return <Loading />;

  return (
    <>
      <Head>
        <title>Rooms</title>
      </Head>
      <Container maxWidth="xl">
        <ReviewsTable data={dataReviews} />
        <RoomsTable data={dataRooms} />
      </Container>
    </>
  );
};

export default Home;
