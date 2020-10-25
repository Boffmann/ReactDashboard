"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var DashboardDB_1 = __importDefault(require("./DashboardDB"));
// Get Queries
var getRowByTimeAndStateQuery = 'SELECT * FROM corona where timestamp = ? AND state = ?';
// Update Queries
var updateRowAtTimeAndStateQuery = 'UPDATE corona set cases = ?, weekIncidence = ?, casesPer100k = ?, death = ? WHERE timestamp = ? AND state = ?';
// Insert Queries
var insertRowQuery = 'INSERT INTO corona(timestamp, state, cases, weekIncidence, casesPer100k, death) VALUES(?, ?, ?, ?, ?, ?)';
// Get Functions
var Private = {
    insertState: function (timestamp, state) {
        console.log("Inserting new Row into database");
        DashboardDB_1["default"].getInstance().DBQuerySET(insertRowQuery, [
            timestamp,
            state.name,
            state.count.toString(),
            state.weekIncidence.toString(),
            state.casesPer100k.toString(),
            state.deaths.toString()
        ])["catch"](function (err) {
            console.log("Error updating Database");
            console.error(err);
        });
    },
    updateRow: function (timestamp, state) {
        console.log("Updating Database");
        DashboardDB_1["default"].getInstance().DBQuerySET(updateRowAtTimeAndStateQuery, [
            state.count.toString(),
            state.weekIncidence.toString(),
            state.casesPer100k.toString(),
            state.deaths.toString(),
            timestamp,
            state.name
        ])["catch"](function (err) {
            console.log("Error updating Database");
            console.error(err);
        });
    }
};
var CoronaDB = {
    getRowByTimeAndState: function (timestamp, state) {
        return DashboardDB_1["default"].getInstance().DBQueryGET(getRowByTimeAndStateQuery, [timestamp, state]);
    },
    // Insert Functions
    /**
     * Inserts a new row containing the state's corona infos.
     * If combined timestamp and state key already exists, this line gets updated
     *
     * @param timestamp: The timestamp for the corona cases
     * @param state  The state to insert/update
     */
    insertRowByTimeAndState: function (timestamp, state) {
        var stateFound = state !== undefined && state !== null;
        if (stateFound) {
            DashboardDB_1["default"].getInstance().DBQueryGET(getRowByTimeAndStateQuery, [timestamp, state.name])
                .then(function (rows) {
                if (rows.length !== 0) {
                    // Update
                    Private.updateRow(timestamp, state);
                }
                else {
                    Private.insertState(timestamp, state);
                }
            })["catch"](function (err) {
                console.log("There was an error getting a row");
                console.error(err);
            });
        }
        else {
            Private.insertState(timestamp, state);
        }
    }
};
exports["default"] = CoronaDB;
