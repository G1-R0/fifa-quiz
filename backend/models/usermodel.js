const connection = require("../configs/db"); // De Mysql connection die wordt aangemaakt bij het runnen van het project.

/**
 * Hier wordt een query uitgevoerd bij het runnen van het project.
 * Dit is om de table Users aan te maken.
 */
const sql = "CREATE TABLE IF NOT EXISTS users " +
    "(id VARCHAR(32) NOT NULL, " +
    "name VARCHAR(32), " +
    "highScore INT(10) UNSIGNED, " +
    "blacklistedClubs VARCHAR(255), " +
    "favoriteClubs VARCHAR(255), " +
    "favoriteLeagues VARCHAR(255), " +
    "PRIMARY KEY (id));";
connection.query(sql, function (err, result) {
    if (err)
        console.log("Fifa-Project-Backend mysql crashed..");
    else console.log("Fifa-Project-Backend database created table: 'users'");
});