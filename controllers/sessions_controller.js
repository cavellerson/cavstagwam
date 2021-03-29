const bcrypt = require('bcrypt')
const express = require('express')
const sessions = express.Router()
const pool = require("../db.js")

sessions.get('/new', (req, res) => {
    res.send(req.session.currentUser)
})

// sessions.post('/', async(req, res) => {
//     try {
//         const foundUser = await pool.query(
//             "SELECT * FROM usernames WHERE password=($1)", [req.body.username]
//         )
//         const foundPassword = await pool.query
//     }
// })
