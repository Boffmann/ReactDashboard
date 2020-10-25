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
var CoronaDB = {
    operateOnRowByTimeAndState: function (time, state, callback) {
        var resultRows = [];
        // Database.getInstance().openDB();
        DashboardDB_1["default"].getInstance().DBQueryGET(getRowByTimeAndStateQuery, [time, state], callback);
        // Database.getInstance().closeDB();
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
        var success = false;
        // Database.getInstance().openDB();
        // Check if row already in DB
        // Check if a state was found:
        var stateFound = state !== undefined && state !== null;
        if (stateFound) {
            DashboardDB_1["default"].getInstance().DBQueryGET(getRowByTimeAndStateQuery, [timestamp, state.name], function (rows) {
                if (rows.length !== 0) {
                    // Update
                    console.log("Updating Database");
                    success = DashboardDB_1["default"].getInstance().DBQuerySET(updateRowAtTimeAndStateQuery, [
                        state.count.toString(),
                        state.weekIncidence.toString(),
                        state.casesPer100k.toString(),
                        state.deaths.toString(),
                        timestamp,
                        state.name
                    ]);
                }
                else {
                    console.log("Inserting new Row into database");
                    success = DashboardDB_1["default"].getInstance().DBQuerySET(insertRowQuery, [
                        timestamp,
                        state.name,
                        state.count.toString(),
                        state.weekIncidence.toString(),
                        state.casesPer100k.toString(),
                        state.deaths.toString()
                    ]);
                }
            });
        }
        else {
            console.log("Inserting new Row into database");
            success = DashboardDB_1["default"].getInstance().DBQuerySET(insertRowQuery, [
                timestamp,
                state.name,
                state.count.toString(),
                state.weekIncidence.toString(),
                state.casesPer100k.toString(),
                state.deaths.toString()
            ]);
        }
        // Database.getInstance().closeDB();
        return success;
    }
};
exports["default"] = CoronaDB;
