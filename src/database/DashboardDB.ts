import { Database } from "sqlite3";

var sqlite3 = require('sqlite3').verbose();
var mutex = require('node-mutex')();

class DashboardDB {

    private static instance: DashboardDB;
    private databaseFile = "./database/dashboard.db";

    private constructor() { };


    public static getInstance(): DashboardDB {
        if (!DashboardDB.instance) {
            DashboardDB.instance = new DashboardDB();
        }

        return DashboardDB.instance;
    }

    private openDB(callback: (db: Database) => void) {
        var db = new sqlite3.Database(this.databaseFile, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err: Error) => {

            if (err) {
                console.error(err.message);
            }

            console.log('Connected to the database');

            callback(db);

        });
    }

    private closeDB(db: Database) {
        db.close((err: Error | null) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Close the database connection.');
        });
    }

    public DBQuerySET(query: string, args: string[], callback?: (success: boolean) => void) {
        mutex.lock('key', (err: Error, unlock: any) => {
                if (err) {
                    console.error(err);
                    console.error("Unable to aquire lock");
                    unlock();
                    if (callback) callback(false);
                    return;
                }

                this.openDB((db: Database) => {
                    db.run(query, args, (err: Error) => {
                        if (err) {
                            console.error(err.message);
                            console.error("Could not set table");
                            unlock();
                            if(callback) callback(false);
                            this.closeDB(db);
                            return;
                        }

                        unlock();
                        if (callback) callback(true);
                        this.closeDB(db);
                        return true;
                    });
                });
                unlock();
            });

            return false;
    }

    public DBQueryGET(query: string, args: string[], callback: (rows: string[]) => void) {

        console.log("Getting db Query");
        
        mutex.lock('key', (err: Error, unlock: any) => {
            if (err) {
                console.log("Error aquireing lock");
                console.error(err);
                console.error("Unable to aquire lock");
                unlock();
                callback([]);
                return;
            }

            this.openDB((db: Database) => {
                db.serialize(() => {
                    db.all(query, args, (err: Error, rows: string[]) => {
                        if (err) {
                            console.log("An error occured during database get");
                            console.error(err.message);
                            unlock();
                            callback([]);
                            this.closeDB(db);
                            return;
                        }
                        unlock();
                        console.log("Success getting from database");
                        callback(rows);
                        this.closeDB(db);
                        return [];
                    });
                });
            });
            unlock();
        });
    }
        

};

export default DashboardDB;