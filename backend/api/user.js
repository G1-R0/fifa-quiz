const express = require("express");
const connection = require("../configs/db");
const router = express.Router();
var randomToken = require("random-token");

/**
 * Router zorgt ervoor dat de code in de functie wordt uigevoerd wanneer je een post request naar '/save' stuurt.
 */
router.post("/save", (req, res) => {
  const { name } = req.body; // Haalt 'name' uit de body. (json)
  if (name !== undefined) {
    // Checked of 'name' wel in de body zit.
    const token = randomToken(32); // Maakt een token aan met de npm 'random-token'.
    const sql = `INSERT INTO users VALUES ("${token}", "${name}", 0, "", "", "");`;
    connection.query(sql, function (err, result) {
      // Voert de bovenstaande query uit om users in de table te zetten.
      if (err) {
        // Geeft een 'failed' reactie terug omdat er een error is. (Kan vanalles zijn.)
        console.log(err)
        res.json({
          status: "FAILED",
          message: "Error while saving user",
        });
      } else {
        // Geeft een 'success' reactie terug, samen met de token van de user & de naam.
        res.json({
          status: "SUCCESS",
          message: "User has been saved",
          user: {
            token,
            name,
          },
        });
      }
    });
  } else {
    res.json({
      status: "FAILED",
      message: "Empty credentials supplied",
    });
  }
});

router.post("/getall", (req, res) => {
  const sql = "SELECT * FROM users";
  connection.query(sql, function (err, result) {
    // Voert de bovenstaande query uit om alle users uit een table te pakken.
    if (err) {
      // Geeft een 'failed' reactie terug omdat er een error is. (Kan vanalles zijn.)
      res.json({
        status: "FAILED",
        message: "Error while fetching users",
      });
    } else {
      const users = []; // Er wordt een nieuwe lijst gemaakt zodat niet alle informatie van elke user per request wordt teruggeven.
      result.forEach((us) =>
        users.push({
          id: us.id,
          name: us.name,
          highScore: us.highScore,
        })
      );
      res.json({
        status: "SUCCESS",
        message: "Users has been fetched",
        users: result,
      });
    }
  });
});

router.post("/get", (req, res) => {
  let session = req.headers.authorization; // Als de post request '/get' wordt uitgevoerd moet de user al geauthorized zijn. Vanaf dit het geval is zit er een token in de headers van elke request dat hij stuurt.
  if (session !== "") {
    const sql = "SELECT * FROM users WHERE id='" + session + "'";
    connection.query(sql, function (err, result) {
      // Voert de bovenstaande query uit om de user met de 'session' bovenaan te pakken.
      if (err) {
        // Geeft een 'failed' reactie terug omdat er een error is. (Kan vanalles zijn.)
        res.json({
          status: "FAILED",
          message: "Error while fetching users",
        });
      } else {
        if (result.length > 0) {
          // Checked of de hoeveelheid results meer is als 1. Zoniet is er geen persoon met de bovenstaande id.
          res.json({
            status: "SUCCESS",
            message: "Users has been fetched",
            user: result[0],
          });
        } else {
          res.json({
            status: "FAILED",
            message: "User is not authenticated",
          });
        }
      }
    });
  } else {
    res.json({
      status: "FAILED",
      message: "Empty credentials supplied",
    });
  }
});

router.post("/update", (req, res) => {
  const { score } = req.body;
  let session = req.headers.authorization; // Als de post request '/get' wordt uitgevoerd moet de user al geauthorized zijn. Vanaf dit het geval is zit er een token in de headers van elke request dat hij stuurt.
  if (session !== "") {
    const sql = "SELECT * FROM users WHERE id='" + session + "'";
    connection.query(sql, function (err, result) {
      if (err) {
        res.json({
          status: "FAILED",
          message: "Error while fetching users",
        });
      } else if (result[0].highScore < parseInt(score)) {
        const sql = "Update users set highScore='" + score + "' WHERE id='" + session + "'";
        connection.query(sql, function (err, result) {
          // Voert de bovenstaande query uit om de user met de 'session' bovenaan te pakken.
          if (err) {
            // Geeft een 'failed' reactie terug omdat er een error is. (Kan vanalles zijn.)
            res.json({
              status: "FAILED",
              message: "Error while fetching users",
            });
          } else {
            if (result.length > 0) {
              // Checked of de hoeveelheid results meer is als 1. Zoniet is er geen persoon met de bovenstaande id.
              res.json({
                status: "SUCCESS",
                message: "Users has been updated",
              });
            } else {
              res.json({
                status: "FAILED",
                message: "User is not authenticated",
              });
            }
          }
        });
      }
    })
  } else {
    res.json({
      status: "FAILED",
      message: "Empty credentials supplied",
    });
  }
});

