const express = require('express')
const searchUsers = express.Router()
const pool = require('../db')

const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
        return next()
    } else {
        res.redirect('/sessions/login')
    }
}

searchUsers.use(isAuthenticated)

// searchUsers.get('/users/all', isAuthenticated, async(req, res) => {
//     try {
//         const queryAllUsers = await pool.query("SELECT * FROM usernames;")
//         let allUsersList = []
//         for (let usernameEntry of queryAllUsers["rows"]) {
//             if (usernameEntry["username"]!=req.session.currentUser[0]) {
//                 allUsersList.push(usernameEntry["username"])
//             }
//         }
//         // console.log(allUsersList);
//         res.render('searchUsers.ejs', {
//             allUsersList: allUsersList
//         })
//     } catch(error) {
//         console.error(error);
//     }
// })

searchUsers.post('/', isAuthenticated, (req, res) => {
    // console.log(req.body.searchInput);
    res.redirect(`/${req.body.searchInput}`)
})
module.exports = searchUsers;
