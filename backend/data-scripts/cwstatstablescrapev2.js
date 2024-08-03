//cw updated their box score page, thus i need to remake this script.

(function(console){

    console.save = function(data, filename){
    
        if(!data) {
            console.error('Console.save: No data')
            return;
        }
    
        if(!filename) filename = 'console.json'
    
        if(typeof data === "object"){
            data = JSON.stringify(data, undefined, 4)
        }
    
        var blob = new Blob([data], {type: 'text/json'}),
            e    = document.createEvent('MouseEvents'),
            a    = document.createElement('a')
    
        a.download = filename
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)
     }
    })(console)

let statTables = document.querySelectorAll('div.stats-fullbox table');
let team1StatsTable = statTables[1];
let team1StatRows = team1StatsTable.rows;
let team2StatsTable = statTables[2];
let team2StatRows = team2StatsTable.rows;

let combinedStatsObject = {};

function mapRowToStatsObject(row) {
    console.log(row);
    if (row.children[0].textContent != "TM") {
        let rowNameCell = row.children[1];

        let playerName;
        if (rowNameCell.children.length > 0) {
            playerName = rowNameCell.children[0].textContent.trim();
        } else {
            playerName = rowNameCell.textContent.replaceAll("*","").trim();
        }


        combinedStatsObject[playerName] = {};
        
        combinedStatsObject[playerName].jerseyNumber = row.children[0].textContent;
        combinedStatsObject[playerName].kills = row.children[3].textContent;
        combinedStatsObject[playerName].errors = row.children[4].textContent;
        combinedStatsObject[playerName].attempts = row.children[5].textContent;
        combinedStatsObject[playerName].assists = row.children[7].textContent;
        combinedStatsObject[playerName].aces = row.children[8].textContent;
        combinedStatsObject[playerName].digs = row.children[11].textContent;
        combinedStatsObject[playerName].soloBlocks = row.children[12].textContent;
        combinedStatsObject[playerName].blockAssists = row.children[13].textContent;
    }
}

for (let i = 3; i<team1StatRows.length-1; i++) {
    mapRowToStatsObject(team1StatRows[i]);
}

for (let i = 3; i<team2StatRows.length-1; i++) {
    console.log(team2StatRows[i]);
    mapRowToStatsObject(team2StatRows[i]);
}

//get match title for filename
let titleElement = document.querySelector('h2')
let titleText = titleElement.textContent.replaceAll(" ", "");

//get current time for filename
let date = new Date().toJSON();

let filename = titleText + '.json';

console.save(combinedStatsObject, filename);