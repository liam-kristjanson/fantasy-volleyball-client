require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRounds= parseInt(process.env.SALT_ROUNDS);
const plaintextPassword = "password";

// bcrypt.hash(plaintextPassword, saltRounds, (err, hash) => {
//     console.log('Hashed password: \n' + hash);
// })

// let compareResult = bcrypt.compareSync(plaintextPassword, "hashedpassword")

// console.log("Compare result: " + compareResult);