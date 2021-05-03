require("dotenv").config();
var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Hostel = require("./models/hostel"),
  Comment = require("./models/comment"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  User = require("./models/user"),
  methodOverride = require("method-override"),
  flash = require("connect-flash");

// Requiring routes
var commentRoutes = require("./routes/comments"),
  hostelRoutes = require("./routes/hostel"),
  indexRoutes = require("./routes/index");

mongoose.connect(
  process.env.DATABASEURL,
  { useNewUrlParser: true }
);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIG
app.use(
  require("express-session")({
    secret: "shibas are the best dogs in the world.",
    resave: false,
    saveUninitialized: false
  })
);
app.locals.moment = require("moment");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/hostels", hostelRoutes);
app.use("/hostels/:id/comments", commentRoutes);

app.get("*", function(req, res) {
  res.render("error");
});

app.listen(process.env.PORT || 8000, function() {
  console.log("listening on http://localhost:8000/");
});
