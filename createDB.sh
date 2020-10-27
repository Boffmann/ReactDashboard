#!/bin/bash

dbFile='./src/backend/database/dashboard.db'

if [ -f "$dbFile" ]; then
  echo "Database file already exists"
  echo "Deleting database file..."
  rm $dbFile
fi

echo "Creating new database..."
touch $dbFile
sqlite3 $dbFile "CREATE TABLE corona(timestamp, state, cases, weekIncidence, casesPer100k, death, RValue);"
sqlite3 $dbFile "CREATE TABLE tests(year, kw, number, positive, ratio, lab_num);"
echo "Done"
