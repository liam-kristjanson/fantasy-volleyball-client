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
const matchupController = require('./controllers/MatchupController')
const adminController = require('./controllers/AdminController')
const standingsController = require('./controllers/StandingsController')

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
app.use('/admin/', authController.verifyAdmin);

//wakeup or status check route
app.get("/", (req, res) => {
    res.send("Service is running...");
})

//api routes
app.get("/app-settings", settingsController.fetchAppSettings);

app.post("/login", authController.login);
app.post("/account/create", authController.createAccount);

app.get("/players", playerController.getRankedPlayers);
app.get("/player-matches", playerController.getPlayerMatches);

app.get("/roster", rosterController.getRoster);
app.post("/roster/drop-player", rosterController.dropPlayer);

app.get("/lineup", lineupController.getLineup);
app.get("/lineup/score", lineupController.getLineupScore);
app.get("/lineup/max-week", lineupController.lineupWeeks);
app.post("/lineup/swap", lineupController.lineupSwap);
app.get("/lineup/bench", lineupController.getBench);

app.get("/teams", rosterController.getTeams);

app.get("/standings", standingsController.getStandings);

app.get("/free-agents", rosterController.getFreeAgents);
app.post("/free-agents/sign", rosterController.signFreeAgent);

app.get("/matchup/scores", matchupController.getMatchupScores);

app.post("/admin/create-next-week-lineups", adminController.createNextWeekLineups);
app.post("/admin/start-next-week", adminController.startNextWeek);
app.post("/admin/refresh-standings", adminController.refreshStandings);
app.post("/admin/reset-standings", adminController.resetStandings);
app.post("/admin/create-schedule", adminController.createSchedule);
app.get("/admin/leagues", adminController.getLeagues);
app.get("/admin/users", adminController.getUsers);
app.post("/admin/reset-all", adminController.resetAll);
app.post("/admin/lock-lineups", adminController.lockLineups);
app.post("/admin/unlock-lineups", adminController.unlockLineups);
app.post("/admin/match-data", adminController.uploadMatchData);
app.post("/admin/create-league", adminController.createLeague);

//default error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).json({error: "500: Internal server error."})
})

app.listen(PORT, () => {
    console.log("Process running on http://localhost:" + PORT + " ...");
})
