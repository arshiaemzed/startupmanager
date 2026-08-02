const express = require("express");
const app = express();
const db = require("./database/db");
const errorHandlerMiddleware = require("./middlewares/errorHandler");
const config = require("./configuration/env");
const authRoute = require("./routes/authRoute");
const startupRoute = require("./routes/startupRoute");
const taskRoute = require("./routes/taskRoute");
const inviteRoute = require("./routes/inviteRoute");
const memberManagmentRoute = require("./routes/memberManagmentRoute");
const helmet = require("helmet");

app.use(helmet());
app.use(express.json({ limit: "100kb" }));

app.use(memberManagmentRoute);

app.use(authRoute);

app.use(startupRoute);

app.use(taskRoute);

app.use(inviteRoute);

app.use(errorHandlerMiddleware);

module.exports = app;
