'use strict';

let measurementsController = require('../controllers/controller.measurements');

module.exports = function(router) {
    router.get('/measurements', measurementsController.getAll);
    router.post('/measurements/:stationId', measurementsController.insert);

    return router;
};