router.post("/blacklistclub", (req, res) => {
  changeStatusLC(req, res, "blacklistedClubs")
});

router.post("/unblacklistclub", (req, res) => {
  changeStatusRLC(req, res, "blacklistedClubs")
});

router.post("/likeclub", (req, res) => {
  changeStatusLC(req, res, "favoriteClubs")
});

router.post("/unlikeclub", (req, res) => {
  changeStatusRLC(req, res, "favoriteClubs")
});

router.post("/likeleague", (req, res) => {
  changeStatusLC(req, res, "favoriteLeagues")
});

router.post("/unlikeleague", (req, res) => {
  changeStatusRLC(req, res, "favoriteLeagues")
});

function changeStatusLC(req, res, state) {
  const { club } = req.body;
  let session = req.headers.authorization; // Als de post request '/get' wordt uitgevoerd moet de user al geauthorized zijn. Vanaf dit het geval is zit er een token in de headers van elke request dat hij stuurt.
  if (session !== "") {
    const sql = "SELECT * FROM users WHERE id='" + session + "'";
    connection.query(sql, function (err, result) {
      if (err) {
        res.json({
          status: "FAILED",
          message: "Error while fetching users",
        });
      } else {
        const sql = "Update users set " + state + "=CONCAT(" + state + ", \"" + club + ",\") WHERE id='" + session + "'";
        // Deze querie linkt je huidige user aan de geblackliste clubs zodat je deze kan opslaan.
        connection.query(sql, function (err, result) {
          // Voert de bovenstaande query uit om de user met de 'session' bovenaan te pakken.
          if (err) {
            // Geeft een 'failed' reactie terug omdat er een error is. (Kan vanalles zijn.)
            res.json({
              status: "FAILED",
              message: "Error while fetching users",
            });
          } else {
            // Checked of de hoeveelheid results meer is als 1. Zoniet is er geen persoon met de bovenstaande id.
            res.json({
              status: "SUCCESS",
              message: "Users has been updated",
            });
          }
        });
      }
    })
  } else {
    res.json({
      status: "FAILED",
      message: "Empty credentials supplied",
    });
  }
}

function changeStatusRLC(req, res, state) {
  const { club } = req.body;
  let session = req.headers.authorization; // Als de post request '/get' wordt uitgevoerd moet de user al geauthorized zijn. Vanaf dit het geval is zit er een token in de headers van elke request dat hij stuurt.
  if (session !== "") {
    const sql = "SELECT * FROM users WHERE id='" + session + "'";
    connection.query(sql, function (err, result) {
      if (err) {
        res.json({
          status: "FAILED",
          message: "Error while fetching users",
        });
      } else {
        const sql = "Update users set " + state + "=REPLACE(" + state + ", \"" + club + ",\", \"\") WHERE id='" + session + "'";
        // Deze querie linkt je huidige user aan de geblackliste clubs zodat je deze kan opslaan.
        connection.query(sql, function (err, result) {
          // Voert de bovenstaande query uit om de user met de 'session' bovenaan te pakken.
          if (err) {
            // Geeft een 'failed' reactie terug omdat er een error is. (Kan vanalles zijn.)
            console.log(err)
            res.json({
              status: "FAILED",
              message: "Error while fetching users",
            });
          } else {
            res.json({
              status: "SUCCESS",
              message: "Users has been updated",
            });

          }
        });
      }
    })
  } else {
    res.json({
      status: "FAILED",
      message: "Empty credentials supplied",
    });
  }
}

module.exports = router; // Returned de router met de aangemaakte post request.
