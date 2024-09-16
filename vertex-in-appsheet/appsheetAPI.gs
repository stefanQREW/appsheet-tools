
/**
 * Add a new Row to AppSheet
 * @param {Array[Object]} rows Array of row objects you want to add or update. object properties should match exactly your column names in AppSheet
 * @param {string} table Name of the AppSheet table you want to target - mus URL encode if you have spaces or special characters. 
 * @return {Array[Object]} Array of rows updated
 */
function postAppSheet(rows, table) {
    var appsheet_url = "https://api.appsheet.com/api/v2/apps/"
        + APP_ID
        + "/tables/" + table
        + "/Action?applicationAccessKey=" + ACCESS_KEY;

    //payload for AppSheet API
    var payload = JSON.stringify({
        "Action": "Add",
        "Properties": { "Timezone": TIMEZONE },
        "Rows": rows
    });

    // Options for UrlFetchApp
    var options = {
        "method": "post",
        'contentType': 'application/json',
        "payload": payload,
        "muteHttpExceptions": true
    }

    // Sends above payload to AppSheet
    var response = UrlFetchApp.fetch(appsheet_url, options);
    return response;
}
