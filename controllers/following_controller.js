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
        // makes a follow entry
        let followingUser = req.params.username
        let username = req.session.currentUser[0]

        const newFollow = await pool.query(
            "INSERT INTO followers (username, following) VALUES($1,$2) RETURNING *", [username, followingUser]
        )

        //created variable for notification entry
        let current_session_user = req.session.currentUser[0]
        let action = "following"
        const date = new Date();
        // console.log(notification_date);
        // create newNotification
        let notification_date = date.toDateString()
        // console.log(notification_date);

        const newNotification = await pool.query("INSERT INTO notifications (current_session_user, action, username, notification_date) VALUES($1, $2, $3, $4) RETURNING *", [current_session_user, action, followingUser, notification_date])

        // console.log(newNotification);



        res.redirect(`back`)
    } catch (err) {
        console.error(err.message)
    }
})



module.exports = followers;
