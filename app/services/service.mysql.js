'use strict';

let mysql = require('mysql2');

let pool;

let createPool = function(dbConfig) {
    pool = mysql.createPool(dbConfig);
};

exports.createPool = createPool;

exports.getConnection = function() {
    return pool;
};
