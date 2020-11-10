#!/bin/bash

dbFile='./src/backend/database/dashboard.db'

if [ -f "$dbFile" ]; then
  echo "Database file already exists"
  echo "Deleting database file..."
  rm $dbFile
fi

echo "Creating new database..."
touch $dbFile
sqlite3 $dbFile "CREATE TABLE corona(timestamp, name, count, weekIncidence, casesPer100k, deaths, RValue);"
sqlite3 $dbFile "CREATE TABLE tests(year, kw, number, positive, ratio, lab_num);"
echo "Done"
