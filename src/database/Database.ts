import { sqlite3 } from "sqlite3";

var sqlite3 = require('sqlite3').verbose();
var mutex = require('node-mutex')();

class Database {

    private static instance: Database;
    private db: any;
    private databaseFile = "./database/dashboard.db";

    private constructor() { };


    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }

    public DBQuerySET(query: string, args: string[]): boolean {
        mutex.lock('key', (err: Error, unlock: any) => {
                if (err) {
                    console.error(err);
                    console.error("Unable to aquire lock");
                    unlock();
                    return false;
                }

                var db = new sqlite3.Database(this.databaseFile, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err: Error) => {

                    if (err) {
                        console.error(err.message);
                    }

                    console.log('Connected to the database');

                });

                db.run(query, args, (err: Error) => {
                    if (err) {
                        console.error(err.message);
                        console.error("Could not set table");
                        unlock();
                        return false;
                    }

                    unlock();
                    return true;
                });

                db.close((err: Error) => {
                    if (err) {
                        console.error(err.message);
                    }
                    console.log('Close the database connection.');
                });
                unlock();
            });

            return false;
    }

    public DBQueryGET(query: string, args: string[]): string[] {
        var result: string[] = [];
        
        mutex.lock('key', (err: Error, unlock: any) => {
            if (err) {
                console.error(err);
                console.error("Unable to aquire lock");
                unlock();
                return [];
            }
            var db = new sqlite3.Database(this.databaseFile, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err: Error) => {

                if (err) {
                    console.error(err.message);
                }

                console.log('Connected to the database');

            });

            db.serialize(() => {
                db.all(query, args, (err: Error, rows: string[]) => {
                    if (err) {
                        console.error(err.message);
                        unlock();
                        return [];
                    }
                    result = rows;
                });
            });

            db.close((err: Error) => {
                if (err) {
                    console.error(err.message);
                }
                console.log('Close the database connection.');
            });
            unlock();
        });

      return result;
    }
        

};

export default Database;