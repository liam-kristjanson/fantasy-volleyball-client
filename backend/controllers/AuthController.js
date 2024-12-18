require('dotenv').config();
const dbretriever = require('../dbretriever');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {ObjectId} = require('mongodb');
const fantasyUtilities = require('../FantasyUtilities');
const settingsController = require('./SettingsController');
const Settings = require('../models/Settings')
const Lineup = require('../models/Lineup')
const Roster = require('../models/Roster')
const User = require('../models/User')

module.exports.login = (req, res) => {
    //validation

    if (!req.body.username || !req.body.password) {
        return res.status(400).json({error: "Username and password must be defined"});
    }

    dbretriever.fetchOneDocument('users', {username: req.body.username})
    .then(matchedAccount => {
        if (!matchedAccount) {
            return res.status(401).json({error: "Invalid username or password"});
        }

        bcrypt.compare(req.body.password, matchedAccount.password)
        .then(compareResult => {
            if (compareResult === true) {
                //login is successful, generate auth data for client
                const userData = {
                    userId: matchedAccount._id,
                    username: matchedAccount.username,
                    role: matchedAccount.role,
                    leagueId: matchedAccount.leagueId,
                }

                //generate auth token for session validation
                userData.authToken = jwt.sign(userData, process.env.JWT_SECRET)

                return res.status(200).json({message: "Logged in successfuly", user: userData});
            } else {
                return res.status(401).json({error: "Invalid username or password"});
            }
        })
    })
    .catch(error => {
        console.error(error);
        return res.status(500).json({error: "500: Internal server error"});
    })
}

module.exports.parseAuthToken = (req, res, next) => {
    //if no claim token is presented, skip this step.
    if (!req.headers.authorization) return next();

    try {
        //console.log("Claim token: " + req.headers.authorization);
        req.authData = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        //console.log("Verified auth data: ");
        //console.log(req.authData);
    } catch (e) {
        console.error("Error parsing jwt token:", e);
    } finally {
        next();
    }
}

module.exports.createAccount = async (req, res, next) => {

    try {
        //validation
        if (!req.body.leagueId || !req.body.username || !req.body.password) {
            return res.status(400).json({error: "leagueId, username, and password must be specified in request body"});
        }

        if (req.body.username.length < 6 || req.body.username.length > 30) {
            return res.status(400).json({error: "Username must be between 6 and 30 characters"});
        }

        if (req.body.password.length < 6 || req.body.password.length > 30) {
            return res.status(400).json({error: "Password must be between 6 and 30 characters"});
        }

        if (!ObjectId.isValid(req.body.leagueId)) {
            return res.status(400).json({error: "Invalid league id"});
        }

        const league = await dbretriever.fetchOneDocument('leagues', {_id: new ObjectId(req.body.leagueId)});

        if (!league) {
            return res.status(400).json({error: "Invalid league id"});
        }

        const existingAccountWithSameUsername = await dbretriever.fetchOneDocument('users', {username: req.body.username});

        if (existingAccountWithSameUsername) return res.status(403).json({error: "Another account already exists with the requested username"})

        const userCreationSuccess = await User.create(req.body);

        return res.status(200).json({message: "Your account was created successfuly. You may now log in."});
    } catch (err) {
        return next(err);
    }
}

module.exports.verifyAdmin = (req, res, next) => {
    if (req.authData?.role === "admin") {
        next();
    } else {
        return res.status(401).json({error: "Unauthorized"});
    }
}

module.exports.updatePassword = async (req, res, next) => {
    try {
        if (!req.authData) {
            return res.status(401).json({error: "Unauthorized"});
        }

        if (!req.body?.oldPassword || !req.body?.newPassword) {
            return res.status(400).json({error: "oldPassword and newPassword must be specified in request body"});
        }

        const userDocument = await dbretriever.fetchDocumentById('users', req.authData.userId);

        const oldPasswordMatch = await bcrypt.compare(req.body.oldPassword, userDocument.password);

        if (!oldPasswordMatch) {
            return res.status(401).json({error: "Incorrect old password"});
        }

        const passwordUpdateSuccess = await User.updatePassword(req.authData.userId, req.body.newPassword);

        if (passwordUpdateSuccess) {
            return res.status(200).json({message: "Password updated successfuly"});
        } else {
            throw new Error("Failed to update password");
        }

    } catch (err) {
        next(err);
    }
}

