const express = require('express');
const likes = express.Router();
const pool = require("../db")


const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
        return next()
    } else {
        res.redirect('/sessions/login')
    }
}

likes.use(isAuthenticated)

likes.post('/like/:username/:postID', isAuthenticated, async(req, res) => {
    try {
        const likePost = await pool.query("UPDATE posts SET likes = likes + 1 WHERE post_id = $1;",[req.params.postID])

        const createLike = await pool.query("INSERT INTO likes (username, post_id) VALUES($1,$2) returning *", [req.session.currentUser[0], req.params.postID])

        //create like notification
        let current_session_user = req.session.currentUser[0]
        let action = "liked"
        const date = new Date();
        let notification_date = date.toDateString()

        const newNotification = await pool.query("INSERT INTO notifications (current_session_user, action, username, post_id, notification_date) VALUES($1, $2, $3, $4, $5)", [current_session_user, action, req.params.username, req.params.postID, notification_date])

        res.redirect('back');

    } catch (err) {
        console.error(err.message)
    }
})

likes.post('/unlike/:username/:postID', isAuthenticated, async(req, res) => {
    try {
        const unlikePost = await pool.query("UPDATE posts SET likes = likes - 1 WHERE post_id = $1", [req.params.postID])

        const createUnlike = await pool.query("DELETE FROM likes WHERE username = $1 AND post_id = $2", [req.session.currentUser[0], req.params.postID])

        //delete like notification
        const deleteNotification = await pool.query("DELETE FROM notifications WHERE current_session_user = $1 AND action = $2 AND username = $3 AND post_id = $4", [req.session.currentUser[0], 'liked', req.params.username, req.params.postID])


        res.redirect('back');

    } catch (err) {
        console.error(err.message)
    }
})

module.exports = likes;
