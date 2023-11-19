const express = require("express");
const app = express();
const userRoutes = require("./routes/user_routes");
const bookRoutes = require("./routes/book_routes");
const recommendationRoutes = require("./routes/recommendation_routes");
const messageRoutes = require("./routes/message_routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/api/user", userRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/recommendation", recommendationRoutes);
app.use("/api/message", messageRoutes);

module.exports = app;
