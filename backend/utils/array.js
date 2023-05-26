function arrayToString(list) {
    let string = "";
    list.forEach((li) => string = + li + ", ");
    return string.length > 1 ? string.substring(0, string.length - 2) : string;
}

function stringToArray(string) {
    return string.split(", ");
}

module.exports = {
    arrayToString: arrayToString,
    stringToArray: stringToArray,
}