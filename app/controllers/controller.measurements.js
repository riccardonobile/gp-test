'use strict';

let unirest = require('unirest');

const checkApi = 'https://pw2017b.mvlabs.it/check';

let measurementsModel = require('../models/model.measurements');

let getAll = function(req, res) {
    measurementsModel.getAll(function(err, data) {
        if (err) {
            res.status(500).json({
                status: 'SQL Error'
            })
        } else {
            res.status(200).json({
                status: 'OK',
                data: data
            })
        }
    });
};

let insert = function(req, res) {
    req.checkParams('stationId', 'Invalid stationId').isInt({});
    req.checkBody('dateTime', 'Invalid dateTime').notEmpty().isDate();
    req.checkBody('x', 'Invalid xSpeed').notEmpty().isFloat();
    req.checkBody('y', 'Invalid YSpeed').notEmpty().isFloat();
    req.checkBody('z', 'Invalid xSpeed').notEmpty().isFloat();

    req.getValidationResult().then(function(errors) {
        if (!errors.isEmpty()) {
            errors = errors.mapped();
            res.status(400).json({
                errors: errors
            });
            return;
        }
        let stationId = req.params.stationId;

        let measurement = {
            dateTime: req.body.dateTime,
            xSpeed: req.body.x,
            ySpeed: req.body.y,
            zSpeed: req.body.z
        };

        unirest.get(checkApi + '/' + stationId).send().end(function (response) {
            if(response.statusType === 2 && response.body !== undefined) {
                let json = JSON.parse(response.body);
                if(json.working) {
                    measurementsModel.insert(stationId, measurement, function(err, data) {
                        if (err) {
                            console.log(err);
                            res.status(500).json({
                                status: 'SQL Error'
                            })
                        } else {
                            res.status(200).json({
                                status: 'OK',
                                stationId: stationId,
                                dateTime: measurement.dateTime,
                                xSpeed: measurement.xSpeed,
                                ySpeed: measurement.ySpeed,
                                zSpeed: measurement.zSpeed
                            })
                        }
                    })
                } else {
                    res.status(400).json({
                        status: 'Station not working',
                        stationId: stationId
                    })
                }
            } else {
                res.status(404).json({
                    status: 'Station not found',
                    stationId: stationId
                })
            }
        });
    });
};

module.exports = {
    getAll,
    insert
};