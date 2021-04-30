const bcrypt = require('bcrypt')
const express = require('express')
const followers = express.Router()
const pool = require("../db")

const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
        return next()
    } else {
        res.redirect('/sessions/login')
    }
}

followers.use(isAuthenticated)

followers.post('/action/:username', isAuthenticated, async(req, res) => {
    try {

        let followingUser = req.params.username
        let username = req.session.currentUser[0]

        const newFollow = await pool.query(
            "INSERT INTO followers (username, following) VALUES($1,$2) RETURNING *", [username, followingUser]
        )
        res.redirect(`/${followingUser}`)
    } catch (err) {
        console.error(err.message)
    }
})



module.exports = followers;
