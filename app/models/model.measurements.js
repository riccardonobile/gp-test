'use strict';

let mysql = require('../services/service.mysql'),
    format = require('string-template'),
    fs = require('fs');

let db = mysql.getConnection();

let insert = function (stationId, measurements, callback) {
    let query = fs.readFileSync('app/models/queries/measurements/query.insert.sql').toString();

    query = format(query, {
        stationId: db.escape(stationId),
        dateTime: db.escape(measurements.dateTime),
        xSpeed: db.escape(measurements.xSpeed),
        ySpeed: db.escape(measurements.ySpeed),
        zSpeed: db.escape(measurements.zSpeed)
    });

    db.query(query, function (err, rows) {
        callback(err, rows);
    });
};

module.exports = {
    insert
};