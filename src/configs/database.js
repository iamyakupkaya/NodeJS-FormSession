const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log("Database connection is success"))
  .catch((err) => console.log("Database connection is unsuccessful", err));
