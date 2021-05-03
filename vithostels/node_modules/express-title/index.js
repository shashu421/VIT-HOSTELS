module.exports = function(format) {
  format = format || '%title% · %base%';
  return function(req, res, next) {
    res.title = function(title) {
      res.locals.title = format;
      res.locals.title = res.locals.title.replace(/%title%/ig, title);
      res.locals.title = res.locals.title.replace(/%base%/ig, req.app.get('title'));
      return this;
    };
    next();
  };
};