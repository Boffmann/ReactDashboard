import Database from './DashboardDB'
import State from '../../common/state'

// Get Queries
const getRowByTimeAndStateQuery = 'SELECT * FROM corona where timestamp = ? AND state = ?';

// Update Queries
const updateRowAtTimeAndStateQuery = 'UPDATE corona set cases = ?, weekIncidence = ?, casesPer100k = ?, death = ? WHERE timestamp = ? AND state = ?'

// Insert Queries
const insertRowQuery = 'INSERT INTO corona(timestamp, state, cases, weekIncidence, casesPer100k, death) VALUES(?, ?, ?, ?, ?, ?)';

// Get Functions

const Private = {

    insertState (timestamp: string, state: State) {
        console.log("Inserting new Row into database")
        Database.getInstance().DBQuerySET(insertRowQuery, [
                timestamp,
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

    updateRow (timestamp: string, state: State) {
        console.log("Updating Database")
        Database.getInstance().DBQuerySET(updateRowAtTimeAndStateQuery, [
            state.count.toString(),
            state.weekIncidence.toString(),
            state.casesPer100k.toString(),
            state.deaths.toString(),
            timestamp,
            state.name
        ])
        .catch(err => {
            console.log("Error updating Database");
            console.error(err);
        })
    }
};

const CoronaDB = {

    getRowByTimeAndState (timestamp: string, state: string): Promise<string[]> {
        return Database.getInstance().DBQueryGET(getRowByTimeAndStateQuery, [timestamp, state]);
    },

    // Insert Functions

    /**
     * Inserts a new row containing the state's corona infos.
     * If combined timestamp and state key already exists, this line gets updated
     * 
     * @param timestamp: The timestamp for the corona cases
     * @param state  The state to insert/update
     */
    insertRowByTimeAndState (timestamp: string, state: State) {

        const stateFound = state !== undefined && state !== null;

        if (stateFound) {
            Database.getInstance().DBQueryGET(getRowByTimeAndStateQuery, [timestamp, state.name])
                .then((rows: string[]) => {
                    if (rows.length !== 0) {
                        // Update
                        Private.updateRow(timestamp, state);
                    } else {
                        Private.insertState(timestamp, state);
                    }
                })
                .catch(err => {
                    console.log("There was an error getting a row");
                    console.error(err);
                })
        } else {
            Private.insertState(timestamp, state);
        }
    }

}

export default CoronaDB;