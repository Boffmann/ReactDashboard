import Database from './DashboardDB'
import State from '../../common/state'
import Test from '../../common/test'
import { Console } from 'console';

// Get Queries
const getStateByTimeAndStateQuery = 'SELECT * FROM corona where timestamp = ? AND state = ?';
const getRecentStatesByStateQuery = 'SELECT * FROM corona where state = ? ORDER BY timestamp DESC LIMIT ?';

const getTestByYearAndKWQuery = "SELECT * FROM tests where year = ? AND kw = ?";

// Update Queries
const updateStateAtTimeAndStateQuery = 'UPDATE corona set cases = ?, weekIncidence = ?, casesPer100k = ?, death = ? WHERE timestamp = ? AND state = ?'
const updateTestAtYearAndKW = 'UPDATE tests set number = ?, positive = ?, ratio = ?, lab_num = ? WHERE year = ? AND kw = ?'

// Insert Queries
const insertStateQuery = 'INSERT INTO corona(timestamp, state, cases, weekIncidence, casesPer100k, death) VALUES(?, ?, ?, ?, ?, ?)';
const insertTestQuery = 'INSERT INTO tests(year, kw, number, positive, ratio, lab_num) VALUES(?, ?, ?, ?, ?, ?)';

// Get Functions

const Private = {

    insertState (state: State) {
        console.log("Inserting new State into database")
        Database.getInstance().DBQuerySET(insertStateQuery, [
                state.timestamp.toString(),
                state.name,
                state.count.toString(),
                state.weekIncidence.toString(),
                state.casesPer100k.toString(),
                state.deaths.toString()
        ])
        .catch(err => {
            console.log("Error updating Database");
            console.error(err);
        })
    }, 

    updateState (state: State) {
        console.log("Updating Database State")
        Database.getInstance().DBQuerySET(updateStateAtTimeAndStateQuery, [
            state.count.toString(),
            state.weekIncidence.toString(),
            state.casesPer100k.toString(),
            state.deaths.toString(),
            state.timestamp.toString(),
            state.name
        ])
        .catch(err => {
            console.log("Error updating Database");
            console.error(err);
        })
    },

    insertTest (test: Test) {
        console.log("Inserting new Test into database")
        Database.getInstance().DBQuerySET(insertTestQuery, [
            test.year.toString(),
            test.kw.toString(),
            test.number.toString(),
            test.positive.toString(),
            test.ratio.toString(),
            test.lab_num.toString()
        ])
        .catch(err => {
            console.log("Error updating Database");
            console.error(err);
        })
    },

    updateTest (test: Test) {
        console.log("Updating Database Test")
        Database.getInstance().DBQuerySET(updateStateAtTimeAndStateQuery, [
            test.number.toString(),
            test.positive.toString(),
            test.ratio.toString(),
            test.lab_num.toString(),
            test.year.toString(),
            test.kw.toString()
        ])
        .catch(err => {
            console.log("Error updating Database");
            console.error(err);
        })
    },
};

const CoronaDB = {

    getRecentStatesByName (state: string, number: string): Promise<string[]> {
        return Database.getInstance().DBQueryGET(getRecentStatesByStateQuery, [state, number]);
    },

    getStateByTimeAndName (timestamp: string, state: string): Promise<string[]> {
        return Database.getInstance().DBQueryGET(getStateByTimeAndStateQuery, [timestamp, state]);
    },

    getTestByYearAndKW (year: number, kw: number): Promise<string[]> {
        return Database.getInstance().DBQueryGET(getTestByYearAndKWQuery, [year.toString(), kw.toString()]);
    },

    // Insert Functions

    /**
     * Inserts a new row containing the state's corona infos.
     * If combined timestamp and state key already exists, this line gets updated
     * 
     * @param state  The state to insert/update
     */
    insertState (state: State) {

        const stateFound = state !== undefined && state !== null;

        if (stateFound) {
            Database.getInstance().DBQueryGET(getStateByTimeAndStateQuery, [state.timestamp.toString(), state.name])
                .then((rows: string[]) => {
                    if (rows.length !== 0) {
                        // Update
                        Private.updateState(state);
                    } else {
                        Private.insertState(state);
                    }
                })
                .catch(err => {
                    console.log("There was an error getting a row");
                    console.error(err);
                })
        } else {
            Private.insertState(state);
        }
    },

    insertTest (test: Test) {

        const testFound = test !== undefined && test !== null;

        if (testFound) {
            CoronaDB.getTestByYearAndKW(test.year, test.kw)
                .then((rows) => {
                    if (rows.length !== 0) {
                        Private.updateTest(test);
                    } else {
                        Private.insertTest(test);
                    }
                })
                .catch(err => {
                    console.log("Error whilye inserting test");
                    console.error(err);
                })
                
        } else {
            Private.insertTest(test);
        }
    }

}

export default CoronaDB;