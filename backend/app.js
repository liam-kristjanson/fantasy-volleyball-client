require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const dbretriever = require('./dbretriever');

const playerController = require('./controllers/PlayerController');
const authController = require('./controllers/AuthController');
const rosterController = require('./controllers/RosterController');
const lineupController = require('./controllers/LineupController');
const settingsController = require('./controllers/SettingsController');

const PORT = process.env.PORT || 8080;
const corsOptions = {
    origin: process.env.FRONT_ORIGIN,
    optionsSuccessStatus: 204,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE"
};

const app = express();

//middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(authController.parseAuthToken);

app.get("/", (req, res) => {
    res.send("Service is running...");
})

app.get("/app-settings", settingsController.getAppSettings);

app.post("/login", authController.login);

app.get("/players", playerController.getRankedPlayers);
app.get("/player-matches", playerController.getPlayerMatches);

app.get("/roster", rosterController.getRoster);
app.post("/roster/drop-player", rosterController.dropPlayer);

app.get("/lineup", lineupController.getLineup);
app.get("/lineup/score", lineupController.getLineupScore);
app.get("/lineup/max-week", lineupController.lineupWeeks);

app.get("/teams", rosterController.getTeams);

app.get("/free-agents", rosterController.getFreeAgents);
app.post("/free-agents/sign", rosterController.signFreeAgent);

//default error handler
app.use((err, req, res, next) => {
    console.error(err.stack);

    return res.status(500).json({error: "500: Internal server error dh"})
})

app.listen(PORT, () => {
    console.log("Process running on http://localhost:" + PORT + " ...");
})
