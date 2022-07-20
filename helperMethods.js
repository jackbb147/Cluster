const {prettyPrintJson} = require("pretty-print-json");

function print(...thing){
    console.log(...thing);
}

/**
 * pretty prints a JSON object
 * @return
 */
function printJSON(json){
    return `<pre>${prettyPrintJson.toHtml(json)}</pre> <br>`;
}


module.exports = {
    print,
    printJSON
}