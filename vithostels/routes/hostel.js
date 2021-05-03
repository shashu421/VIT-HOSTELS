var express = require("express");
var router = express.Router();
var Hostel = require("../models/hostel");
var middleware = require("../middleware");
var NodeGeocoder = require("node-geocoder");
var options = {
  provider: "google",
  httpAdapter: "https",
  apiKey: process.env.GEO_CODE_API,
  formatter: null
};
// var geocoder = NodeGeocoder(options);
var multer = require("multer");
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function(req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
var upload = multer({
  storage: storage,
  fileFilter: imageFilter
});

var cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: 'dzsms0nne',
  api_key: '542159551497727',
  api_secret: 'yRkiZK6Gf4eNNhXqvrNI9WHFKM0',
});

var Fuse = require("fuse.js");

// INDEX - show all hostels
router.get("/", function(req, res) {
  var noMatch = null;
  if (req.query.search) {
    Hostel.find({}, function(err, allHostels) {
      if (err) {
        console.log(err);
      } else {        
        var options = {
          shouldSort: true,
          threshold: 0.5,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 2,
          keys: ["name", "location"]
        };
        var fuse = new Fuse(allHostels, options);
        var result = fuse.search(req.query.search);
        if (result.length < 1) {
          noMatch = req.query.search;
        }
        res.render("hostels/index", {
          hostels: result,
          noMatch: noMatch
        });
      }
    });
  } else if (req.query.sortby) {
    if (req.query.sortby === "rateAvg") {
      Hostel.find({})
        .sort({
          rateCount: -1,
          rateAvg: -1
        })
        .exec(function(err, allHostels) {
          if (err) {
            console.log(err);
          } else {
            res.render("hostels/index", {
              hostels: allHostels,
              currentUser: req.user,
              noMatch: noMatch
            });
          }
        });
    } else if (req.query.sortby === "rateCount") {
      Hostel.find({})
        .sort({
          rateCount: -1
        })
        .exec(function(err, allHostels) {
          if (err) {
            console.log(err);
          } else {
            res.render("hostels/index", {
              hostels: allHostels,
              currentUser: req.user,
              noMatch: noMatch
            });
          }
        });
    } else if (req.query.sortby === "priceLow") {
      Hostel.find({})
        .sort({
          price: 1,
          rateAvg: -1
        })
        .exec(function(err, allHostels) {
          if (err) {
            console.log(err);
          } else {
            res.render("hostels/index", {
              hostels: allHostels,
              currentUser: req.user,
              noMatch: noMatch
            });
          }
        });
    } else {
      Hostel.find({})
        .sort({
          price: -1,
          rateAvg: -1
        })
        .exec(function(err, allHostels) {
          if (err) {
            console.log(err);
          } else {
            res.render("hostels/index", {
              hostels: allHostels,
              currentUser: req.user,
              noMatch: noMatch
            });
          }
        });
    }
  } else {
    Hostel.find({}, function(err, allHostels) {
      if (err) {
        console.log(err);
      } else {
        res.render("hostels/index", {
          hostels: allHostels,
          currentUser: req.user,
          noMatch: noMatch
        });
      }
    });
  }
});

// CREATE - add new hostel to database
router.post("/", middleware.isLoggedIn, upload.single("image"), function(
  req,
  res
) {
  cloudinary.v2.uploader.upload(
    req.file.path,
    {
      width: 1500,
      height: 1000,
      crop: "scale"
    },
    function(err, result) {
      if (err) {
        req.flash("error", err.message);
        return res.render("error");
      }
      req.body.hostel.image = result.secure_url;
      req.body.hostel.imageId = result.public_id;
      req.body.hostel.booking = {
        start: req.body.hostel.start,
        end: req.body.hostel.end
      };
      req.body.hostel.tags = req.body.hostel.tags.split(",");
      req.body.hostel.author = {
        id: req.user._id,
        username: req.user.username
      };
        // if (err || !data.length) {
        //   console.log(err);
        //   req.flash("error", "Invalid address");
        //   return res.redirect("back");
        // }
        // req.body.campground.lat = data[0].latitude;
        // req.body.campground.lng = data[0].longitude;
        // req.body.campground.location = data[0].formattedAddress;
        Hostel.create(req.body.hostel, function(err, hostel) {
          if (err) {
            req.flash("error", err.message);
            return res.render("error");
          }
          res.redirect("/hostels");
        });
    },
    {
      moderation: "webpurify"
    }
  );
});

// NEW - show form to create new hostel
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("hostels/new");
});

// SHOW - shows more information about one hostel
router.get("/:id", function(req, res) {
  Hostel.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundHostel) {
      if (err || !foundHostel) {
        console.log(err);
        req.flash("error", "Sorry, that Hostel does not exist!");
        return res.render("error");
      }
      var ratingsArray = [];

      foundHostel.comments.forEach(function(rating) {
        ratingsArray.push(rating.rating);
      });
      if (ratingsArray.length === 0) {
        foundHostel.rateAvg = 0;
      } else {
        var ratings = ratingsArray.reduce(function(total, rating) {
          return total + rating;
        });
        foundHostel.rateAvg = ratings / foundHostel.comments.length;
        foundHostel.rateCount = foundHostel.comments.length;
      }
      foundHostel.save();
      res.render("hostels/show", {
        hostel: foundHostel
      });
    });
});

// EDIT Hostel ROUTE
router.get(
  "/:id/edit",
  middleware.isLoggedIn,
  middleware.checkHostelOwnership,
  function(req, res) {
    res.render("hostels/edit", {
      hostel: req.hostel
    });
  }
);

// UPDATE Hostel ROUTE
router.put(
  "/:id",
  upload.single("image"),
  middleware.checkHostelOwnership,
  function(req, res) {
    // geocoder.geocode(req.body.campground.location, function(err, data) {
    //   if (err || !data.length) {
    //     req.flash("error", "Invalid address");
    //     return res.redirect("back");
    //   }
    //   req.body.campground.lat = data[0].latitude;
    //   req.body.campground.lng = data[0].longitude;
    //   req.body.campground.location = data[0].formattedAddress;
      req.body.hostel.booking = {
        start: req.body.hostel.start,
        end: req.body.hostel.end
      };
      req.body.hostel.tags = req.body.hostel.tags.split(",");
      Hostel.findByIdAndUpdate(
        req.params.id,
        req.body.hostel,
        async function(err, hostel) {
          if (err) {
            req.flash("error", err.message);
            res.redirect("back");
          } else {
            if (req.file) {
              try {
                await cloudinary.v2.uploader.destroy(hostel.imageId);
                var result = await cloudinary.v2.uploader.upload(
                  req.file.path,
                  {
                    width: 1500,
                    height: 1000,
                    crop: "scale"
                  },
                  {
                    moderation: "webpurify"
                  }
                );
                hostel.imageId = result.public_id;
                hostel.image = result.secure_url;
              } catch (err) {
                req.flash("error", err.message);
                return res.render("error");
              }
            }
            hostel.save();
            req.flash("success", "Successfully updated your hostel!");
            res.redirect("/hostels/" + req.params.id);
          }
        }
      );
    // });
  }
);

// DESTROY Hostel ROUTE
router.delete("/:id", middleware.checkHostelOwnership, function(req, res) {
  Hostel.findById(req.params.id, async function(err, hostel) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    try {
      await cloudinary.v2.uploader.destroy(hostel.imageId);
      hostel.remove();
      res.redirect("/hostels");
    } catch (err) {
      if (err) {
        req.flash("error", err.message);
        return res.render("error");
      }
    }
  });
});

module.exports = router;
