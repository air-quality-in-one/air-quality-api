module.exports = {
  '/': {
    get: function(req, res, next) {
      res.send(200, "Welcome!");
      return next();
    }
  },
  '/health': {
    get: function(req, res, next) {
      res.send("Welcome! All is well!");
      return next();
    }
  }
};