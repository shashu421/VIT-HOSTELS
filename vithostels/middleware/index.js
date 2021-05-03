var Hostel = require("../models/hostel");
var Comment = require("../models/comment");
var User = require("../models/user");
var middlewareObj = {};


middlewareObj.checkHostelOwnership = function(req, res, next) {
  Hostel.findById(req.params.id, function(err, foundHostel) {
    if (err || !foundHostel) {
      req.flash("error", "Sorry, that hostel does not exist!");
      res.redirect("/hostels");
    } else if (
      foundHostel.author.id.equals(req.user._id) ||
      req.user.isAdmin
    ) {
      req.hostel = foundHostel;
      next();
    } else {
      req.flash("error", "You don't have permission to do that!");
      res.redirect("/hostels/" + req.params.id);
    }
  });
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if (err || !foundComment) {
      req.flash("error", "Sorry, that comment does not exist!");
      res.redirect("/hostels");
    } else if (
      foundComment.author.id.equals(req.user._id) ||
      req.user.isAdmin
    ) {
      req.comment = foundComment;
      next();
    } else {
      req.flash("error", "You don't have permission to do that!");
      res.redirect("/hostels/" + req.params.id);
    }
  });
};

middlewareObj.checkProfileOwnership = function(req, res, next) {
  User.findById(req.params.user_id, function(err, foundUser) {
    if (err || !foundUser) {
      req.flash("error", "Sorry, that user doesn't exist");
      res.redirect("/hostels");
    } else if (foundUser._id.equals(req.user._id) || req.user.isAdmin) {
      req.user = foundUser;
      next();
    } else {
      req.flash("error", "You don't have permission to do that!");
      res.redirect("/hostels/" + req.params.user_id);
    }
  });
};

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to do that!");
  res.redirect("/login");
};




module.exports = middlewareObj;
