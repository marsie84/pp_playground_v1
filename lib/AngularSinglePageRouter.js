'use strict'

module.exports = function setupJustServeTheAppEverywhere() {
   return function (req, res, next) {
      res.render('index');
   }
};
