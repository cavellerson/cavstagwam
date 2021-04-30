const express = require('express')
const bcrypt = require('bcrypt')
const users = express.Router()
const pool = require("../db.js")


users.get('/new', (req, res) => {
    res.render('newUser.ejs')
    // console.log(res);
    // , {
    //     currentUser: req.session.currentUser
    // }

    // console.log(`logging req.session.current user:  ${req.session.currentUser}`);
})

users.post('/new', async(req, res) => {
    try {
        req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
        const queryForUser = await pool.query("SELECT * FROM usernames WHERE username = $1", [req.body.username])
        if (queryForUser["rows"].includes(req.body.username)) {
            res.send("this username is taken, please try enter another username <a href='/users/new'>Go Back</a>")
            res.redirect('/users/new')
        } else {
            const newUser = await pool.query(
                "INSERT INTO usernames (username, password) VALUES ($1, $2) RETURNING *", [req.body.username, req.body.password]
            )
            res.redirect('/sessions/login')
        }


        // console.log(newUser.rows[0]);


        // console.log(req.body.username,password);
    } catch (err) {
        console.error(err.message)
    }

})

module.exports = users;
