const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

// creating a Route

app.use("/home", (req, res) => {
  res.send("<h1>Hello Hemanth</h1>");
});

//
app.use(cors());

const googleMapsApiKey = "AIzaSyB2YGKBYF225rnp93MJmeoGfmHmLHa6n4U";

const getRoute = async (origin, destination) => {
  const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${googleMapsApiKey}`;

  try {
    const response = await axios.get(directionsUrl);
    const route = response.data.routes[0].legs[0].steps.map((step) => ({
      latitude: step.start_location.lat,
      longitude: step.start_location.lng,
    }));
    return route;
  } catch (error) {
    console.log("Error fetching directions:", error);
    return [];
  }
};

app.get("/vehicle-location", async (req, res) => {
  const date = req.query.data || "today";
  let route = [];

  if (date === "yesterday") {
    route = await getRoute(
      "17.760915716873455,83.35492834001421",
      "18.322819350414566, 82.8776923953577"
    );
  } else if (date === "this_week") {
    route = await getRoute(
      "18.111178471311153,83.4121651563087",
      "18.288158299794695, 83.91350578001266"
    );
  } else if (date === "today") {
    route = await getRoute(
      "18.11818229547285, 83.41781118186132",
      "17.760915716873455,83.35492834001421"
    );
  } else {
    route = [];
  }
  res.json(route);
});

app.listen(process.env.PORT, () => {
  console.log(`server is Running on ${process.env.PORT}`);
});

module.exports = app;
