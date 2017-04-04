'use strict';

var IndexModel = require('../models/index');

module.exports = function (router) {

    var model = new IndexModel();

    router.get('/', function (req, res) {
        console.log(res.locals);
        res.render('index');
    });
};
