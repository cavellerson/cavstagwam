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

        res.redirect('/')
    } catch (err) {
        console.error(err.message)
    }
})

likes.post('/unlike/:username/:postID', isAuthenticated, async(req, res) => {
    try {
        const unlikePost = await pool.query("UPDATE posts SET likes = likes - 1 WHERE post_id = $1", [req.params.postID])

        const createUnlike = await pool.query("DELETE FROM likes WHERE username = $1 AND post_id = $2", [req.session.currentUser[0], req.params.postID])

        res.redirect('/')
    } catch (err) {
        console.error(err.message)
    }
})

module.exports = likes;
