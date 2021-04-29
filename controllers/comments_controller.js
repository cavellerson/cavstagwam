const bcrypt = require('bcrypt')
const express = require('express')
const comments = express.Router()
const pool = require("../db")

const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
        return next()
    } else {
        res.redirect('/sessions/login')
    }
}

comments.use(isAuthenticated)

// create a comment
comments.post('/:postID', isAuthenticated, async(req, res) => {
    try {
        const post_id = parseInt(req.params.postID)
        const username = req.session.currentUser[0]
        const comment = req.body.comment

        const newComment = await pool.query("INSERT INTO comments (username, comment, post_id) VALUES($1,$2,$3)", [username, comment, post_id])
        // console.log(`post_id: ${post_id}\n username: ${username} \n comment: ${comment}`);
        res.redirect('back');


    } catch (err) {
        console.error(err.message)
    }



})

//

module.exports = comments;
