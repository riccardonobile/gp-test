'use strict';

let measurementsController = require('../controllers/controller.measurements');

module.exports = function(router) {
    router.post('/measurements/:stationId', measurementsController.insert);

    return router;
};