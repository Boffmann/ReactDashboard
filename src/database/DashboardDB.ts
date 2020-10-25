import { rejects } from "assert";
import { promises } from "fs";
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

    private openDB(): Promise<Database> {
        var promise = new Promise<Database>((resolve, reject) => {
            var db = new sqlite3.Database(this.databaseFile, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err: Error) => {

                if (err) {
                    reject(err.message);
                }

                console.log('Connected to the database');

                resolve(db);

            });
        });

        return promise;
    }

    private closeDB(db: Database) {
        db.close((err: Error | null) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Close the database connection.');
        });
    }

    public DBQuerySET(query: string, args: string[]): Promise<void> {
        var promise = new Promise<void>((resolve, reject) => {
            mutex.lock('key', (err: Error, unlock: any) => {
                if (err) {
                    console.error(err);
                    console.error("Unable to aquire lock");
                    unlock();
                    reject();
                }

                this.openDB()
                    .then((db: Database) => {
                        db.run(query, args, (err: Error) => {
                            if (err) {
                                console.error("Could not set table");
                                unlock();
                                this.closeDB(db);
                                reject(err.message);
                            }
                            unlock();
                            this.closeDB(db);
                            resolve();
                        });
                    })
                    .catch(err => {
                        console.error(err);
                    })
            });
        });
        return promise;
    }

    public DBQueryGET(query: string, args: string[]): Promise<string[]> {
        var promise = new Promise<string[]>((resolve, reject) => {
            mutex.lock('key', (err: Error, unlock: any) => {
                if (err) {
                    console.error(err);
                    unlock();
                    reject("Unable to aquire Lock");
                }

                this.openDB()
                    .then((db: Database) => {
                        db.serialize(() => {
                            db.all(query, args, (err: Error, rows: string[]) => {
                                if (err) {
                                    console.log("An error occured during database get");
                                    console.error(err.message);
                                    unlock();
                                    this.closeDB(db);
                                    reject();
                                }
                                unlock();
                                console.log("Success getting from database");
                                this.closeDB(db);
                                resolve(rows);
                            });
                        });
                    })
                    .catch(err => {
                        console.error(err);
                    })
            });
        });
        return promise;
    }
};

export default DashboardDB;