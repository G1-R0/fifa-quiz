import { blacklistClub, likeClub, likeLeague, updateUser } from "../api/userActions.js";

let score = 0;
let leaguesAmount = 1;
let clubsAmount = 1;
let tokenAmount = 0;
let currentName = "";
let clubQuestion = true;

const tokens = [
  "ab5195e0-4d2f-43e2-ba6a-80cd57c641b3",
  "5af56245-7245-42cb-b404-ad2b8384f437",
  "e1745e1b-50f5-4a14-96a3-e99f58f4cf7c",
  "fd522bbb-37b0-4b71-838e-fd022c542b00",
  "66377b9f-27ec-4f93-8162-9a4d51bbcbf0",
];

function getToken() {
  const token = tokens[tokenAmount];
  if (tokenAmount + 1 >= tokens.length) tokenAmount = 0;
  else tokenAmount += 1;
  return token;
}

async function fetchFromDB(club, id) {
  return fetch(`https://futdb.app/api/${club ? "clubs" : "leagues"}/${id}`, {
    headers: {
      "X-AUTH-TOKEN": getToken(),
    },
  })
    .then((response) => {
      return response.json();
    })
    .then(async (data) => {
      clubQuestion = club;
      if(!club) document.getElementById("dislike-btn").style.cssText = "display: none"
      else document.getElementById("dislike-btn").style.cssText = ""
      currentName = data.item.name;
      return data.item.name;
    })
    .catch((err) => {
      if (club) clubsAmount = id > 674 ? 0 : clubsAmount + 1;
      else leaguesAmount = id > 49 ? 0 : leaguesAmount + 1;
      return fetchFromDB(club, club ? clubsAmount : leaguesAmount);
    });
}

async function setFromDB(club, id) {
  return fetch(
    `https://futdb.app/api/${club ? "clubs" : "leagues"}/${id}/image`,
    {
      headers: {
        "X-AUTH-TOKEN": getToken(),
      },
    }
  )
    .then((response) => {
      if (response.ok) {
        response.blob().then((blobResponse) => {
          const urlCreator = window.URL || window.webkitURL;
          document.getElementById("clubimg").src =
            urlCreator.createObjectURL(blobResponse);
        });
      } else {
        if (clubsAmount <= leaguesAmount) clubsAmount += 1;
        else clubsAmount += 1;
        return setFromDB(club, clubsAmount);
      }
    })
    .catch((err) => {
      if (clubsAmount <= leaguesAmount) clubsAmount += 1;
      else leaguesAmount = leaguesAmount + 1;
      return setFromDB(club, leaguesAmount);
    });
}

function createQuestion() {
  const choices = Array.from(document.getElementsByClassName("choice-text"));
  choices.forEach((choice) => {
    choice.textContent = "Loading..";
  });
  const clubQuestion = clubsAmount <= leaguesAmount;
  const answerId = Math.floor(Math.random() * 4) + 1;
  fetchFromDB(clubQuestion, clubQuestion ? clubsAmount : leaguesAmount).then(
    (name) => {
      setFromDB(clubQuestion, clubQuestion ? clubsAmount : leaguesAmount).then(
        () => {
          const currentNumbers = [];
          choices.forEach((choice, count) => {
            if (count + 1 === answerId) {
              choice.textContent = name;
              choice.addEventListener(
                "click",
                () => {
                  score += 10;
                  document.getElementById("score").textContent = score;
                  choices.forEach((eChoice) => {
                    eChoice.replaceWith(eChoice.cloneNode(true));
                  });
                  createQuestion();
                },
                true
              );
            } else {
              choice.addEventListener(
                "click",
                () => {
                  updateUser(score);
                  window.location = "/leaderboard";
                },
                true
              );
              const numb = getRandomNumber(currentNumbers, clubQuestion);
              currentNumbers.push(numb);
              fetchFromDB(clubQuestion, numb).then((choiceName) => {
                choice.textContent = choiceName;
              });
            }
          });
        }
      );
    }
  );
}

function getRandomNumber(notAllowed, clubQuestion) {
  let result = 0;
  do {
    result = Math.floor(Math.random() * (clubQuestion ? 674 : 49)) + 1;
  } while (notAllowed.includes(result));
  return result;
}

function startGame() {
  reloadPage();
  createQuestion();
  document.getElementById("dislike-btn").onclick = () => {
    if (clubQuestion) blacklistClub(currentName);
  }
  document.getElementById("like-btn").onclick = () => {
    if (clubQuestion) {
      console.log("Hye");
      likeClub(currentName);
    }
    else likeLeague(currentName);
  }
}

function reloadPage() {
  window.addEventListener("pageshow", function (event) {
    var historyTraversal = event.persisted ||
      (typeof window.performance != "undefined" &&
        window.performance.navigation.type === 2);
    if (historyTraversal) {
      window.location.reload();
    }
  });
}

startGame();
