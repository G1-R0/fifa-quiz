/**
 * Deze functie geeft alle gebruikers terug via een aangemaakte post request die naar een functie gaat in de backend.
 */
export async function getUsers() {
  return await fetch("/user/getall", { method: "POST" })
    .then((result) => result.json())
    .then((data) => {
      if (data.status === "SUCCESS") return data.users;
      else return [];
    });
}

/**
 * Deze functie saved een gebruiker via een aangemaakte post request die naar een functie gaat in de backend.
 * Deze actie wordt uitgevoerd wanneer de user op de 'continue' duwt in de modal die vraagt om zijn gebruikersnaam.
 */

export async function saveUser(name) {
  postData("/user/save", { name: name }).then((data) => {
    const date = new Date();
    date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000);
    let expires = "expires=" + date.toUTCString();
    document.cookie = "token=" + data.user.token + ";" + expires + ";path=/"; // Hier wordt een cookie aangemaakt met de id token van ge gebruiker.
    const hiUser = document.getElementById("navbarDropdown");
    hiUser.text = "Hi, " + data.user.name + "!";
  });
}

export function updateUser(score) {
  postData("/user/update", { score: score });
}

export function blacklistClub(club) {
  postData("/user/blacklistclub", { club: club });
}

export function likeClub(club) {
  postData("/user/likeclub", { club: club });
}

export function likeLeague(club) {
  postData("/user/likeleague", { club: club });
}

export function unblacklistClub(club) {
  postData("/user/unblacklistclub", { club: club });
}

export function unlikeClub(club) {
  postData("/user/unlikeclub", { club: club }).then((d) => console.log(d));
}

export function unlikeLeague(club) {
  postData("/user/unlikeleague", { club: club });
}

/**
 * Deze functie checked of de user is ingelogd via een aangemaakte post request die naar een functie gaat in de backend.
 * Deze functie moet uitgevoerd worden aan het laden van elke pagina, behalve de landingspage.
 */
export async function checkLogin() {
  return await postData("/user/get", {}).then((result) => {
    if (result.status === "SUCCESS") return result.user;
    else return undefined;
  });
}

/**
 * Deze functie zorgt ervoor dat we cookie's kunnen pakken van de user.
 * https://www.w3schools.com/js/js_cookies.asp
 */
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/**
 * Deze functie verstuurt de post requests. 
 * En returned daarna de response in json.
 */
async function postData(url, data) {
  const response = await fetch(url, {
    method: "POST", // Zorgt dat het een post request is.
    mode: "cors", // Zorgt dat de request ook naar andere ports kunnen gestuurd worden.
    cache: "no-cache", // Zorgt dat de request niet worden gecached.
    credentials: "same-origin", // Zorgt dat informatie niet kan worden gefetched van andere origins.
    headers: {
      "Content-Type": "application/json",
      Authorization: getCookie("token"), // Zorgt dat de user zijn cookie token in de headers zit zodat we deze bij de backend eruit kunnen halen.
    },
    body: JSON.stringify(data), // Geeft data mee in de vorm van JSON.
  });
  return response.json();
}
