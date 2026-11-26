require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

// Database
var connectDB = require("./config/db");

// Routes
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var universitiesRouter = require("./routes/universities");
var recommendationsRouter = require("./routes/recommendations");

var app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: "http://localhost:3000"
}));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/universities", universitiesRouter);
app.use("/api/recommendations", recommendationsRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
