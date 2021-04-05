const bcrypt = require('bcrypt')
const express = require('express')
const posts = express.Router()
const pool = require("../db")
//create a posts
posts.get('/create', (req, res) => {
    res.render('createPost.ejs')
})
posts.post('/create', async(req, res) => {
    try {

        let { description } = req.body
        let { username } = req.body
        let { likes } = req.body
        let { image } = req.body
        console.log(`req.body: ${JSON.stringify(req.body)}`);
        const newPost = await pool.query(
            "INSERT INTO posts (description, username, likes, image) VALUES($1,$2,$3,$4) RETURNING *", [description, username, likes, image]
        )
        // res.json(newPost.rows[0])

        // console.log(req.body.username, description, likes, image);

        res.redirect('/posts')
    } catch (err) {
        console.error(err.message);
    }
})

// get all posts
posts.get('/', async(req, res) => {
    try {
        const post = await pool.query("SELECT * FROM posts;")
        console.log(post.rows);
        res.render('home.ejs', {
            allPosts: post.rows
        })
    }
    catch (err) {
        console.error(err.message);
    }

})

// update a post
posts.put('/:id', async(req, res) => {
    try {
        const { id } = req.params
        const { description } = req.body
        const updatePost = await pool.query("UPDATE posts SET description = $1 WHERE post_id = $2", [description, id])
        res.json("Post was updated")
    }
    catch (err) {
        console.error(message)
    }
})

// delete a post
posts.delete('/posts/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const deletePost = await pool.query("DELETE FROM posts WHERE post_id = $1", [id])
        res.json("Post was deleted")
    }
    catch (err){
        console.error(err.message)
    }
})

module.exports = posts
