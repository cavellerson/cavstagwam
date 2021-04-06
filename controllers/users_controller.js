const express = require('express')
const bcrypt = require('bcrypt')
const users = express.Router()
const pool = require("../db.js")

users.get('/new', (req, res) => {
    res.render('newUser.ejs'
    // , {
    //     currentUser: req.session.currentUser
    // }
)
    console.log(`logging req.session.current user:  ${req.session.currentUser}`);
})

users.post('/new', async(req, res) => {
    try {
        req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))

        const newUser = await pool.query(
            "INSERT INTO usernames (username, password) VALUES ($1, $2) RETURNING *", [req.body.username, req.body.password]
        )



        // console.log(req.body.username,password);
    } catch (err) {
        console.error(err.message)
    }

})

module.exports = users;
