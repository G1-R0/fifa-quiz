import { getUsers } from "../api/userActions.js";

const lbBody = document.getElementById("lb-body");
if (lbBody) {
    getUsers().then((users) => {
        users.sort((o1, o2) => o2.highScore - o1.highScore).forEach((user, count) => {
            const newTR = document.createElement("tr");
            const rankTD = document.createElement("td");
            const nameTD = document.createElement("td");
            const scoreTD = document.createElement("td");
            rankTD.textContent = count + 1;
            nameTD.textContent = user.name;
            scoreTD.textContent = user.highScore;
            newTR.appendChild(rankTD);
            newTR.appendChild(nameTD);
            newTR.appendChild(scoreTD);
            lbBody.appendChild(newTR);
        });
    })
}
