const bcrypt = require('bcrypt')
const express = require('express')
const unfollows = express.Router()
const pool = require("../db")

const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
        return next()
    } else {
        res.redirect('/sessions/login')
    }
}

unfollows.use(isAuthenticated)



unfollows.delete('/:username', isAuthenticated, async(req, res) => {
    try {
        let username = req.session.currentUser[0]
        let followingUser = req.params.username

        const queryData = await pool.query(
            "SELECT * FROM followers WHERE username = $1", [username]
        )
        // console.log(queryData["rows"]);


        const newUnfollow = await pool.query(
            "DELETE FROM followers WHERE username=$1 AND following=$2", [username, followingUser]
        )

        res.redirect(`/${req.params.username}`)
    } catch (err) {
        console.error(err.message)
    }
})



module.exports = unfollows;
