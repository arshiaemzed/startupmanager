const express = require("express");
const app = express();

const db = require("./database/db");

const errorHandlerMiddleware = require("./middlewares/errorHandler");

const router = require("./routes/route");

app.use(express.json());

app.use(router);

app.use(errorHandlerMiddleware);

app.listen(3000, () => {
  console.log(`Server is listening on port 3000`);
});
