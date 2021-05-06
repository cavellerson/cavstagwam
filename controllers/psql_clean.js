// const express = require('express')
// const psql = express.Router()
// const pool = require("../db")
//
//
//
// const isAuthenticated = (req, res, next) => {
//     if (req.session.currentUser) {
//         return next()
//     } else {
//         res.redirect('/sessions/login')
//     }
// }
//
// psql.use(isAuthenticated)
//
// psql.get('/', isAuthenticated, async(req, res) => {
//     try {
//
//
//
//
//         res.render('psqltest.ejs')
//
//
//     } catch (error) {
//         console.log(error);
//     }
// })
//
// module.exports = psql;
