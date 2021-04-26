const bcrypt = require('bcrypt')
const express = require('express')
const sessions = express.Router()
const pool = require("../db.js")


sessions.get('/login', async(req, res) => {
        // console.log("current user:" ,req.body.username);
        res.render('loginUser.ejs',
        {
            currentUser: req.session.currentUser,
            username: req.body.username
        }
        )


})

sessions.post('/login', async(req, res) => {
    const queryData = await pool.query(
        `SELECT * FROM usernames WHERE username='${req.body.username}'`
    )
    // console.log(`QueryData: ${JSON.stringify(queryData["rows"])}`);
    // console.log("current user:",req.session);

    const queryUserData = await pool.query(
        `SELECT username FROM usernames WHERE username='${req.body.username}'`
    )
    const foundUsername = queryUserData["rows"][0]["username"]
    // console.log(`found username: ${foundUsername}`);

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
        // console.log("passwords match");
        req.session.currentUser = [foundUsername, foundPassword]
        res.redirect('/feed/explore')
    } else {
        res.redirect('/sessions/login')
    }
})

sessions.delete('/', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/sessions/login')
    })
})

module.exports = sessions;
