const express = require("express");
const app = express();

const db = require("./database/db");

const errorHandlerMiddleware = require("./middlewares/errorHandler");

const authRoute = require("./routes/authRoute");
const startupRoute = require("./routes/startupRoute");
const taskRoute = require("./routes/taskRoute");

app.use(express.json());

app.use(authRoute);

app.use(startupRoute);

app.use(taskRoute);

app.use(errorHandlerMiddleware);

app.listen(3000, () => {
  console.log(`Server is listening on port 3000`);
});
