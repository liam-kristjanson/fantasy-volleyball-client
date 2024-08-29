require('dotenv').config();
const dbretriever = require('../dbretriever');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.login = (req, res) => {
    //validation

    console.log(req.body);

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
        console.log("Claim token: " + req.headers.authorization);
        req.authData = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        console.log("Verified auth data: ");
        console.log(req.authData);
    } catch (e) {
        console.error("Error parsing jwt token:", e);
    } finally {
        next();
    }
}

