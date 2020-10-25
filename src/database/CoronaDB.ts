import Database from './Database'
import State from '../server/state'

// Get Queries
const getRowByTimeAndStateQuery = 'SELECT * FROM corona where timestamp = ? AND state = ?';

// Update Queries
const updateRowAtTimeAndStateQuery = 'UPDATE corona set cases = ?, weekIncidence = ?, casesPer100k = ?, death = ? WHERE timestamp = ? AND state = ?'

// Insert Queries
const insertRowQuery = 'INSERT INTO corona(timestamp, state, cases, weekIncidence, casesPer100k, death) VALUES(?, ?, ?, ?, ?, ?)';

// Get Functions

const CoronaDB = {

    getRowByTimeAndState(time: string, state: string): string[] {
        var resultRows: string[] = []

        // Database.getInstance().openDB();
        resultRows = Database.getInstance().DBQueryGET(getRowByTimeAndStateQuery, [time, state]);
        // Database.getInstance().closeDB();

        return resultRows;
    },

    // Insert Functions

    /**
     * Inserts a new row containing the state's corona infos.
     * If combined timestamp and state key already exists, this line gets updated
     * 
     * @param timestamp: The timestamp for the corona cases
     * @param state  The state to insert/update
     */
    insertRowByTimeAndState (timestamp: string, state: State): boolean {
        var success: boolean = false;

        // Database.getInstance().openDB();
        // Check if row already in DB
        // Check if a state was found:
        const stateFound = state !== undefined && state !== null;
        var resultRows: string[] = [];

        if (stateFound) {
            resultRows = Database.getInstance().DBQueryGET(getRowByTimeAndStateQuery, [timestamp, state.name]);
        }
        if (resultRows.length !== 0) {
            // Update
            console.log("Updating Database")
            success = Database.getInstance().DBQuerySET(updateRowAtTimeAndStateQuery, [
                state.count.toString(),
                state.weekIncidence.toString(),
                state.casesPer100k.toString(),
                state.deaths.toString(),
                timestamp,
                state.name
            ]);
        } else {
            console.log("Inserting new Row into database")
            success = Database.getInstance().DBQuerySET(insertRowQuery, [
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

}

export default CoronaDB;