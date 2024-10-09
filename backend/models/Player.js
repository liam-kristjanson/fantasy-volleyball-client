const dbretriever = require('../dbretriever')

module.exports.resetAllPointsTotals = async () => {
    const result = await dbretriever.updateMany('players', {}, {$set: {seasonTotalPoints: 0}});

    return result.acknowledged;
}