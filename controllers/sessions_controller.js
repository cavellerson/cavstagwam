const bcrypt = require('bcrypt')
const express = require('express')
const sessions = express.Router()
const pool = require("../db.js")

sessions.get('/new', async(req, res) => {
    try {
        const foundUser = await pool.query(
            `SELECT username FROM usernames WHERE username='${req.body.username}';`
        )
        console.log(foundUser.rows[0]["username"]);
        res.send(req.session.currentUser)
    } catch (err) {
        console.error(err.message);
    }

})

sessions.post('/', async(req, res) => {
    const queryData = await pool.query(
        `SELECT * FROM usernames WHERE username='${req.body.username}'`
    )
    console.log(`QueryData: ${JSON.stringify(queryData["rows"])}`);
    console.log("current user:",req.session);

    const queryUserData = await pool.query(
        `SELECT username FROM usernames WHERE username='${req.body.username}'`
    )
    const foundUsername = queryUserData["rows"][0]["username"]
    console.log(`found username: ${foundUsername}`);

    const queryPasswordData = await pool.query(
        `SELECT password FROM usernames WHERE username='${req.body.username}'`
    )
    // console.log(`password data: ${queryPasswordData}`);
    // console.log(queryPasswordData);
    const foundPassword = queryPasswordData["rows"][0]["password"]
    // console.log(foundPassword);
    if (!foundUsername) {
        res.send('Sorry user not found')
    }
    if (bcrypt.compareSync(req.body.password, foundPassword)) {
        console.log("passwords match");
        req.session.currentUser = [foundUsername, foundPassword]
    }
})



module.exports = sessions;
