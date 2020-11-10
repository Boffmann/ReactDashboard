import { Database } from "sqlite3";

var sqlite3 = require('sqlite3').verbose();

class DashboardDB {

    private static instance: DashboardDB;
    private databaseFile = "./src/backend/database/dashboard.db";

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
                    return;
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

    public DBQuerySET(query: string, args: (string|number)[]): Promise<void> {
        var promise = new Promise<void>((resolve, reject) => {
            this.openDB()
                .then((db: Database) => {
                    db.run(query, args, (err: Error) => {
                        if (err) {
                            console.error("Could not set table");
                            this.closeDB(db);
                            reject(err.message);
                            return;
                        }
                        this.closeDB(db);
                        resolve();
                        return;
                    });
                })
                .catch(err => {
                    console.error(err);
                    reject();
                })
            });
        return promise;
    }

    public DBQueryGET(query: string, args: (string|number)[]): Promise<string[]> {
        var promise = new Promise<string[]>((resolve, reject) => {
            this.openDB()
                .then((db: Database) => {
                    db.serialize(() => {
                        db.all(query, args, (err: Error, rows: string[]) => {
                            if (err) {
                                console.log("An error occured during database get");
                                console.error(err.message);
                                this.closeDB(db);
                                reject();
                                return;
                            }
                            console.log("Success getting from database");
                            this.closeDB(db);
                            resolve(rows);
                            return;
                        });
                    });
                })
                .catch(err => {
                    console.error(err);
                    reject();
                })
            });
        return promise;
    }
};

export default DashboardDB;