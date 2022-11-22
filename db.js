import * as SQLite from "expo-sqlite";
const DATABASE_NAME = "calculadoraApp.sqlite";

const SQL_CREATE_ENTRIES = [
  `   CREATE TABLE IF NOT EXISTS calculos (
  id INTEGER PRIMARY KEY autoincrement,
  height numeric NOT NULL,
  mass numeric NOT NULL, 
  result numeric NOT NULL
  )`,
];

let _db = null;

export function executeSql(query, params = []) {
  if (!_db) {
    openDB();
  }

  return new Promise((resolve, reject) => {
    _db.transaction((tx) => {
      tx.executeSql(
        query,
        params,
        (_, rs) => resolve(rs),
        (_, err) => reject(err)
      );
    });
  });
}

export default function openDB() {
  if (!_db) {
    _db = SQLite.openDatabase(DATABASE_NAME);

    _db.transaction(
      (tx) => {
        SQL_CREATE_ENTRIES.map((query) => {
          tx.executeSql(query);
        });
      },
      (err) => console.warn(err),
      () => console.log(`Initialize dB`)
    );
  }

  return _db;
}
