const express = require("express");
const { json, urlencoded } = express;
const mongoose = require("mongoose");
const router = require("./src/routers/index.routes");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(json());
app.use(urlencoded({ extended: true }));

mongoose.connect(MONGODB_URI);
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
