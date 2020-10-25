"use strict";
exports.__esModule = true;
var sqlite3 = require('sqlite3').verbose();
var mutex = require('node-mutex')();
var Database = /** @class */ (function () {
    function Database() {
        this.databaseFile = "./database/dashboard.db";
    }
    ;
    Database.getInstance = function () {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    };
    Database.prototype.DBQuerySET = function (query, args) {
        var _this = this;
        mutex.lock('key', function (err, unlock) {
            if (err) {
                console.error(err);
                console.error("Unable to aquire lock");
                unlock();
                return false;
            }
            var db = new sqlite3.Database(_this.databaseFile, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, function (err) {
                if (err) {
                    console.error(err.message);
                }
                console.log('Connected to the database');
            });
            db.run(query, args, function (err) {
                if (err) {
                    console.error(err.message);
                    console.error("Could not set table");
                    unlock();
                    return false;
                }
                unlock();
                return true;
            });
            db.close(function (err) {
                if (err) {
                    console.error(err.message);
                }
                console.log('Close the database connection.');
            });
            unlock();
        });
        return false;
    };
    Database.prototype.DBQueryGET = function (query, args) {
        var _this = this;
        var result = [];
        mutex.lock('key', function (err, unlock) {
            if (err) {
                console.error(err);
                console.error("Unable to aquire lock");
                unlock();
                return [];
            }
            var db = new sqlite3.Database(_this.databaseFile, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, function (err) {
                if (err) {
                    console.error(err.message);
                }
                console.log('Connected to the database');
            });
            db.serialize(function () {
                db.all(query, args, function (err, rows) {
                    if (err) {
                        console.error(err.message);
                        unlock();
                        return [];
                    }
                    result = rows;
                });
            });
            db.close(function (err) {
                if (err) {
                    console.error(err.message);
                }
                console.log('Close the database connection.');
            });
            unlock();
        });
        return result;
    };
    return Database;
}());
;
exports["default"] = Database;
