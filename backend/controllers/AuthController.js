const dbretriever = require('../dbretriever');
const bcrypt = require('bcrypt');

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
                return res.status(200).json({message: "Logged in successfuly"});
            } else {
                return res.status(401).json({error: "Invalid username or password"});
            }
        })
    })
}