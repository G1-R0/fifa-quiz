require("./backend/configs/db"); // De Mysql connection die wordt aangemaakt bij het runnen van het project.
require("ejs");
const app = require("express")();

/**
 * Cors is de middleware dat wordt gebruikt bij ons project. Hierbij kunnen we zelf bepalen welke origins onze request kunnen gebruiken.
 * Dus niet alleen wanneer ze dezelfde ports hebben.
 */
const cors = require("cors");
app.use(cors());
const express = require("express");
const ejs = require("ejs"); // EJS import
app.use("/public", express.static("public"));

app.use(express.static("public"));
app.set("view engine", "ejs"); // EJS als view engine

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/quiz", (req, res) => {
  res.render("quiz");
});
app.get("/leaderboard", (req, res) => {
  res.render("leaderboard");
});
app.get("/favorite_leagues", (req, res) => {
  res.render("favorite_leagues");
});
app.get("/favorite_clubs", (req, res) => {
  res.render("favorite_clubs");
});
app.get("/blacklisted_clubs", (req, res) => {
  res.render("blacklisted_clubs");
});
/**
 * Dit zorgt ervoor dat json kan worden uitgelezen in de body van de requests.
 */
const bodyParser = require("express").json;
app.use(bodyParser());

/**
 * Dit zorgt ervoor dat de post request van de user js worden aangemaakt.
 */
const UserRouter = require("./backend/api/user");
app.use("/user", UserRouter);

/**
 * Laat de app runnen op de port 3000.
 */
app.listen(app.get("port"), () =>
  console.log("[server] http://localhost:" + app.get("port"))
);
app.set("port", process.env.PORT || 3001);
app.listen(app.get("port"), function () {});
app.listen(3000, () => {
  console.log("Fifa-Project-Backend server running..");
});
