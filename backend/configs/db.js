// Met behulp van: https://www.w3schools.com/nodejs/nodejs_mysql.asp

var mysql = require("mysql");

/**
 * Hier worden de MySQL details van de XAMPP host ingezet.
 * Xampp: Het programma voor onze locale MySQL.
 * 
 * Note: Er is nog een kleine bug hier waardoor de database de eerste keer niet wordt aangemaakt.
 *       Gaat worden gefixt bij volgende labo.
 */
var connection = mysql.createConnection({
  host: "remotemysql.com",
  user: "Pjnq4M6HaR",
  password: "vpMbE4SltG",
  database: "Pjnq4M6HaR",
});

/**
 * Hier wordt er connectie gemaakt met deze MySQL.
 */
connection.connect(function (err) {
  if (err) console.log("Fifa-Project-Backend mysql crashed.."); // Deze line wordt uigevoerd wanneer er een fout is. (Meestal verkeerde MySQL details.)
  console.log("Fifa-Project-Backend mysql running..");
  // Line 23 - 29 is de database die wordt aangemaakt.
  connection.query(
    "CREATE DATABASE IF NOT EXISTS fifaProject",
    function (err, result) {
      if (err) console.log("Fifa-Project-Backend mysql crashed..");
      console.log("Fifa-Project-Backend mysql created database: 'fifaProject'");
    }
  );
  require("../models/usermodel");
});

module.exports = connection;
