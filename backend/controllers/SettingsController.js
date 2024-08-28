require('dotenv').config();
const fantasyUtilities = require('../FantasyUtilities');

module.exports.getAppSettings = async (req, res) => {
    try {
        const appSettings = await fantasyUtilities.getAppSettings();
        return res.status(200).json(appSettings);
    } catch (e) {
        console.error(e);
        return res.status(500).json({error: "500: Internal server error"})
    }
}