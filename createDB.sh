#!/bin/bash

dbFile='./src/database/dashboard.db'

if [ -f "$dbFile" ]; then
  echo "Database file already exists"
  echo "Deleting database file..."
  rm $dbFile
fi

echo "Creating new database..."
touch $dbFile
sqlite3 $dbFile "CREATE TABLE corona(timestamp, state, cases, weekIncidence, casesPer100k, death);"
echo "Done"
