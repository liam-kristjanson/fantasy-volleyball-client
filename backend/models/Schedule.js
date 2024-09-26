const dbretriever = require("../dbretriever")
const League = require("./League")

module.exports.create = async (leagueId) => {
    const leagueIds = await League.getUserIds(leagueId);

    const scheduleTemplate = await dbretriever.fetchOneDocument('schedule_templates', {numTeams: leagueIds.length});

    const schedule = scheduleTemplate.schedule;

    let matchupCreationPromises = [];
    for (let weekIdx = 0; weekIdx < schedule.length; weekIdx++) {
        let newMatchupDocument = {
            leagueId: leagueId,
            weekNum: (weekIdx + 1),
            matchupIds: []
        }
        for (let matchIdx = 0; matchIdx < schedule[weekIdx].length; matchIdx++) {
            //in the schedule template, teams are labeled 1, 2, 3, 4 etc.
            //Need to offset this by one to match the index in the array of user ids.
            const homeIdIndex = schedule[weekIdx][matchIdx][0] - 1;
            const awayIdIndex = schedule[weekIdx][matchIdx][1] - 1;


            newMatchupDocument.matchupIds.push({
                homeId: leagueIds[homeIdIndex],
                awayId: leagueIds[awayIdIndex]
            })
        }

        const insertionResult = dbretriever.insertOne('matchups', newMatchupDocument);
        matchupCreationPromises.push(insertionResult);
    }

    return await Promise.all(matchupCreationPromises);
}